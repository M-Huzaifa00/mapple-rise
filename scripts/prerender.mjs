// Build step after both Vite builds:
// 1. Renders the home page into dist/index.html (content and counters are in the HTML before JS runs).
// 2. Preloads the LCP hero image (elements marked data-lcp) and the hero heading font.
// 3. Inlines the stylesheet to remove a render-blocking request.
import { readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ssrDir = resolve('dist-ssr');
const entry = readdirSync(ssrDir).find((f) => /^entry-server\.(m?js)$/.test(f));
if (!entry) throw new Error('prerender: entry-server bundle not found in dist-ssr/');

const { render } = await import(pathToFileURL(join(ssrDir, entry)).href);
const indexPath = resolve('dist/index.html');
let html = readFileSync(indexPath, 'utf8');
if (!html.includes('<!--app-html-->')) throw new Error('prerender: <!--app-html--> marker missing');

const appHtml = await render();
html = html.replace('<!--app-html-->', () => appHtml);

// --- Preloads -------------------------------------------------------------
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'))?.[1];
const preloads = [];
const lcp = [...appHtml.matchAll(/<(source|img)\b[^>]*data-lcp[^>]*>/gi)].map((m) => m[0]);
const mobile = lcp.find((tag) => /^<source/i.test(tag));
const desktop = lcp.find((tag) => /^<img/i.test(tag));
if (mobile) {
  preloads.push(
    `<link rel="preload" as="image" fetchpriority="high" media="${attr(mobile, 'media')}" imagesrcset="${attr(mobile, 'srcSet') ?? attr(mobile, 'srcset')}" imagesizes="${attr(mobile, 'sizes')}">`,
  );
}
if (desktop) {
  const media = mobile ? ' media="(min-width: 768px)"' : '';
  preloads.push(
    `<link rel="preload" as="image" fetchpriority="high"${media} href="${attr(desktop, 'src')}" imagesrcset="${attr(desktop, 'srcSet') ?? attr(desktop, 'srcset')}" imagesizes="${attr(desktop, 'sizes')}">`,
  );
}
const headingFont = readdirSync(resolve('dist/assets')).find((f) => /^dm-serif-display-latin-400-normal.*\.woff2$/.test(f));
if (headingFont) preloads.push(`<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/${headingFont}">`);
html = html.replace('</title>', () => `</title>\n    ${preloads.join('\n    ')}`);

// --- Inline CSS -------------------------------------------------------------
const cssLink = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/);
if (cssLink) {
  const css = readFileSync(resolve('dist', `.${cssLink[1]}`), 'utf8');
  html = html.replace(cssLink[0], () => `<style>${css}</style>`);
}

writeFileSync(indexPath, html);
rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerender: dist/index.html written (${preloads.length} preloads${cssLink ? ', CSS inlined' : ''})`);
