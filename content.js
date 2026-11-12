const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function applyValue(key, value) {
  if (key.endsWith('.url')) {
    if (/^https:\/\//i.test(value)) document.querySelectorAll(`[data-link-key="${CSS.escape(key)}"]`).forEach(el => { el.href = value; });
    return;
  }
  document.querySelectorAll(`[data-content-key="${CSS.escape(key)}"]`).forEach((element) => {
    const prefix = element.dataset.contentPrefix || "";
    const suffix = element.dataset.contentSuffix || "";
    const nextText = `${prefix}${value}${suffix}`;

    if (element.textContent !== nextText) {
      element.textContent = nextText;
    }

    if (element.dataset.contentHref === "email") {
      element.setAttribute("href", `mailto:${value}`);
    }

    if (element.dataset.contentHref === "phone") {
      element.setAttribute("href", `tel:${value.replace(/[^+\d]/g, "")}`);
    }

  });
}

async function hydrateContent() {
  if (!supabaseUrl || !publishableKey) return;

  const isLocalPreview = ["127.0.0.1", "localhost"].includes(window.location.hostname);
  const useRemoteContent = new URLSearchParams(window.location.search).has("remote-content");
  if (isLocalPreview && !useRemoteContent) {
    document.documentElement.dataset.contentSource = "published-fallback";
    return;
  }

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

async function hydrateMedia() {
  if (!supabaseUrl || !publishableKey) return;
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/site_media?select=media_key,object_path`, { headers: { apikey: publishableKey } });
    if (!response.ok) return;
    for (const row of await response.json()) {
      if (!row.object_path) continue;
      for (const img of document.querySelectorAll(`[data-media-key="${CSS.escape(row.media_key)}"]`)) {
        const probe = new Image();
        const url = `${supabaseUrl}/storage/v1/object/public/site-media/${row.object_path.split('/').map(encodeURIComponent).join('/')}`;
        probe.onload = () => { const fallback = img.src; img.onerror = () => { img.onerror = null; img.src = fallback; }; img.src = url; };
        probe.src = url;
      }
    }
  } catch { /* Keep bundled portraits when content services are unavailable. */ }
}
hydrateMedia();
