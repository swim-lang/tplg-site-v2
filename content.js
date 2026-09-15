const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function applyValue(key, value) {
  document.querySelectorAll(`[data-content-key="${CSS.escape(key)}"]`).forEach((element) => {
    const prefix = element.dataset.contentPrefix || "";
    const suffix = element.dataset.contentSuffix || "";
    element.textContent = `${prefix}${value}${suffix}`;

    if (element.dataset.contentHref === "email") {
      element.setAttribute("href", `mailto:${value}`);
    }

  });
}

async function hydrateContent() {
  if (!supabaseUrl || !publishableKey) return;

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/site_content?select=content_key,content_value`,
      {
        headers: {
          apikey: publishableKey,
          Accept: "application/json"
        }
      }
    );

    if (!response.ok) throw new Error(`Content request failed with ${response.status}`);

    const rows = await response.json();
    rows.forEach(({ content_key: key, content_value: value }) => applyValue(key, value));
    document.documentElement.dataset.contentSource = "supabase";
  } catch (error) {
    console.warn("TPLG content service unavailable; using published fallback copy.", error);
  }
}

hydrateContent();
