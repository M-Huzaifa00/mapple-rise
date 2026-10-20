// Build check: fails if the built page links to the live MapleRise or RBS sites.
// Scans dist/index.html (prerendered markup) and every JS chunk in dist/assets.
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const FORBIDDEN = [
  // markup: href="https://mapleriseestates.com/…"
  /href\s*=\s*["']https?:\/\/(www\.)?(mapleriseestates|rbsland)\.com[^"']*["']/gi,
  // compiled JSX: href:"https://mapleriseestates.com/…"
  /href\s*:\s*["'`]https?:\/\/(www\.)?(mapleriseestates|rbsland)\.com[^"'`]*["'`]/gi,
];

const dist = resolve('dist');
const files = [join(dist, 'index.html'), ...readdirSync(join(dist, 'assets')).filter((f) => f.endsWith('.js')).map((f) => join(dist, 'assets', f))];

const problems = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const re of FORBIDDEN) for (const m of text.matchAll(re)) problems.push(`${file}: ${m[0].slice(0, 120)}`);
  if (/rbsland\.com/i.test(text)) problems.push(`${file}: mentions rbsland.com`);
}

if (problems.length) {
  console.error(`check-links: ${problems.length} forbidden link(s):\n${problems.join('\n')}`);
  process.exit(1);
}
console.log(`check-links: OK (${files.length} files, no href to mapleriseestates.com or rbsland.com)`);
