import { createClient } from "@supabase/supabase-js";
import { CONTENT_FIELDS } from "../cms/content-fields.js";
import { PEOPLE } from "../cms/site-data.js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const configured = Boolean(supabaseUrl && publishableKey);
const supabase = configured ? createClient(supabaseUrl, publishableKey, { auth: { storage: sessionStorage, storageKey: "tplg-admin-session", detectSessionInUrl: false } }) : null;
const ADMIN_ACCOUNT_EMAIL = "admin@thepoliticallaw.group";
const portraits = import.meta.glob(["../assets/*.webp", "!../assets/graham-willard.webp"], { eager: true, query: "?url", import: "default" });

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

let activePage = CONTENT_FIELDS[0].page;
let values = new Map();
let initialValues = new Map();
let versions = new Map();
let media = new Map();
let pendingPhoto = null;
let saving = false;
const activePerson = () => PEOPLE.find(p => p.name === activePage);
const dirty = () => changedFields().length > 0 || Boolean(pendingPhoto);
function clearPhoto() { if (pendingPhoto) URL.revokeObjectURL(pendingPhoto.preview); pendingPhoto = null; }

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
  viewPageLink.href = group.path || "../";
  contentForm.replaceChildren();
  const person = activePerson();
  if (person) {
    const box = document.createElement("fieldset");
    const legend = document.createElement("legend"); legend.textContent = "Portrait";
    const previews = document.createElement("div"); previews.className = "portrait-previews";
    const current = media.get(person.key);
    const source = current?.object_path ? supabase.storage.from("site-media").getPublicUrl(current.object_path).data.publicUrl : portraits[`../assets/${person.portrait}`];
    for (const label of ["People card", "Profile"]) {
      const figure = document.createElement("figure");
      const img = document.createElement("img"); img.src = pendingPhoto?.preview || source; img.alt = person.name;
      img.style.objectPosition = person.portraitTopBias ? "center 20%" : "center";
      const caption = document.createElement("figcaption"); caption.textContent = label;
      figure.append(img, caption); previews.append(figure);
    }
    const label = document.createElement("label"); label.textContent = "Replace portrait (JPEG, PNG or WebP; maximum 5 MB; minimum 600 × 600 pixels)";
    const input = document.createElement("input"); input.type = "file"; input.accept = "image/jpeg,image/png,image/webp";
    input.addEventListener("change", async () => {
      const file = input.files[0]; if (!file) return;
      const selectedPage = activePage;
      try {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) throw new Error("Choose a JPEG, PNG or WebP smaller than 5 MB.");
        const bitmap = await createImageBitmap(file);
        const { width, height } = bitmap; bitmap.close();
        if (selectedPage !== activePage || input.files[0] !== file) return;
        if (width < 600 || height < 600) throw new Error("Portraits must be at least 600 × 600 pixels.");
        clearPhoto(); pendingPhoto = { file, width, height, preview: URL.createObjectURL(file) };
        previews.querySelectorAll("img").forEach(img => { img.src = pendingPhoto.preview; });
        setStatus(saveStatus, "Portrait ready. Save to publish it."); updateDirtyState();
      } catch (error) { input.value = ""; setStatus(saveStatus, error.message, true); }
    });
    label.append(input); box.append(legend, previews, label); contentForm.append(box);
  }
  const cards = new Map();

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
    const cardKey = /^(insights|practice)\.[^.]+\./.test(field.key) && !field.key.includes(".heading.") ? field.key.split(".").slice(0, 2).join(".") : "Page copy";
    if (!cards.has(cardKey)) {
      const card = document.createElement("fieldset"); const legend = document.createElement("legend");
      legend.textContent = cardKey === "Page copy" ? cardKey : field.label.split(":")[0];
      card.append(legend); cards.set(cardKey, card); contentForm.append(card);
    }
    cards.get(cardKey).append(wrapper);
  });

  updateDirtyState();
  setStatus(saveStatus, "");
}

