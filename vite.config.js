import { resolve } from "node:path";
import { defineConfig } from "vite";

const page = (path) => resolve(import.meta.dirname, path);

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        home: page("index.html"),
        people: page("people/index.html"),
        nicholas: page("people/nicholas-sanders/index.html"),
        tracey: page("people/tracey-wigglesworth/index.html"),
        emma: page("people/emma-olson-sharkey/index.html"),
        kristen: page("people/kristen-lippstreu/index.html"),
        practice: page("practice/index.html"),
        offices: page("offices/index.html"),
        insights: page("insights/index.html"),
        signature: page("signature/index.html"),
        admin: page("admin/index.html")
      }
    }
  }
});
