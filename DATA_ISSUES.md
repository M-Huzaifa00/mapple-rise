# Data issues

Found while scraping mapleriseestates.com on 2026-10-20. Original values are kept in `src/data/` and marked `needsReview: true` with a `reviewNote`. Nothing below has been corrected in the data.

## Prices and payment plans

| # | Where | Issue | Value kept |
|---|---|---|---|
| 1 | Capital Smart City → Smart Villas, 7 Marla 4 Bed | Booking **and** confirmation are listed as 12,265,000. The 12,650,000 total (and /smart-villas/) imply 1,265,000. | 12,265,000 |
| 2 | Capital Smart City → Overseas Prime Block, 7 Marla | /overseas-prime-block/ says PKR 3,230,000; the CSC page says PKR 4,675,000 for the same block and size. Other sizes differ too. | Card: 3,230,000 (from its own page). Calculator: 4,675,000 (from CSC page). |
| 3 | Overseas West, 10 Marla | Total 6,229,000, but booking 629,000 ×2 + 12 × 419,333 = 6,289,996. Likely a digit swap (6,290,000). | 6,229,000 |
| 4 | Overseas West | Table titled "3 Year Payment Plan" with 12 quarterly instalments; text and FAQ on the same page say 4.5 years / 18 quarterly. | Table values |
| 5 | Trivelles Smart Villas, 5 Marla 3 Bed | 930,000 ×2 + 12 × 616,590 = 9,259,080, which is 40,920 short of the 9,300,000 total. Same pattern on other rows. | As listed |
| 6 | CSC → Prime II Block, 5 Marla | Total 3,150,300; parts add up to 3,150,000. | 3,150,300 |
| 7 | Pine City → Pine Orchard 1 Kanal | Monthly column reads "22,251,800 (83,340 x 27)"; 83,340 × 27 = 2,250,180. Possession reads "1.500,000". | 83,340 × 27 |
| 8 | The Villas, 856 sq ft | PKR 3,610,000 on /the-villas/; PKR 3,750,000 on the CSC page. | Not used in calculator |
| 9 | CSC page → Villa Apartments | Separate 3-year plan dated "Price Revised (May 20, 2020)" with prices about double The Villas (4,950,000 for 660 sq ft). Stale. | Not used |
| 10 | Hamilton Hills | Instalment schedule runs Jan 2024 – Mar 2028 (stale). Prices "10 Marla" but size section lists 9.33 Marla. | Card price shown with flag |
| 11 | Capital Hills | Payment table has 9 headings but 8 values per row; can't map columns reliably. | Card price only (8,500,000) |
| 12 | Hawks Melbourne City | Residential payment table has no column headings. | Card price only (1,850,000) |
| 13 | Kohistan Enclave | Two tables price 5 Marla differently (5,000,000 vs 4,160,000). 9.8 Marla row in the instalment table is missing a column. | 4,160,000 |
| 14 | 30 Gateway | Payment table has numbers (45,000 / 100,000 / 22,000 …) with no units or headings. | No price |
| 15 | CSCI Phase 3 | 5 Marla 22% plan: down payment 339,500 in the table, 339,000 in the text (15% of 2,260,000 = 339,000). | — |
| 16 | Park View City, Block H | Down payments don't match 25% (5 Marla: 3,507,500 on 14,000,000; 1 Kanal: 15,025,000 on 60,000,000). | Not used |
| 17 | Several tables | "Confirmation 10%" is a merged cell (one value shown under two headings). Confirmation is set equal to booking. All affected plans reconcile when this is done. | — |

## Outdated content

- **Capital Smart City FAQs** say interchange construction "will begin in 2020" and possession "by the first quarter of 2020". Treated as outdated; not shown.
- **CSC policies** reference 2023–2024 deadlines (cancellation reinstatement by 15 Sep 2023; surcharges postponed to 30 Jun 2024).
- **CSC area**: "150,000 kanal" in one section, "over 55,000 Kanal" in the FAQ.
- **CSC NOC**: body says RDA; one FAQ says CDA approved and "all necessary approvals … including CDA".