function selectPage(page) {
  if (saving) return;
  if (page === activePage) return;

  const pending = changedFields();
  if (dirty()) {
    const shouldDiscard = window.confirm(
      "Leave this section and discard its unsaved changes?"
    );
    if (!shouldDiscard) return;
    clearPhoto();

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
  const count = changedFields().length + (pendingPhoto ? 1 : 0);
  saveButton.textContent = count ? `Save ${count} change${count === 1 ? "" : "s"}` : "Save changes";
  saveButton.disabled = count === 0 || saving;
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
    .select("content_key, content_value, version");

  if (error) throw error;

  values = new Map(data.map((row) => [row.content_key, row.content_value]));
  initialValues = new Map(values);
  versions = new Map(data.map(row => [row.content_key, row.version]));
  const result = await supabase.from("site_media").select("*");
  if (result.error) throw result.error;
  media = new Map(result.data.map(row => [row.media_key, row]));
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
    if (String(formData.get("username")).trim().toUpperCase() !== "TPLG") throw new Error("Invalid credentials");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: ADMIN_ACCOUNT_EMAIL,
      password: formData.get("password")
    });

    if (error) throw error;
    await loadEditor(data.session);
  } catch (error) {
    setStatus(loginStatus, "Unable to sign in. Check your username and password and try again.", true);
  } finally {
    setBusy(submitButton, false);
  }
});

saveButton.addEventListener("click", async () => {
  if (saving || !contentForm.reportValidity() || !dirty()) return;
  saving = true;
  const fields = changedFields();
  contentForm.querySelectorAll("input,textarea").forEach(el => { el.disabled = true; });
  setBusy(saveButton, true);
  setStatus(saveStatus, "Saving changes…");
  try {
    const person = activePerson();
    let photo = null;
    if (pendingPhoto && person) {
      const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[pendingPhoto.file.type];
      const path = `people/${person.key}/${crypto.randomUUID()}.${ext}`;
      const upload = await supabase.storage.from("site-media").upload(path, pendingPhoto.file, { upsert: false, contentType: pendingPhoto.file.type });
      if (upload.error) throw upload.error;
      photo = { key: person.key, path, width: pendingPhoto.width, height: pendingPhoto.height, version: media.get(person.key).version };
    }
    const group = CONTENT_FIELDS.find(g => g.page === activePage);
    const expected = Object.fromEntries(group.fields.map(f => [f.key, versions.get(f.key)]));
    const changes = Object.fromEntries(fields.map(f => [f.key, values.get(f.key)]));
    const { error } = await supabase.rpc("save_admin_page", { page_name: activePage, expected_versions: expected, changes, photo });
    if (error) throw error;
    clearPhoto();
    const { data } = await supabase.auth.getSession();
    await loadEditor(data.session);
    setStatus(saveStatus, "Changes saved and are now live on the public site.");
  } catch (error) {
    setStatus(saveStatus, error.message || "Nothing was saved. Please try again.", true);
  } finally {
    saving = false;
    contentForm.querySelectorAll("input,textarea").forEach(el => { el.disabled = false; });
    setBusy(saveButton, false); updateDirtyState();
  }
});

signOutButton.addEventListener("click", async () => {
  if (saving) return;
  if (dirty() && !window.confirm("Sign out and discard unsaved changes?")) return;

  await supabase.auth.signOut();
  clearPhoto(); values = new Map(initialValues);
  loginForm.reset();
  setStatus(loginStatus, "Signed out.");
  showOnly(loginPanel);
});

window.addEventListener("beforeunload", (event) => {
  if (!dirty() && !saving) return;
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

supabase?.auth.onAuthStateChange((event) => {
  if (event === "SIGNED_OUT") {
    clearPhoto(); values = new Map(initialValues);
    showOnly(loginPanel);
  }
});
initialize();
