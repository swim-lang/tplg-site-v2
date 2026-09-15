import { createClient } from "@supabase/supabase-js";
import { CONTENT_FIELDS } from "../cms/content-fields.js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const configured = Boolean(supabaseUrl && publishableKey);
const supabase = configured ? createClient(supabaseUrl, publishableKey) : null;
const ADMIN_ACCOUNT_EMAIL = "admin@thepoliticallaw.group";

const loginPanel = document.querySelector("#login-panel");
const setupPanel = document.querySelector("#setup-panel");
const editorShell = document.querySelector("#editor-shell");
const loginForm = document.querySelector("#login-form");
const loginStatus = document.querySelector("#login-status");
const editorEmail = document.querySelector("#editor-email");
const navigation = document.querySelector("#editor-navigation");
const sectionTitle = document.querySelector("#section-title");
const contentForm = document.querySelector("#content-form");
const viewPageLink = document.querySelector("#view-page-link");
const saveButton = document.querySelector("#save-button");
const saveStatus = document.querySelector("#save-status");
const signOutButton = document.querySelector("#sign-out-button");

const pageLinks = {
  People: "../people/",
  "Nicholas Sanders": "../people/nicholas-sanders/",
  "Tracey Wigglesworth": "../people/tracey-wigglesworth/",
  "Emma Olson Sharkey": "../people/emma-olson-sharkey/",
  "Kristen Lippstreu": "../people/kristen-lippstreu/",
  "Why TPLG": "../practice/",
  "Practice Areas": "../practice/#practice-areas",
  Offices: "../offices/",
  Global: "../"
};

let activePage = CONTENT_FIELDS[0].page;
let values = new Map();
let initialValues = new Map();

function setStatus(element, message, isError = false) {
  element.textContent = message;
  element.dataset.error = String(isError);
}

function showOnly(panel) {
  [loginPanel, setupPanel, editorShell].forEach((item) => {
    item.hidden = item !== panel;
  });
}

function setBusy(button, busy) {
  button.disabled = busy;
  button.setAttribute("aria-busy", String(busy));
}

function renderNavigation() {
  navigation.replaceChildren();

  CONTENT_FIELDS.forEach((group) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = group.page;
    button.dataset.page = group.page;
    if (group.page === activePage) button.setAttribute("aria-current", "page");
    button.addEventListener("click", () => selectPage(group.page));
    navigation.append(button);
  });
}

function renderFields() {
  const group = CONTENT_FIELDS.find((item) => item.page === activePage);
  sectionTitle.textContent = group.page;
  viewPageLink.href = pageLinks[group.page] || "../";
  contentForm.replaceChildren();

  group.fields.forEach((field) => {
    const wrapper = document.createElement("label");
    wrapper.className = "field";

    const label = document.createElement("span");
    label.className = "field-label";
    label.textContent = field.label;

    const control = field.type === "textarea"
      ? document.createElement("textarea")
      : document.createElement("input");

    if (control instanceof HTMLInputElement) control.type = field.type;
    control.maxLength = 8000;
    control.name = field.key;
    control.value = values.get(field.key) ?? field.fallback;
    control.addEventListener("input", () => {
      values.set(field.key, control.value);
      updateDirtyState();
    });

    wrapper.append(label, control);
    contentForm.append(wrapper);
  });

  updateDirtyState();
  setStatus(saveStatus, "");
}

function selectPage(page) {
  if (page === activePage) return;

  const pending = changedFields();
  if (pending.length) {
    const shouldDiscard = window.confirm(
      "Leave this section and discard its unsaved changes?"
    );
    if (!shouldDiscard) return;

    pending.forEach((field) => {
      values.set(field.key, initialValues.get(field.key) ?? field.fallback);
    });
  }

  activePage = page;
  renderNavigation();
  renderFields();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function changedFields() {
  const group = CONTENT_FIELDS.find((item) => item.page === activePage);
  return group.fields.filter((field) => {
    const current = values.get(field.key) ?? field.fallback;
    const original = initialValues.get(field.key) ?? field.fallback;
    return current !== original;
  });
}

function updateDirtyState() {
  const count = changedFields().length;
  saveButton.textContent = count ? `Save ${count} change${count === 1 ? "" : "s"}` : "Save changes";
  saveButton.disabled = count === 0;
}

async function isAuthorizedEditor(userId) {
  const { data, error } = await supabase
    .from("cms_editors")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

async function loadEditor(session) {
  const authorized = await isAuthorizedEditor(session.user.id);
  if (!authorized) {
    await supabase.auth.signOut();
    throw new Error("This account does not have editing access.");
  }

  const { data, error } = await supabase
    .from("site_content")
    .select("content_key, content_value");

  if (error) throw error;

  values = new Map(data.map((row) => [row.content_key, row.content_value]));
  initialValues = new Map(values);
  editorEmail.textContent = "Shared administrator";
  renderNavigation();
  renderFields();
  showOnly(editorShell);
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = loginForm.querySelector("button[type='submit']");
  const formData = new FormData(loginForm);
  setBusy(submitButton, true);
  setStatus(loginStatus, "Signing in…");

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: ADMIN_ACCOUNT_EMAIL,
      password: formData.get("password")
    });

    if (error) throw error;
    await loadEditor(data.session);
  } catch (error) {
    setStatus(loginStatus, error.message || "Unable to sign in.", true);
  } finally {
    setBusy(submitButton, false);
  }
});

saveButton.addEventListener("click", async () => {
  if (!contentForm.reportValidity()) return;

  const fields = changedFields();
  if (!fields.length) return;

  setBusy(saveButton, true);
  setStatus(saveStatus, `Saving ${fields.length} change${fields.length === 1 ? "" : "s"}…`);

  try {
    const results = await Promise.all(
      fields.map(async (field) => {
        const rawValue = values.get(field.key) ?? field.fallback;
        const contentValue = field.type === "email" ? rawValue.trim() : rawValue;
        const { data, error } = await supabase
          .from("site_content")
          .update({ content_value: contentValue })
          .eq("content_key", field.key)
          .select("content_key")
          .maybeSingle();

        return {
          field,
          contentValue,
          error: error || (!data ? new Error("Update was not authorized.") : null)
        };
      })
    );

    const failed = results.filter((result) => result.error);
    results.filter((result) => !result.error).forEach((result) => {
      values.set(result.field.key, result.contentValue);
      initialValues.set(result.field.key, result.contentValue);
    });

    if (failed.length) {
      setStatus(
        saveStatus,
        `${failed.length} field${failed.length === 1 ? "" : "s"} could not be saved. Your other changes were saved.`,
        true
      );
    } else {
      setStatus(saveStatus, "Changes saved and are now live on the public site.");
    }
  } catch (error) {
    setStatus(saveStatus, error.message || "Changes could not be saved.", true);
  } finally {
    setBusy(saveButton, false);
    updateDirtyState();
  }
});

signOutButton.addEventListener("click", async () => {
  if (changedFields().length && !window.confirm("Sign out and discard unsaved changes?")) return;

  await supabase.auth.signOut();
  loginForm.reset();
  setStatus(loginStatus, "Signed out.");
  showOnly(loginPanel);
});

window.addEventListener("beforeunload", (event) => {
  if (!changedFields().length) return;
  event.preventDefault();
  event.returnValue = "";
});

async function initialize() {
  if (!configured) {
    showOnly(setupPanel);
    return;
  }

  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    showOnly(loginPanel);
    return;
  }

  try {
    await loadEditor(data.session);
  } catch (loadError) {
    setStatus(loginStatus, loadError.message || "Unable to load the editor.", true);
    showOnly(loginPanel);
  }
}

initialize();
