# TPLG brand, website, and email-signature brief

Status: Active implementation brief

Last updated: September 15, 2026

Publication status: The September 14 site remains public. Tracey's September 15 revision and the content editor are on a protected Vercel preview and have not been published to production.

## Verified sources

- [Missive: Branding, Website, Etc.](https://mail.missiveapp.com/#inbox/conversations/29e99532-a061-4ee0-9784-0076bc52d86d), September 3–14, 2026. Tracey Wigglesworth, Sean Ashlow, Nicholas Sanders, and Emma Olson Sharkey.
- [Missive: Email sig is this?](https://mail.missiveapp.com/#inbox/conversations/0392f51e-062f-4b93-8904-8566381d22d6), September 10–15, 2026. Tracey Wigglesworth and Sean Ashlow; the forwarded source originated with Emma Olson Sharkey. Tracey's September 15 message is the source of truth for this revision.
- Supplied brand assets: `MainLockup.svg`, the final TPLG asset package, and `Web.png`
  (received September 14, 2026).
- Existing site repository: `swim-lang/tplg-site-v2`; current public deployment remains unchanged while the new direction is developed.

## What is approved

### Brand direction

- The core shorthand lockup is `TPLG /`: serif letterforms in deep navy with a copper slash.
- The slash represents collaboration: `TPLG / [client, matter, or area of work]`.
- The new lockup direction was approved by Tracey on September 12 with “Love it all. No notes,” followed by one correction: remove the upward curve on the `T` so its top runs straight across.
- The supplied SVG contains outlined vector shapes rather than live type, so it is safe from font substitution. It should be treated as the working master, but the filename alone cannot prove whether it includes that last `T` correction; Sean should visually confirm that before final production use.

### Extracted palette

| Role | Value | Source |
| --- | --- | --- |
| Primary navy | `#0D1B2A` | SVG path fill |
| Accent copper | `#B65A2A` | SVG slash fill |
| Ivory | `#F5F3EF` | Final supplied brand specification |

The lockup has a `3000 × 940` viewBox (`150:47`). For email, use a transparent PNG exported at `600 × 188` and displayed at `300 × 94` or smaller. The SVG itself is suitable for the website, but a hosted PNG is safer across Outlook versions.

### Final typography

- **Adobe Caslon Pro Regular and Italic** are the primary website faces. Sean supplied
  Adobe Fonts kit `nmb4xax`; its CSS family is `adobe-caslon-pro` and it includes only
  400 normal and 400 italic, so the implementation does not synthesize heavier Caslon weights.
- **Inter Regular** is the secondary website and interface face. The Latin WOFF2 is
  self-hosted under the SIL Open Font License 1.1.
- The signature generator interface uses the same Adobe Caslon and Inter pairing. The
  copied signature output intentionally continues to use Georgia/Times and Arial/Helvetica
  fallbacks because Outlook cannot reliably preserve linked web fonts.

## Website direction captured from Tracey

- Lead with a static `TPLG /` and rotate through `campaigns`, `elections`, `advocacy`, `nonprofits`, `ethics`, and `enforcement`, ending on `you`.
- Retain the serif `TPLG` with a sans-serif companion treatment.
- The one-line `The Political Law Group` lockup should be tested at the upper left of the site.
- Updated navigation requested in the reference material:
  - People
  - Practice: Campaign Finance, Elections, Advocacy, Nonprofits, Ethics, Enforcement
  - Insights: Recent Developments, Client Alerts, Perspectives
  - Offices: Sacramento; Washington, D.C.
- `At the intersection of law and politics` was acceptable as a starting point, but not locked.
- Do not use `When it matters`.
- Keep `nonpartisan` and `bipartisan` out of public-facing copy.
- Replace or improve the phrase `other participants in the political process`.
- Staff headshots and a September 3 bio document are attached to the primary Missive conversation.

Sean supplied the website mockup on September 14. The implementation direction is now:

- exact navy, ivory and copper palette from the final brand specification;
- final ivory one-line lockup in the upper left;
- dedicated People, Practice and Offices pages rather than homepage anchor navigation,
  without desktop hover menus; the Insights page remains preserved in source but hidden from
  navigation and search until the firm is ready to publish updates;
- full-screen `TPLG /` cover animation using the approved seven-word sequence, with the
  `TPLG /` lockup held at a stable left-hand position while each companion word changes
  inside a reserved slot on the right;
- a slightly reduced central `TPLG /` lockup and a translucent navy sticky header;
- a site-wide `1200 × 630` social preview using the official ivory-and-copper `TPLG /`
  lockup centered on solid navy, with no portrait or additional copy;
- a temporary navy-and-copper slash favicon derived from the collaboration mark;
- restrained, text-led sections below the cover using the approved bios and practice labels;
- ivory, navy and copper only across the public site and signature utility;
- no filler image and no cookie banner unless tracking is actually introduced.

### September 15 revision

Tracey's latest message narrows and restructures the public site:

- Keep the slash favicon and the static `TPLG /` portion of the homepage animation.
- Remove the explanatory sentence beneath each rotating homepage word for a more dramatic, less informational opening.
- Replace the oversized People presentation with a compact landing grid of square team thumbnails and names.
- Give each person an individual, directly shareable profile page containing the larger portrait and full biography.
- Refine the People introduction rather than retaining the phrase `, directly involved.` verbatim. The current preview uses `Experienced political counsel, directly engaged.` as a restrained working edit.
- Move the existing `Why TPLG?` composition to the top of the Practice page, ahead of the existing practice-area list.
- Preserve the hidden Insights route in source while it remains out of public navigation.
- Prepare a small authenticated editor for visible page copy so approved TPLG users can make text changes without a code release.

The next staff additions described by Tracey are not yet part of the editor. New profiles still require a supplied photo and bio plus a code-managed route and card; the first editor release is intentionally limited to existing visible text.

### Homepage lockup design note

Tracey prefers that `TPLG /` remain fixed while the companion word changes. Sean's design concern remains valid: a fixed left edge removes motion from the mark, but changing word lengths make the full lockup optically unbalanced. The earlier dynamic-centering behavior was introduced deliberately to keep each complete `TPLG / word` composition centered. Removing the explanatory copy below does not change that geometry.

The September 15 preview follows Tracey's static-mark preference. In the eventual client response, frame this as a genuine tradeoff: the mark can stay fixed, or the full composition can remain optically centered, but both cannot be perfectly true while the companion words have different widths. Do not present the static result as an unnoticed alignment error.

## Content editor scope

The first editor is an unlisted `/admin/` route backed by a dedicated Supabase project:

- one shared administrator account with a password-only login screen; there is no public signup or invitation flow;
- an explicit database allowlist in addition to authentication;
- plain-text editing for current People, profile, Why TPLG, Practice, Offices, and footer copy;
- hardcoded published copy remains the first-render and outage fallback;
- successful saves update the live visible copy immediately;
- editors cannot create or delete fields, routes, profiles, images, or pages;
- SEO titles, descriptions, Open Graph content, navigation, and structural changes remain code-managed;
- the browser uses only the public project key, with row-level security enforcing write access.

The schema, single shared administrator, and editor preview are connected to the dedicated Supabase project. Public registration is disabled at the project level, and the account password is supplied separately and is never stored in the repository or Vercel. The revised site and editor still require preview approval before a production release.

## Email-signature requirements

Tracey explicitly elevated the signature block and letterhead to priority deliverables. The examples in Missive establish the following fields:

- Full name
- Title
- Firm name
- Phone
- Email
- Website
- Confidentiality, privilege, and tax-advice disclaimer

Tracey used her full name as the stress-test case because it is the longest likely name. She also proposed dropping the physical address while the Washington office is unsettled and replacing it with the website. That note appeared amid business-card direction, so the generator leaves address off by default but makes it optional until the firm confirms a universal rule.

The disclaimer in the source examples is:

> THIS EMAIL IS CONFIDENTIAL AND MAY BE LEGALLY PRIVILEGED. IF YOU HAVE RECEIVED IT IN ERROR, PLEASE NOTIFY US IMMEDIATELY AND THEN DELETE IT. ANY TAX ADVICE IS NOT INTENDED TO AND CANNOT BE USED FOR AVOIDING IRS PENALTIES OR FOR RECOMMENDING ANY TAX-RELATED TRANSACTION OR MATTER TO A THIRD PARTY.

It is included by default in the prototype, but TPLG should confirm the final legal wording before rollout.

## Generator recommendation

### Phase 1: public-web utility

Build a small, unlisted `/signature/` page that:

- accepts staff-specific name, title, phone, email, website, and optional address;
- previews three conservative, brand-aligned layouts;
- produces table-based HTML with inline styles and system fonts;
- uses the hosted PNG lockup with explicit dimensions and useful alt text;
- copies both rich HTML and plain text to the clipboard;
- keeps an ordinary selectable preview as a fallback when clipboard permissions are blocked;
- exports an HTML backup without presenting it as an Outlook installer;
- is marked `noindex, nofollow` and is not linked from the public navigation.

### Recommended Outlook flow

The clean MVP is **Copy for Outlook**, followed by pasting into Outlook’s native signature editor. It requires no Microsoft login, tenant permission, administrator involvement, or add-in installation.

- New Outlook and Outlook on the web: Settings → Accounts → Signatures → Add signature → paste → Save.
- Classic Outlook: New Email → Signature → Signatures → New → paste → Save.

Microsoft documents both the [signature settings flow](https://support.microsoft.com/en-us/outlook/mail/how-to-add-and-change-an-email-signature-in-outlook) and [copy/paste from a formatted template](https://support.microsoft.com/en-us/outlook/create-an-email-signature-from-a-template).

### Why not Graph or one-click installation

- Microsoft Graph does not expose saved Outlook signatures and cannot install or select them.
- An Outlook add-in can insert a signature into compose windows with `setSignatureAsync`, but it does not write Outlook’s saved signature library. It also introduces deployment, permission, client-version, and possibly tenant-administrator requirements.
- An Exchange mail-flow rule can enforce a server-side footer, but users do not see it while composing and its reply placement is limited.

An add-in is a reasonable phase 2 only if TPLG needs centralized enforcement or dynamic signatures. It is unnecessary for the current small-team rollout.

## Decisions still needed

1. Choose the preferred default signature layout after reviewing the prototype.
2. Confirm whether physical address should be prohibited or merely optional in signatures.
3. Approve the disclaimer verbatim.
4. Confirm that immediate-save publishing is acceptable for this small first version; a separate draft-and-publish workflow is not included.
