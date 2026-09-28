import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { CONTENT_FIELDS } from "../cms/content-fields.js";

const destination = process.argv[2];
if (!destination) {
  throw new Error("Pass the migration file path to update.");
}

const sqlString = (value) => `'${String(value).replaceAll("'", "''")}'`;
const fields = CONTENT_FIELDS.flatMap((group) =>
  group.fields.map((field) => ({ ...field, page: group.page }))
);
const uniqueFields = [...new Map(fields.map((field) => [field.key, field])).values()];
const rows = uniqueFields.map((field, index) =>
  `  (${sqlString(field.key)}, ${sqlString(field.page)}, ${sqlString(field.label)}, ${sqlString(field.fallback)}, ${index})`
);

const migration = `-- Expand the editor-backed public copy for the full TPLG site.
-- URLs, images and publication links remain code-managed.
insert into public.site_content (content_key, page, label, content_value, sort_order)
values
${rows.join(",\n")}
on conflict (content_key) do update
set
  page = excluded.page,
  label = excluded.label,
  content_value = excluded.content_value,
  sort_order = excluded.sort_order;
`;

await writeFile(resolve(destination), migration, "utf8");
console.log(`Wrote ${uniqueFields.length} content rows to ${destination}.`);
