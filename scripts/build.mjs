// Bundles index.html + css + js into single self-contained files.
//   dist/j2-field-manual.html  -> standalone page (open directly in a browser, works offline except fonts)
//   dist/artifact.html         -> same page without <html>/<head>/<body> wrappers, for hosts that add their own skeleton
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const html = read('index.html');

const inline = (src) =>
  src
    .replace(/<link rel="stylesheet" href="(css\/[^"]+)">/g, (_, p) => `<style>\n${read(p)}</style>`)
    .replace(/<script src="(js\/[^"]+)"><\/script>/g, (_, p) => `<script>\n${read(p).replace(/<\/script/gi, '<\\/script')}</script>`);

const between = (a, b) => {
  const i = html.indexOf(a), j = html.indexOf(b);
  if (i < 0 || j < 0) throw new Error(`markers missing: ${a} / ${b}`);
  return html.slice(i + a.length, j).trim();
};

const headPart = inline(between('<!-- build:strip-above -->', '<!-- build:head-end -->'));
const bodyPart = inline(between('<!-- build:body-start -->', '<!-- build:body-end -->'));

mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/artifact.html'), `${headPart}\n${bodyPart}\n`);
writeFileSync(join(root, 'dist/j2-field-manual.html'), inline(html));
console.log('built dist/artifact.html and dist/j2-field-manual.html');
