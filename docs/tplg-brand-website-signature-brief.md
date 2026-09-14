# TPLG brand, website, and email-signature brief

Status: Working draft for Sean’s review

Last updated: September 14, 2026

Publication status: Local branch only; nothing in this brief or the signature prototype has been published.

## Verified sources

- [Missive: Branding, Website, Etc.](https://mail.missiveapp.com/#inbox/conversations/29e99532-a061-4ee0-9784-0076bc52d86d), September 3–14, 2026. Tracey Wigglesworth, Sean Ashlow, Nicholas Sanders, and Emma Olson Sharkey.
- [Missive: Email sig is this?](https://mail.missiveapp.com/#inbox/conversations/0392f51e-062f-4b93-8904-8566381d22d6), September 10, 2026. Tracey Wigglesworth and Sean Ashlow; the forwarded source originated with Emma Olson Sharkey.
- Supplied brand asset: `MainLockup.svg` (received September 14, 2026).
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
| Working warm white | `#F7F4EE` | UI support color, not encoded in the SVG |

The lockup has a `3000 × 940` viewBox (`150:47`). For email, use a transparent PNG exported at `600 × 188` and displayed at `300 × 94` or smaller. The SVG itself is suitable for the website, but a hosted PNG is safer across Outlook versions.

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

The full website redesign remains intentionally unimplemented until Sean supplies the planned mockup and confirms the current content direction.

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

1. Confirm that the supplied `MainLockup.svg` includes Tracey’s final straight-top `T` correction.
2. Choose the preferred default signature layout after reviewing the prototype.
3. Confirm whether physical address should be prohibited or merely optional in signatures.
4. Approve the disclaimer verbatim.
5. Confirm the final public logo host when the generator is published. The prototype is prepared to use the existing Vercel project’s HTTPS asset URL.
6. Supply the website mockup and identify which content from the current temporary page should survive into the new site.
