// Downloads the MapleRise images used on the page, crops/resizes them with sharp, writes WebP files
// to src/assets/images/ and a typed manifest (src/assets/images/manifest.ts) with blur placeholders.
// Run once (or after changing JOBS):  node scripts/fetch-images.mjs
// Downloads are cached in .image-cache/ so re-runs are offline.
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import sharp from 'sharp';

const U = 'https://mapleriseestates.com/wp-content/uploads';
const OUT = resolve('src/assets/images');
const CACHE = resolve('.image-cache');

// Output presets. `top` = keep only the top fraction of the source (drops baked-in captions).
const CARD = [
  { suffix: 'card', w: 800, h: 600 },
  { suffix: 'full', w: 1200, h: 900 },
];
const P = (key, path) => ({ key: `projects/${key}`, url: `${U}/${path}`, outputs: CARD, blur: true });

const JOBS = [
  // Projects (4:3). Key = source image, shared between projects where MapleRise reuses an image.
  P('park-view-city-1', '2026/02/Park-View-City-1.webp'),
  P('parkview-city', '2026/02/parkview-city.webp'),
  P('park-view-slider', '2026/02/park-view-slider.webp'),
  P('gulberg-green', '2026/02/Gulberg-Green.webp'),
  P('gulberg-green-01', '2026/02/Gulberg-Green-01.webp'),
  P('gulberg-green-boat-tower', '2026/02/Gulberg-Green-Boat-tower.webp'),
  P('margalla-faisal-mosque', '2026/02/Margalla-enclave-Faisal-Mosque.webp'),
  P('margalla-enclave-2', '2026/02/Margalla-Enclave2.webp'),
  P('pine-city-1', '2026/02/pine-city-1.webp'),
  P('pine-city-2', '2026/02/pine-city-2.webp'),
  P('dha-gandhara', '2026/02/Dha-gandhara.webp'),
  P('dha-islamabad', '2026/02/Dha-islamabad.webp'),
  P('capital-smart-city-0', '2026/06/capital-smart-city-0.webp'),
  P('overseas-east', '2026/02/Overseas-East.webp'),
  P('csc-render', '2026/02/freepik__enhance__88967.webp'),
  P('csc-phase-3', '2026/02/Excellennt-Convectivit.webp'),
  P('hamilton-hills-villas', '2026/02/Hamilton-Hills-Villas.webp'),
  P('hamilton-hills', '2026/02/hamilton-hills.webp'),
  P('one-capital-0', '2026/02/One-Capital-Residencies-0.jpg'),
  P('one-capital-render', '2026/02/freepik__enhance__88972.webp'),
  P('trivelles-1', '2026/02/Trivelles-smart-home-capital-smart-city.webp'),
  P('trivelles-2', '2026/02/trivellas-smart-villas-1.webp'),
  P('smart-villas', '2026/02/capital-smart-city-smart-villas.webp'),
  P('the-villas-bg', '2026/02/capital-smart-city-the-villas-bg.webp'),
  P('the-villas-0', '2026/02/capital-smart-city-the-villas-0.webp'),
  P('overseas-prime-block', '2026/02/overseas-prime-block.webp'),
  P('overseas-prime-render', '2026/02/freepik__enhance__88970.webp'),
  P('capital-hills', '2026/02/CAPITAL-HILLS.webp'),
  P('capital-hills-1', '2026/02/Capital-hills-1.webp'),
  P('overseas-west', '2026/02/capital_smart_city-overseas-west.webp'),
  P('lahore-smart-city-2', '2026/05/Lahore-Smart-City-2.webp'),
  P('lahore-smart-city', '2026/05/lahore-smart-city.jpg'),
  P('mall-of-gujar-khan-2', '2026/05/mall-of-gujar-khan-2.webp'),
  P('mall-of-gujar-khan-1', '2026/05/home-mall-of-gujar-khan-1.jpg'),
  P('30-gateway', '2026/05/30gateway.webp'),
  P('30-gateway-1', '2026/05/30-gateway-1.webp'),
  P('hawks-melbourne', '2026/05/Hawks-melbourne-city.webp'),
  P('hawks-melbourne-1', '2026/05/Hawks-mebourne-city-1.webp'),
  P('jabal-1', '2026/05/Jabal-resort-resendencia.webp'),
  P('jabal-2', '2026/05/Jabal-resorts-2.webp'),
  P('kohistan-enclave', '2026/05/Kohistan-enclave.webp'),

  // Capital Smart City districts (16:9). Source banners have a caption baked into the bottom quarter.
  // Education, Lakeview Terraces, Capital Hills and Executive Block are left out: once the caption
  // is cropped off they are mostly sky, haze or a plan drawing.
  ...[
    ['gate-precinct', 'gate-precinct-cpaital-smart-city-rotated-1-1024x476'],
    ['aviation', 'Avitation-1024x480'],
    ['crystal-lake', 'Crystal-Lake-District-1024x472'],
    ['financial-square', 'Finicial-Square-1024x480'],
    ['healthcare', 'Healthcare-district-1024x476'],
    ['overseas-east-district', 'overseas-district-1024x480'],
    ['sports', 'Sports-District-1024x476'],
  ].map(([key, file]) => ({
    key: `districts/${key}`,
    url: `${U}/2026/02/${file}.webp`,
    outputs: [{ suffix: 'card', w: 800, h: 450, top: 0.74 }],
    blur: true,
  })),

  // Leaders (4:5 portraits).
  ...[
    ['asad-khan', '2026/06/Asad-Khan-1-768x772.webp'],
    ['azfar-zulfiqar', '2026/06/Azfar-Zulfiqar-768x772.webp'],
    ['zubair-akbar', '2026/06/Zubair-Akbar-768x772.png'],
    ['muhammad-yusuf', '2026/06/1-1-768x768.png'],
  ].map(([key, path]) => ({
    key: `team/${key}`,
    url: `${U}/${path}`,
    outputs: [{ suffix: 'card', w: 480, h: 600, position: 'top' }],
    blur: true,
  })),

  // Site imagery.
  { key: 'site/about', url: `${U}/2026/02/Overseas-East.webp`, outputs: [{ suffix: 'card', w: 960, h: 720 }], blur: true },
  { key: 'site/visit', url: `${U}/2026/02/Margalla-enclave-Faisal-Mosque.webp`, outputs: [{ suffix: 'card', w: 960, h: 720 }], blur: true },
  {
    key: 'site/hero',
    url: `${U}/2026/02/Gulberg-Green.webp`,
    outputs: [
      { suffix: 'w800', w: 800, h: 401 },
      { suffix: 'w1280', w: 1280, h: 642 },
      { suffix: 'w1440', w: 1440, h: 722 },
      // Portrait crop for phones, so the photo isn't a thin strip behind tall content.
      { suffix: 'm480', w: 480, h: 600 },
      { suffix: 'm720', w: 578, h: 722 },
    ],
    blur: true,
  },
];

