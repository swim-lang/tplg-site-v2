import { resolve } from "node:path";
import { defineConfig } from "vite";
import { PEOPLE, PRACTICES } from "./cms/site-data.js";

const page = (path) => resolve(import.meta.dirname, path);
const profilePages = Object.fromEntries(
  PEOPLE.map((person) => [`person-${person.slug}`, page(`people/${person.slug}/index.html`)])
);
const practicePages = Object.fromEntries(
  PRACTICES.map((practice) => [`practice-${practice.slug}`, page(`practice/${practice.slug}/index.html`)])
);

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        home: page("index.html"),
        people: page("people/index.html"),
        ...profilePages,
        firm: page("firm/index.html"),
        practice: page("practice/index.html"),
        ...practicePages,
        contact: page("contact/index.html"),
        offices: page("offices/index.html"),
        insights: page("insights/index.html"),
        signature: page("signature/index.html"),
        admin: page("admin/index.html")
      }
    }
  }
});
