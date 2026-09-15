# TPLG content editor setup

The public site remains a static Vite build. Its approved copy is present in the HTML, then `content.js` overlays any matching values from Supabase. If Supabase is unavailable or unconfigured, visitors continue to see the built-in copy.

The site is connected to its dedicated `TPLG Website Content` Supabase project. The production deployment is configured with the browser-safe project URL and publishable key; no administrator password or elevated key is stored in source code or Vercel.

## 1. Project configuration

1. The dedicated project lives in the existing `swim-lang's Org` Supabase organization.
2. `migrations/202609150001_create_content_editor.sql` has been applied.
3. Project-wide signup is disabled. Email/password authentication stays enabled only so the existing shared administrator can sign in; the `/admin/` interface exposes no signup, invite, reset, or account-management flow.
4. The production site and supported local preview URLs are allowlisted in `config.toml`.
5. Database and security advisors were run after provisioning.

The migration enables row-level security, makes published copy publicly readable, and permits updates only for authenticated users whose user ID is also present in `public.cms_editors`. Browser users cannot insert or delete content rows or alter field metadata.

## 2. Create the shared administrator

Create one confirmed Supabase Authentication user with the internal address
`admin@thepoliticallaw.group` and the separately supplied shared password. Do not put the password
in source code or a Vercel environment variable. Add that user's ID to the allowlist:

```sql
insert into public.cms_editors (user_id)
values ('AUTH_USER_UUID');
```

The public editor asks only for the password; its fixed internal account address is supplied by the
browser code. There is no signup or invitation workflow. Removing the allowlist row revokes editing
access immediately. Authentication alone is not sufficient to write content.

## 3. Connect local and Vercel environments

Copy `.env.example` to `.env.local` and set:

```text
VITE_SUPABASE_URL=https://PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Add the same two values to the Vercel project environments before deployment. These are browser-safe project values when row-level security is configured correctly. Never add a secret or `service_role` key to a `VITE_` variable.

## 4. Verify before release

- Anonymous visitors can read content but cannot update it.
- An authenticated user not present in `cms_editors` cannot update content.
- An allowlisted editor can update only `content_value` on existing rows.
- No browser client can insert, delete, rename, or reorganize content rows.
- HTML or script entered into a field renders as literal text.
- Blocking the Supabase request leaves the built-in HTML copy visible.
- Login, save, refresh, and logout work on desktop and mobile.
- The existing `/signature/` utility is unchanged and remains functional.

This first version edits visible copy only. Routes, staff additions, images, navigation, SEO metadata, structured data, and Open Graph assets remain code-managed.

References: [Supabase secure frontend data](https://supabase.com/docs/guides/database/secure-data), [row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security), and [password authentication](https://supabase.com/docs/guides/auth/passwords).
