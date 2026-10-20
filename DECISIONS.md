# Decisions

One line per deviation from the brief or from RBS, with the reason.

## Phase 0 – data

- **Extended `ProjectCard` and `PaymentPlan` with optional fields** (`id`, `parent`, `area`, `priceNote`, `reviewNote`, `sqftPerMarla`, image size; plan `other[]`, `note`). Needed for menu nesting, explicit image sizes, and for schedules with possession or odd final instalments without changing published numbers.
- **Plan schedules with possession/balloting/selection amounts** go in `other[]`, so totals can be recomputed from parts without editing data.
- **Merged "Confirmation" cells** set equal to booking. Every affected table reconciles to its total when this is done.
- **Capital Hills is not nested under Capital Smart City** in the mega menu. Its page describes a separate Pir Sohawa Road project, so nesting it would mislead buyers.
- **CSC family, Pine City and Capital Hills use `city: 'Islamabad'`** with the real locality in `area`. Buyers search these as Islamabad projects; the page area line keeps it accurate (e.g. "Haripur district").
- **Jabal Resorts uses `city: 'Other'`** (Khanpur Dam), with locality shown.
- **Starting price = lowest price published on the project's own page**, with `priceNote` saying what it covers. Where only one size is priced (DHA Gandhara 1 Kanal) the note says so.
- **Mall of Gujar Khan and 30 Gateway have no starting price.** MGK publishes per-sq-ft rates only; 30 Gateway publishes no usable prices.
- **Stats**: three come from MapleRise text (85%, five decades, "hundreds"); "22 projects" is a count of their Properties menu. "Hundreds" is shown as a word, not an invented number.
- **Industry percentages** on the live site (88%, 32%, 70%) are not used as trust counters; they aren't MapleRise results.
- **`Properties-1.webp`** (generic city stock photo) is not used; the brief asks for real project imagery.
- **Default Marla = 225 sq ft** (matches CSC, LSC, Margalla, Capital Hills and Jabal data). Kohistan Enclave uses 250 (its 5 Marla = 1,250 sq ft).
- **Calculator presets: 16 plans** (12 Capital Smart City + 4 others) instead of 3–4, so users can find their size.
- **Spotlight: 11 of 14 districts** to keep the scroller short; left out Terraces, Hills View Heights, Cultural Heritage.
- **Data-integrity test passes while reporting mismatches.** It logs every plan whose parts differ from its total by more than PKR 1,000 and fails only if such a plan is *not* flagged `needsReview`. That keeps `npm test` green without hiding problems.

## Phase 1+ – layout and build

### Following RBS
- **RBS order kept; MapleRise extras inserted where they read naturally.** Calculator sits after the project grid (RBS "Payment Plan" menu). Why Choose Us, How We Work and Services sit between the spotlight (RBS Smart Facilities) and the team (RBS Leaders), as in the original brief. Full map in RBS_REFERENCE.md.
- **RBS "Signature Projects" + "Projects Marketed by" merged into one grid.** MapleRise markets projects; it doesn't develop them.
- **No RBS wording reused.** The lead form heading is "Find the Right Property for You" (not RBS's "Let's Find Your Perfect Property"); the hero uses MapleRise's own headline; the quote is original.
- **Header uses anchor links, not RBS's Our Firm / Developers / Blogs dropdowns.** Single page; only Projects needs a dropdown.
- **4 leader cards instead of RBS's 3.** MapleRise lists four leaders; the other 18 members sit in an expandable list.
- **Lead form drops email.** Name + phone + society is shorter, and WhatsApp/phone is the main channel.

### Usability upgrades
- **Hero search Buy/Invest.** Buy limits property types to residential; Invest adds commercial and shops. Budget means "starting price ≤ budget"; unpriced projects are hidden while a budget is selected, since they can't be compared.
- **Floating WhatsApp only from tablet up.** On phones the sticky Call | WhatsApp | Enquire bar replaces it, so they don't overlap.
- **Sq ft shown in a tooltip and screen-reader text, not a focusable tooltip.** Focusable tooltips would add 80+ tab stops to the grid.
- **`needsReview` is visible.** Amber "Details being verified" chip on cards and an amber note in the calculator. Rewritten How We Work captions are logged in DATA_ISSUES.md, not chipped, since they are copy, not data.
- **Counters animate only if below the fold and motion is allowed.** Final values are always in the prerendered HTML.
- **Testimonial carousel has no autoplay.** WCAG 2.2.2, and easier on slow phones.
- **Map is click-to-load.** Keeps Google's scripts and cookies off first load. It shows Islamabad until an address is confirmed.

### Images and brand
- **Text wordmark with an "M" monogram instead of the logo.** The only logo file is a 5 MB animated GIF. Replace with a static SVG/PNG from MapleRise.
- **Generic stock images on the live site are not used:** the About model with a toy house, the "Visit or Meet Us" handshake, and `Properties-1.webp`. Real MapleRise project photos are used instead (CSC Overseas East aerial; Faisal Mosque / Margalla Hills for the contact panel).
- **Margalla Enclave card uses the page's Faisal Mosque photo.** Its hero image is a Rio de Janeiro stock photo.
- **Hero image self-hosted** (`public/images/`, copied from MapleRise). It is the LCP element, and same-origin avoids a slow extra connection. Other images are hot-linked from mapleriseestates.com as the brief allows, using WordPress's 768px variants.
- **Gold `#B99111` is decorative only** (2.9:1 on white). Text uses gold-700 `#7C6000` on light backgrounds and gold-300 `#D9B23A` on green (both ≥ 6:1).
- **WhatsApp buttons use dark ink on WhatsApp green.** White on `#25D366` fails contrast (2:1).

### Urdu
- **Urdu covers the UI:** nav, hero, CTAs, form labels, section headings, errors. MapleRise's body copy, project names and prices stay English and are isolated as LTR (`data-latin`) inside the RTL page. Translations need a native-speaker review.
- **Noto Nastaliq Urdu loads only on first switch to Urdu.** The choice is remembered in `localStorage` (per-browser convenience only).

### Performance and build
- **Static prerender + hydration** (`react-dom/static`). Real HTML for counters, SEO and LCP without a server.
- **Below-the-fold sections in one lazy chunk, each in its own `<Suspense>`.** Hydration splits into small tasks; Lighthouse TBT went from ~480 ms to ~200–390 ms.
- **CSS inlined into the HTML** (9 KB gzipped). Removes the only render-blocking request.
- **Google Fonts with `display=optional`.** A late font is skipped for that visit instead of shifting the layout (CLS went from 0.11 to 0).
- **Mega menu and mobile drawer render their links only when open.** Removes ~380 DOM nodes from first load; project links stay crawlable via cards and the footer.
- **`zod/mini` instead of full zod.** Same validation, 17 KB gzipped less JS.
- **Tried `content-visibility: auto` on sections and removed it.** It didn't reduce style/layout time and confused contrast checks.
- **Dev port 3000** (`npm run dev`) as set in package.json. ESLint moved to typescript-eslint so `.tsx` files are linted.
