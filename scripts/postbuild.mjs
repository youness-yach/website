// postbuild.mjs · runs after `observable build`.
// 1. Copies static/ (Cloudflare _redirects, the link-preview image) into dist/.
// 2. Removes "maximum-scale=1" from every page's viewport tag so phone users
//    can pinch-zoom (Observable Framework 1.13 hard-codes it).
import {cpSync, readdirSync, readFileSync, statSync, writeFileSync} from "node:fs";
import {join} from "node:path";

cpSync("static", "dist", {recursive: true});

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (p.endsWith(".html")) yield p;
  }
}
let n = 0;
for (const file of htmlFiles("dist")) {
  const html = readFileSync(file, "utf8");
  const fixed = html.replace(/,\s*maximum-scale=1/, "");
  if (fixed !== html) { writeFileSync(file, fixed); n++; }
}
console.log(`postbuild: copied static/, fixed viewport in ${n} pages`);
