(() => {
  "use strict";

  const BRAND = {
    navy: "#0D1B2A",
    copper: "#B65A2A",
    copperText: "#8E421C",
    muted: "#5E6670",
    logoPreview: "../assets/tplg-main-lockup.png",
    logoProduction: "https://tplg-site.vercel.app/assets/tplg-main-lockup.png",
    firm: "The Political Law Group LLP",
    disclaimer:
      "THIS EMAIL IS CONFIDENTIAL AND MAY BE LEGALLY PRIVILEGED. IF YOU HAVE RECEIVED IT IN ERROR, PLEASE NOTIFY US IMMEDIATELY AND THEN DELETE IT. ANY TAX ADVICE IS NOT INTENDED TO AND CANNOT BE USED FOR AVOIDING IRS PENALTIES OR FOR RECOMMENDING ANY TAX-RELATED TRANSACTION OR MATTER TO A THIRD PARTY."
  };

  const form = document.querySelector("#signature-form");
  const preview = document.querySelector("#signature-preview");
  const copyButton = document.querySelector("#copy-button");
  const downloadButton = document.querySelector("#download-button");
  const copyStatus = document.querySelector("#copy-status");
  const includeAddress = document.querySelector("#include-address");
  const addressField = document.querySelector("[data-address-field]");

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function clean(value) {
    return String(value || "").trim();
  }

  function normalizeWebsite(value) {
    const display = clean(value).replace(/^https?:\/\//i, "").replace(/\/$/, "");
    return {
      display,
      href: display ? `https://${display}` : ""
    };
  }

  function phoneHref(value) {
    const trimmed = clean(value);
    const prefix = trimmed.startsWith("+") ? "+" : "";
    return `${prefix}${trimmed.replace(/\D/g, "")}`;
  }

  function readState() {
    const fields = new FormData(form);
    return {
      fullName: clean(fields.get("fullName")),
      title: clean(fields.get("title")),
      email: clean(fields.get("email")),
      phone: clean(fields.get("phone")),
      website: normalizeWebsite(fields.get("website")),
      address: clean(fields.get("address")),
      includeAddress: fields.get("includeAddress") === "on",
      includeDisclaimer: fields.get("includeDisclaimer") === "on",
      layout: clean(fields.get("layout")) || "balanced"
    };
  }

  function contactRows(state, separator = "&nbsp;&nbsp;|&nbsp;&nbsp;") {
    const items = [];
    if (state.phone) {
      items.push(
        `<a href="tel:${escapeHtml(phoneHref(state.phone))}" style="color:${BRAND.navy};text-decoration:none;white-space:nowrap;">${escapeHtml(state.phone)}</a>`
      );
    }
    if (state.email) {
      items.push(
        `<a href="mailto:${escapeHtml(state.email)}" style="color:${BRAND.navy};text-decoration:none;white-space:nowrap;">${escapeHtml(state.email)}</a>`
      );
    }
    if (state.website.display) {
      items.push(
        `<a href="${escapeHtml(state.website.href)}" style="color:${BRAND.navy};text-decoration:none;white-space:nowrap;">${escapeHtml(state.website.display)}</a>`
      );
    }
    return items.join(`<span style="color:${BRAND.copperText};">${separator}</span>`);
  }

  function addressRow(state) {
    if (!state.includeAddress || !state.address) return "";
    return `<tr><td style="padding:6px 0 0;color:${BRAND.muted};font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;">${escapeHtml(state.address)}</td></tr>`;
  }

  function disclaimer(state) {
    if (!state.includeDisclaimer) return "";
    return `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="width:560px;max-width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:14px 0 0;color:#5E6670;font-family:Arial,Helvetica,sans-serif;font-size:8px;line-height:12px;letter-spacing:0.01em;">
            ${BRAND.disclaimer}
          </td>
        </tr>
      </table>`;
  }

  function renderBalanced(state, logoUrl) {
    return `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="width:560px;max-width:100%;border-collapse:collapse;background:#FFFFFF;">
        <tr>
          <td width="190" valign="top" style="width:190px;padding:2px 22px 2px 0;border-right:2px solid ${BRAND.copper};vertical-align:top;">
            <img src="${escapeHtml(logoUrl)}" width="168" height="53" alt="TPLG" style="display:block;width:168px;height:53px;border:0;outline:none;text-decoration:none;" />
          </td>
          <td valign="top" style="padding:0 0 0 22px;vertical-align:top;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
              <tr><td style="padding:0;color:${BRAND.navy};font-family:Georgia,'Times New Roman',serif;font-size:19px;line-height:24px;font-weight:700;">${escapeHtml(state.fullName || "Full Name")}</td></tr>
              <tr><td style="padding:3px 0 0;color:${BRAND.copperText};font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:14px;font-weight:700;letter-spacing:0.11em;text-transform:uppercase;">${escapeHtml(state.title || "Title")}</td></tr>
              <tr><td style="padding:4px 0 0;color:${BRAND.muted};font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;">${BRAND.firm}</td></tr>
              <tr><td style="padding:10px 0 0;color:${BRAND.navy};font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:18px;">${contactRows(state)}</td></tr>
              ${addressRow(state)}
            </table>
          </td>
        </tr>
      </table>
      ${disclaimer(state)}`;
  }

  function renderStacked(state, logoUrl) {
    return `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="width:560px;max-width:100%;border-collapse:collapse;background:#FFFFFF;">
        <tr>
          <td style="padding:0 0 13px;border-bottom:2px solid ${BRAND.copper};">
            <img src="${escapeHtml(logoUrl)}" width="210" height="66" alt="TPLG" style="display:block;width:210px;height:66px;border:0;outline:none;text-decoration:none;" />
          </td>
        </tr>
        <tr>
          <td style="padding:14px 0 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
              <tr><td style="padding:0;color:${BRAND.navy};font-family:Georgia,'Times New Roman',serif;font-size:20px;line-height:25px;font-weight:700;">${escapeHtml(state.fullName || "Full Name")}</td></tr>
              <tr><td style="padding:3px 0 0;color:${BRAND.copperText};font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:14px;font-weight:700;letter-spacing:0.11em;text-transform:uppercase;">${escapeHtml(state.title || "Title")}&nbsp;&nbsp;<span style="color:#69727B;">/</span>&nbsp;&nbsp;${BRAND.firm}</td></tr>
              <tr><td style="padding:9px 0 0;color:${BRAND.navy};font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:18px;">${contactRows(state, "&nbsp;/&nbsp;")}</td></tr>
              ${addressRow(state)}
            </table>
          </td>
        </tr>
      </table>
      ${disclaimer(state)}`;
  }

  function renderCompact(state, logoUrl) {
    return `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="width:560px;max-width:100%;border-collapse:collapse;background:#FFFFFF;">
        <tr>
          <td valign="top" style="padding:0;vertical-align:top;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
              <tr><td style="padding:0;color:${BRAND.navy};font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:23px;font-weight:700;">${escapeHtml(state.fullName || "Full Name")}</td></tr>
              <tr><td style="padding:2px 0 0;color:${BRAND.copperText};font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:14px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">${escapeHtml(state.title || "Title")}</td></tr>
              <tr><td style="padding:8px 0 0;color:${BRAND.navy};font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:18px;">${contactRows(state, "&nbsp;/&nbsp;")}</td></tr>
              ${addressRow(state)}
            </table>
          </td>
          <td width="144" valign="top" align="right" style="width:144px;padding:1px 0 0 18px;vertical-align:top;text-align:right;">
            <img src="${escapeHtml(logoUrl)}" width="126" height="39" alt="TPLG" style="display:block;width:126px;height:39px;margin-left:auto;border:0;outline:none;text-decoration:none;" />
            <div style="margin-top:8px;color:${BRAND.muted};font-family:Arial,Helvetica,sans-serif;font-size:9px;line-height:13px;white-space:nowrap;">${BRAND.firm}</div>
          </td>
        </tr>
      </table>
      ${disclaimer(state)}`;
  }

  function renderSignature(state, logoUrl) {
    if (state.layout === "stacked") return renderStacked(state, logoUrl);
    if (state.layout === "compact") return renderCompact(state, logoUrl);
    return renderBalanced(state, logoUrl);
  }

  function renderPreview() {
    const state = readState();
    addressField.hidden = !state.includeAddress;
    preview.innerHTML = renderSignature(state, BRAND.logoPreview);
    copyStatus.textContent = "";
  }

  function plainText(state) {
    const lines = [state.fullName || "Full Name", state.title || "Title", BRAND.firm];
    if (state.phone) lines.push(state.phone);
    if (state.email) lines.push(state.email);
    if (state.website.display) lines.push(state.website.display);
    if (state.includeAddress && state.address) lines.push(state.address);
    if (state.includeDisclaimer) lines.push("", BRAND.disclaimer);
    return lines.join("\n");
  }

  function fallbackCopy(html) {
    const node = document.createElement("div");
    node.setAttribute("contenteditable", "true");
    node.setAttribute("aria-hidden", "true");
    node.style.position = "fixed";
    node.style.left = "-10000px";
    node.style.top = "0";
    node.innerHTML = html;
    document.body.appendChild(node);

    const range = document.createRange();
    range.selectNodeContents(node);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    const copied = document.execCommand("copy");
    selection.removeAllRanges();
    node.remove();
    if (!copied) throw new Error("Copy command was blocked.");
  }

  async function copySignature() {
    const state = readState();
    const html = renderSignature(state, BRAND.logoProduction);
    const text = plainText(state);

    try {
      if (window.ClipboardItem && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([text], { type: "text/plain" })
          })
        ]);
      } else {
        fallbackCopy(html);
      }
      copyStatus.textContent = "Copied. Paste it into Outlook’s signature editor.";
      copyButton.querySelector("span").textContent = "Copied";
      window.setTimeout(() => {
        copyButton.querySelector("span").textContent = "Copy for Outlook";
      }, 1800);
    } catch (error) {
      copyStatus.textContent = "Copy was blocked. Select the preview and use Command/Ctrl + C.";
      preview.focus();
    }
  }

  function downloadSignature() {
    const state = readState();
    const html = renderSignature(state, BRAND.logoProduction);
    const documentHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>TPLG email signature</title></head><body style="margin:24px;background:#FFFFFF;">${html}</body></html>`;
    const blob = new Blob([documentHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileName = (state.fullName || "tplg")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    link.href = url;
    link.download = `${fileName || "tplg"}-email-signature.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    copyStatus.textContent = "HTML backup downloaded. Open it in a browser and copy the rendered signature.";
  }

  form.addEventListener("input", renderPreview);
  form.addEventListener("change", renderPreview);
  copyButton.addEventListener("click", copySignature);
  downloadButton.addEventListener("click", downloadSignature);

  renderPreview();
})();
