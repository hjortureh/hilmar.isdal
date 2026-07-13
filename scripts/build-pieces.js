#!/usr/bin/env node
// Generates pieces/<id>.html from js/works.js so each piece has its own
// social meta tags (crawlers don't run JS). Re-run after editing works.js:
//   node scripts/build-pieces.js

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SITE = "https://hilmar.isdal.is";
const root = path.join(__dirname, "..");
const outDir = path.join(root, "pieces");

const ctx = vm.createContext({});
vm.runInContext(
  fs.readFileSync(path.join(root, "js", "works.js"), "utf8") + "\nthis.WORKS = WORKS;",
  ctx
);
const WORKS = ctx.WORKS;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const page = (w) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(w.title)} — Hilmar Isdal</title>
  <meta name="description" content="${esc(`${w.medium}, ${w.size}`)}">
  <meta property="og:title" content="${esc(w.title)} — Hilmar Isdal">
  <meta property="og:description" content="${esc(`${w.medium}, ${w.size}`)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${SITE}/pieces/${w.id}.html">
  <meta property="og:image" content="${SITE}/${w.image}">
  <meta property="og:image:width" content="${w.w}">
  <meta property="og:image:height" content="${w.h}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${SITE}/${w.image}">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <header>
    <a class="brand" href="/"><img src="/assets/logo.png" alt="Hilmar Isdal" width="1137" height="516"></a>
  </header>

  <main>
    <div class="piece" id="piece"></div>
  </main>

  <footer>&copy; 2026 Hilmar Isdal</footer>

  <script>var PIECE_ID = ${JSON.stringify(w.id)};</script>
  <script src="/js/works.js"></script>
  <script src="/js/piece.js"></script>
</body>
</html>
`;

fs.mkdirSync(outDir, { recursive: true });
for (const w of WORKS) {
  fs.writeFileSync(path.join(outDir, `${w.id}.html`), page(w));
  console.log(`pieces/${w.id}.html`);
}
