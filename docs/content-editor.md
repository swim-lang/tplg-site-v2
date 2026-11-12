# TPLG content editor

Entry: https://thepoliticallaw.group/admin/

Credentials: 1Password Shared vault, **TPLG Website Admin**. Username is TPLG
(case-insensitive). The password is managed by Supabase Auth, not this repository.
There is no signup/invite flow. Session storage is tab-scoped; browsers may restore
tab session storage when restoring a closed session, so use Sign out on shared devices.

## Workflow

Choose a section, replace existing text or its portrait, then Save. Saves publish
immediately without redeploying. Links must use HTTPS. Portraits must be JPEG, PNG
or WebP, no larger than 5 MB and at least 600 by 600 pixels. The preview uses the
same square crop and focal position as the public pages.

Only current people have portrait controls. Structure, navigation, brand assets,
new people and new articles remain developer-managed.

## Database and recovery

The code-defined field list is mirrored in admin_fields. The save_admin_page RPC
locks the page's rows, verifies their expected versions, validates field keys and
types, and commits text/media changes in one transaction. An old open session
must reload if another session saved the same page.

site_media holds the current immutable object path; both the directory and profile
use the same media key. Uploaded objects are not overwritten or deleted by clients.
Uploads that succeed before a failed save remain unreferenced and can be cleaned up
by a developer after checking current pointers and private.content_history.

private.content_history records before/after snapshots. Restore selected values
through a reviewed database update; the trigger records the restoration too.
Do not delete historical Storage objects needed by a recovery snapshot.

Public requests only read published data. Allowlisted editors can modify existing
values; there is no client insert/delete capability for content or media records.
The private audit trigger has elevated rights solely to append history. Its
function is not exposed or executable by browser roles.

Both public copy and portraits retain bundled fallbacks on service failures.
Periodic reviewed exports into the static site keep those fallbacks current;
runtime edits do not rewrite Git files automatically.

## Verification performed for the expansion

- Production-content snapshot exported before migration, outside this repository.
- Build and whitespace checks; login, logout, normalized username, generic errors.
- Tab session storage; mobile overflow check at 390 px.
- Actual portrait upload using the unchanged Nicholas source image, persistence
  after refresh, and matching directory/profile URLs.
- Successful same-value content save, stale-save rejection, anonymous RPC denial,
  invalid image MIME denial, and transactional rollback after an invalid field.
- Non-allowlisted RPC denial and public content/image fallbacks with API blocked.

The shared account identifies the administrator, not individual staff members.
There is no individual attribution or MFA in this deliberately small version.