## Copy-paste and attribution errors on the live site

- **Mall of Gujar Khan**: "a project undertaken by MapleRise Real Estate and Builders". Likely a find-and-replace of another agency's name. Do not show any ownership claim until the client confirms.
- **Kohistan Enclave** FAQ: "Stay updated with Rbsland.com".
- **Capital Hills**: refers to "MapleRise Real Estate Builders … nearly two decades of industry experience" and, in the FAQ, "RBS Real Estate Builders recommends it".
- **Overseas Prime Block** page: "Platinum Sales Partner: Royal Business Solutions … is the Official Sales Partner of Capital Smart City", followed by "MapleRise is working with this firm". Also headings "One Capital Residencies Location" and a One Capital tab inside the payment section.
- **Hamilton Hills**: "the Wall Real Estate team will guide you".
- **Capital Hills in the menu**: listed under Capital Smart City, but the page describes a separate project on Pir Sohawa Road (NSK Construction / Capital Group).
- Wrong headings: Pine City "Margalla Enclave Location & Accessibility"; DHA Gandhara "Nearby Landmarks of Park View City"; Smart Villas "Trivelles Smart Villas Masterplan".
- **Lahore Smart City** page includes CSC partner text ("Lahore Smart City Islamabad", NDU agreement with Capital Smart City).
- **Home page "How We Work"**: steps 2 and 4 use captions from the contact page ("They want to understand prices and locations", "They want local insight they can trust"). Display text rewritten in `howWeWork.ts`; originals kept.

## Names and spellings

Display names are normalised; source URLs are unchanged.

| Menu / page spelling | Display name | URL kept |
|---|---|---|
| Hawks Melobourne | Hawks Melbourne City | /hawks-melobourne-city/ |
| Trivellas Smart Villas | Trivelles Smart Villas | /trivelles-smart-villas/ |
| Mall of Gujjar Khan (URL) | Mall of Gujar Khan | /mall-of-gujjar-khan/ |
| Parkview City | Park View City | /park-view-city/ |
| Gulberg Green | Gulberg Greens | /gulberg-green/ |
| Azfar zulfiqar | Azfar Zulfiqar | — |
| Pine City owner: "Major (R) Siddique Anwar" vs "Major Anwar Saddique" | Maj. (R) Siddique Anwar | — |

## Images

- **Margalla Enclave** hero image (`margalla-enclave-1-1.webp`) is a stock photo of Rio de Janeiro's Sambadrome, not the project. The card uses the page's Faisal Mosque photo instead.
- **Overseas Prime Block** (`overseas-prime-block.webp`) and **Capital Hills** (`CAPITAL-HILLS.webp`) use the same render. At most one can be correct.
- **Generic stock imagery:** the About image (`guiding-you-to-the-right-home`, a model holding a toy house), the contact page's "Visit or Meet Us" handshake, and the Properties banner (`Properties-1.webp`, a non-Pakistani city). Not used in the demo.
- **Harmony Homes** has no image of its own; the card reuses the Capital Smart City render.
- **Heavy files:** logo GIF 5 MB; Zubair Akbar team PNG 1.8 MB (the demo uses WordPress's 298×300 variant).

## Team

- **Founder "five decades in the real estate sector"** (Our Team page) drives the "50+ years" counter. The photo shows a much younger person; confirm the figure before launch.

## Contact and site details

- Footer email link is `mailto:contact@mysite.com` and phone link is `tel:123-456-7890` (theme defaults). The demo uses info@mapleriseestates.com and +92 300 1226381, which the site shows as text.
- No street address, office hours, or map embed is published. /contact/ only says "visit us in Islamabad".
- Logo is an animated 2000×2000 GIF; no static SVG/PNG found.
- Team page: 13 of 22 members use a generic silhouette image. Muhammad Yusuf's bio describes operations leadership, not design and media.
- Home page "88% of buyers rely on experts", "32% faster" and About "70% of buyers start online" are industry statistics, not MapleRise results. Not used as counters.