async function source(url) {
  const file = join(CACHE, url.replace(/^https?:\/\//, '').replace(/[^\w.-]+/g, '_'));
  if (!existsSync(file)) {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (image prefetch for MapleRise demo)' } });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return readFileSync(file);
}

mkdirSync(CACHE, { recursive: true });
rmSync(OUT, { recursive: true, force: true });
const manifest = [];
let index = 0;
for (const job of JOBS) {
  const input = await source(job.url);
  const meta = await sharp(input).metadata();
  const entry = { key: job.key, outputs: [] };
  for (const o of job.outputs) {
    let img = sharp(input);
    if (o.top) img = img.extract({ left: 0, top: 0, width: meta.width, height: Math.round(meta.height * o.top) });
    img = img.resize(o.w, o.h, { fit: 'cover', position: o.position ?? 'centre', withoutEnlargement: false });
    const rel = `${job.key}-${o.suffix}.webp`;
    const out = join(OUT, rel);
    mkdirSync(dirname(out), { recursive: true });
    await img.webp({ quality: o.w > 1000 ? 68 : 72, effort: 5 }).toFile(out);
    const kb = Math.round(statSync(out).size / 1024);
    if (o.suffix === 'card' && kb > 150) console.warn(`! ${rel} is ${kb} KB (> 150 KB)`);
    entry.outputs.push({ suffix: o.suffix, rel, w: o.w, h: o.h, kb, varName: `i${index++}` });
  }
  if (job.blur) {
    const first = job.outputs[0];
    const tiny = await sharp(input)
      .extract(first.top ? { left: 0, top: 0, width: meta.width, height: Math.round(meta.height * first.top) } : { left: 0, top: 0, width: meta.width, height: meta.height })
      .resize(16, Math.round((16 * first.h) / first.w), { fit: 'cover', position: first.position ?? 'centre' })
      .webp({ quality: 40 })
      .toBuffer();
    entry.blur = `data:image/webp;base64,${tiny.toString('base64')}`;
  }
  manifest.push(entry);
  console.log(job.key, entry.outputs.map((o) => `${o.suffix}:${o.kb}KB`).join(' '));
}

const lines = [
  '// Generated by scripts/fetch-images.mjs. Do not edit by hand.',
  '/* eslint-disable */',
  ...manifest.flatMap((e) => e.outputs.map((o) => `import ${o.varName} from './${o.rel}';`)),
  '',
  'export const IMAGES = {',
  ...manifest.map((e) => {
    const outs = e.outputs.map((o) => `${JSON.stringify(o.suffix)}: { src: ${o.varName}, width: ${o.w}, height: ${o.h} }`).join(', ');
    return `  ${JSON.stringify(e.key)}: { ${outs}${e.blur ? `, blur: ${JSON.stringify(e.blur)}` : ''} },`;
  }),
  '} as const;',
  '',
  'export type ImageKey = keyof typeof IMAGES;',
  '',
];
writeFileSync(join(OUT, 'manifest.ts'), lines.join('\n'));
console.log(`\nWrote ${manifest.length} images + manifest.ts`);
