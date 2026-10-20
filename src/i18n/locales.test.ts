import { describe, expect, it } from 'vitest';
import { company, stats } from '../data/company';
import { pillars, steps } from '../data/howWeWork';
import { paymentPlans } from '../data/paymentPlans';
import { projects } from '../data/projects';
import { guides, reviews } from '../data/samples';
import { services } from '../data/services';
import { districts } from '../data/spotlight';
import { leaders, team } from '../data/team';
import en from './locales/en.json';
import ur from './locales/ur.json';

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

/** Flattens nested objects and arrays into dotted key paths ("a.b.0"). */
function keys(obj: Json, prefix = ''): string[] {
  if (obj === null || typeof obj !== 'object') return [prefix];
  return Object.entries(obj).flatMap(([k, v]) => keys(v as Json, prefix ? `${prefix}.${k}` : k));
}

function get(obj: Json, path: string): Json | undefined {
  return path.split('.').reduce<Json | undefined>((o, k) => (o && typeof o === 'object' ? (o as Record<string, Json>)[k] : undefined), obj);
}

describe('locales', () => {
  const enKeys = keys(en as Json).sort();
  const urKeys = keys(ur as Json).sort();

  it('en.json and ur.json have identical keys (including array lengths)', () => {
    expect(urKeys.filter((k) => !enKeys.includes(k)), 'only in ur.json').toEqual([]);
    expect(enKeys.filter((k) => !urKeys.includes(k)), 'only in en.json').toEqual([]);
  });

  it('has no empty strings', () => {
    for (const k of urKeys) expect(String(get(ur as Json, k)).trim(), `ur: ${k}`).not.toBe('');
    for (const k of enKeys) expect(String(get(en as Json, k)).trim(), `en: ${k}`).not.toBe('');
  });

  it('keeps the same {{placeholders}} in both languages', () => {
    const vars = (s: Json | undefined) => [...String(s).matchAll(/{{\s*(\w+)\s*}}/g)].map((m) => m[1]).sort();
    for (const k of enKeys) expect(vars(get(ur as Json, k)), k).toEqual(vars(get(en as Json, k)));
  });

  it('uses the glossary terms in Urdu', () => {
    const all = JSON.stringify(ur);
    for (const term of ['پلاٹ', 'مرلہ', 'کنال', 'سوسائٹی', 'قسط', 'اقساط', 'ڈاؤن پیمنٹ', 'بکنگ', 'پیمنٹ پلان', 'قبضہ', 'این او سی', 'اوورسیز پاکستانی', 'کال بیک', 'رابطہ کریں']) {
      expect(all.includes(term), term).toBe(true);
    }
  });
});

describe('every data item has its text', () => {
  const has = (path: string) => {
    const v = get(en as Json, path);
    return Array.isArray(v) ? v.length > 0 : typeof v === 'string' && v.length > 0;
  };

  it('projects: area, price note, NOC note and 3–5 highlights', () => {
    for (const p of projects) {
      for (const f of ['area', 'priceNote', 'noc']) expect(has(`data.projects.${p.id}.${f}`), `${p.id}.${f}`).toBe(true);
      const h = get(en as Json, `data.projects.${p.id}.highlights`);
      expect(Array.isArray(h) && h.length >= 3 && h.length <= 5, `${p.id}.highlights`).toBe(true);
      if (p.needsReview) expect(has(`data.projects.${p.id}.review`), `${p.id}.review`).toBe(true);
    }
  });

  it('plans: label, plus note and review when flagged', () => {
    for (const p of paymentPlans) {
      expect(has(`data.plans.${p.id}.label`), `${p.id}.label`).toBe(true);
      if (p.hasNote) expect(has(`data.plans.${p.id}.note`), `${p.id}.note`).toBe(true);
      if (p.needsReview) expect(has(`data.plans.${p.id}.review`), `${p.id}.review`).toBe(true);
    }
  });

  it('sections: services, pillars, steps, team, districts, guides, reviews, stats', () => {
    for (const s of services) expect(has(`data.services.${s.id}.title`) && has(`data.services.${s.id}.body`), s.id).toBe(true);
    for (const id of pillars) expect(has(`data.pillars.${id}.title`), id).toBe(true);
    for (const id of steps) expect(has(`data.steps.${id}.body`), id).toBe(true);
    for (const m of [...leaders, ...team]) expect(has(`data.team.${m.id}.role`), m.id).toBe(true);
    for (const m of leaders) expect(has(`data.team.${m.id}.bio`), m.id).toBe(true);
    for (const d of districts) expect(has(`data.districts.${d.id}.name`), d.id).toBe(true);
    for (const g of guides) expect(has(`data.guides.${g.id}.body`), g.id).toBe(true);
    for (const r of reviews) expect(has(`data.reviews.${r}.quote`), r).toBe(true);
    for (const s of stats) expect(has(`about.stats.${s.id}.label`), s.id).toBe(true);
  });

  it('project names stay in English (not translated)', () => {
    const urProjects = JSON.stringify((ur as { data: { projects: unknown } }).data.projects);
    expect(urProjects.includes('Capital Smart City')).toBe(false); // names are rendered from data, not locales
    expect(company.name).toBe('MapleRise Estates');
  });
});
