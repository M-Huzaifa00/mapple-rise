import { describe, expect, it } from 'vitest';
import { IMAGES } from '../assets/images/manifest';
import en from '../i18n/locales/en.json';
import { TOLERANCE_PKR, planMismatch, sumOfParts } from '../lib/calculator';
import { formatPKR } from '../lib/currency';
import { paymentPlans } from './paymentPlans';
import { projects } from './projects';

const planText = en.data.plans as Record<string, { label: string; note?: string; review?: string }>;
const projectText = en.data.projects as Record<string, { review?: string }>;

/**
 * Recomputes every plan's total from its parts (±PKR 1,000).
 * Mismatches are printed and get their own visible test; the suite fails only if a mismatched
 * plan is NOT flagged needsReview, i.e. a data problem nobody has acknowledged (see DECISIONS.md).
 */
describe('payment plan totals', () => {
  const mismatched = paymentPlans.filter((p) => Math.abs(planMismatch(p)) > TOLERANCE_PKR);

  it('reports every plan whose parts do not add up to its total', () => {
    for (const p of mismatched) {
      console.warn(
        `[data-integrity] ${p.id} (${p.project} – ${planText[p.id]?.label}, ${p.size}): listed ${formatPKR(p.totalPKR)}, ` +
          `parts add up to ${formatPKR(sumOfParts(p))} (difference ${formatPKR(planMismatch(p))}). ` +
          `needsReview=${Boolean(p.needsReview)}`,
      );
    }
    expect(mismatched.map((p) => p.id)).toMatchInlineSnapshot(`
      [
        "csc-smart-villa-7m-4b",
        "csc-west-10m",
        "csc-trivelles-5m-3b",
      ]
    `);
  });

  // One visible test per mismatch, so they appear in the test report itself.
  it.each(
    mismatched.map((p) => [
      `${p.id}: listed ${formatPKR(p.totalPKR)} vs parts ${formatPKR(sumOfParts(p))} (diff ${formatPKR(planMismatch(p))})`,
      p,
    ] as const),
  )('MISMATCH %s – flagged needsReview', (_label, p) => {
    expect(p.needsReview).toBe(true);
  });

  it.each(paymentPlans.map((p) => [p.id, p] as const))('%s: a mismatch must be flagged and explained', (_id, p) => {
    if (Math.abs(planMismatch(p)) > TOLERANCE_PKR) {
      expect(p.needsReview, `${p.id} does not add up and is not flagged`).toBe(true);
      expect(planText[p.id]?.review).toBeTruthy();
    }
  });

  it('every plan has a source, a verification date and a project', () => {
    const ids = new Set(projects.map((p) => p.id));
    for (const p of paymentPlans) {
      expect(p.sourceUrl).toMatch(/^https:\/\/mapleriseestates\.com\//);
      expect(p.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(ids.has(p.projectId), `${p.id} → unknown project ${p.projectId}`).toBe(true);
    }
  });

  it('plan ids are unique', () => {
    expect(new Set(paymentPlans.map((p) => p.id)).size).toBe(paymentPlans.length);
  });
});

describe('projects', () => {
  it('has the 22 projects from the MapleRise menu with unique ids', () => {
    expect(projects).toHaveLength(22);
    expect(new Set(projects.map((p) => p.id)).size).toBe(22);
  });

  it('keeps each live MapleRise page for when DEMO_MODE is off', () => {
    for (const p of projects) expect(p.sourceUrl).toMatch(/^https:\/\/mapleriseestates\.com\/[a-z0-9-]+\/$/);
  });

  it('only nests under projects that exist', () => {
    const ids = new Set(projects.map((p) => p.id));
    for (const p of projects) if (p.parent) expect(ids.has(p.parent)).toBe(true);
  });

  it('uses local images that exist in the manifest, with a card variant ≤ 800px wide', () => {
    for (const p of projects) {
      expect(p.images.length).toBeGreaterThan(0);
      for (const key of p.images) {
        const entry = IMAGES[key];
        expect(entry, key).toBeDefined();
        expect('card' in entry && entry.card.width).toBeLessThanOrEqual(800);
      }
    }
  });

  it('explains every needsReview flag', () => {
    for (const p of projects.filter((x) => x.needsReview)) expect(projectText[p.id]?.review, p.id).toBeTruthy();
  });

  it('has 8 featured projects for the initial grid', () => {
    expect(projects.filter((p) => p.featured)).toHaveLength(8);
  });
});
