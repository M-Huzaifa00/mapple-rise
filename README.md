# MapleRise Estates – home page demo

Single-page home page for [MapleRise Estates](https://mapleriseestates.com/), laid out on the section order of the RBS home page (see [RBS_REFERENCE.md](RBS_REFERENCE.md)) and filled with MapleRise's own data.

Vite + React 19 + TypeScript (strict) + Tailwind CSS 4. lucide-react icons, react-hook-form + zod/mini for forms, Vitest for tests. No backend.

## Setup

Requires Node 20+.

```bash
npm install
npm run dev        # dev server (http://localhost:3000)
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server with hot reload. |
| `npm run build` | Type-check, client build, SSR build, then prerender the page into `dist/index.html` (static HTML + inlined CSS). |
| `npm run preview` | Serve `dist/` locally to check the production build. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm test` | Vitest: PKR formatting, phone normalisation, calculator, filters, form schemas, data integrity. |
| `npm run lint` | ESLint (typescript-eslint, react-hooks). |

`dist/` is a static site: deploy it to any static host (Netlify, Vercel, S3, Nginx). It needs no server code.

### Why the build prerenders

`scripts/prerender.mjs` renders the page with `react-dom/static` at build time, so the full page (including the trust counters' final numbers) is in the HTML before JavaScript runs. That helps SEO, LCP and slow phones. Everything below the hero is loaded as one lazy chunk and hydrated section by section.

## Project structure

```
src/
  App.tsx                 section order (matches RBS_REFERENCE.md)
  components/
    layout/               TopBar, Header, MegaMenu, MobileDrawer, Footer, GlobalCtas
    sections/             one component per home-page section
    ui/                   cards, chips, form fields, buttons, icons
  data/                   all content (typed) – edit these, not the components
  lib/                    currency, phone, calculator, filters, leads, whatsapp, validation
  i18n/                   English/Urdu strings + language provider (RTL, Urdu font on demand)
  hooks/                  active section, scroll position, count-up
  types/                  ProjectCard, PaymentPlan, etc.
public/images/            self-hosted hero image (from mapleriseestates.com)
```

## Editing content

All content lives in `src/data/`. Types in `src/types/index.ts` will flag missing or misspelt fields.

| File | Contains |
|---|---|
| `company.ts` | Name, phone, email, WhatsApp number, socials, address/hours (placeholders), hero/about copy, trust counters, brand tokens |
| `projects.ts` | The 22 project cards. `featured: true` shows a project in the first 8; `parent: 'capital-smart-city'` nests it in the mega menu; `sqftPerMarla` overrides the 225 sq ft default; `needsReview` + `reviewNote` show an amber "Details being verified" chip |
| `paymentPlans.ts` | Calculator plans. Copy numbers exactly as the developer publishes them; put possession or other one-off amounts in `other[]`; update `lastVerified` |
| `services.ts`, `howWeWork.ts`, `team.ts`, `spotlight.ts` | Section content |
| `samples.ts` | Placeholder guides, reviews and quote. Replace before launch |

After editing plans run `npm test`. The data-integrity test recomputes every plan from its parts (±PKR 1,000), prints each mismatch, and fails if a mismatched plan isn't flagged `needsReview`.

To add an Urdu string, add the key to both `en` and `ur` in `src/i18n/strings.ts` (TypeScript enforces both).

## Plugging in a real lead API

Both forms call one function: `submitLead()` in `src/lib/leads.ts`. Today it appends to `localStorage["leads"]`. To use an API, replace its body and keep the return type:

```ts
export async function submitLead(input: LeadInput): Promise<LeadResult> {
  const { website, ...data } = input;
  if (website) return { ok: true, lead: { ...data, id: 'spam', createdAt: new Date().toISOString() } }; // honeypot
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) return { ok: false, error: 'Could not send. Please try WhatsApp.' };
  return { ok: true, lead: await res.json() };
}
```

Phone numbers arrive already normalised to E.164 (`+923001234567`). The `website` field is a honeypot; drop requests that fill it. WhatsApp never opens automatically; the user clicks **Continue on WhatsApp**.

## Quality checks run (2026-10-20)

- `npm run build`, `npm run typecheck`, `npm test` (68 tests; the three plan mismatches print as `MISMATCH …` lines) and `npm run lint` pass.
- Headless Edge at 360, 390, 768, 1024 and 1440 px, in English and Urdu (RTL): no horizontal scroll, no console or hydration errors. Mega menu, drawer (Escape), hero search, lead form, calculator and language toggle were exercised.
- Lighthouse mobile (simulated 4G), three runs on the production build: Performance 90–95, Accessibility 100, Best Practices 96, SEO 100; LCP 1.9–2.1 s; CLS 0.
- Initial JS: 109 KB gzipped (+18 KB lazy chunk for below-the-fold sections).

## Before going live: MapleRise must confirm

1. **Office address, hours and map location.** None are published; the demo shows Sample values.
2. **Trust counters.** Especially "50+ years founder experience", taken from the Our Team page ("five decades"); see DATA_ISSUES.md.
3. **Team photos** for the 13 members shown with a generic silhouette on the live site, plus a static logo file (SVG/PNG).
4. **Testimonials and guides.** All current ones are Sample placeholders.
5. **Flagged prices.** Smart Villa 7 Marla booking, Overseas Prime Block 3.23M vs 4.675M, Overseas West 10 Marla, Trivelles, Prime II, Pine Orchard, Kohistan, Hamilton Hills (stale 2024 schedule), The Villas 856 sq ft. Full list in [DATA_ISSUES.md](DATA_ISSUES.md).
6. **Copy and ownership errors on the live site** (Mall of Gujar Khan "undertaken by MapleRise", references to RBS / other agencies).
7. **The quote-banner line**, and the Urdu translations (machine-assisted; native review recommended).

See also [DECISIONS.md](DECISIONS.md) and [DATA_ISSUES.md](DATA_ISSUES.md).
