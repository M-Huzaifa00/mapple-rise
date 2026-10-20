import { describe, expect, it } from 'vitest';
import { projects } from '../data/projects';
import { sizeToMarla, sizeToSqft } from './area';
import { EMPTY_FILTERS, filterProjects } from './filters';
import { formatSize } from './sizes';
import { filtersFromSearch, filtersToSearch } from './urlState';

describe('area and sizes', () => {
  it('converts Marla and Kanal', () => {
    expect(sizeToMarla('7 Marla')).toBe(7);
    expect(sizeToMarla('1 Kanal')).toBe(20);
    expect(sizeToMarla('3.5 Marla (20×40)')).toBe(3.5);
    expect(sizeToMarla('Studio')).toBeNull();
    expect(sizeToSqft('5 Marla')).toBe(1125);
    expect(sizeToSqft('5 Marla', 272.25)).toBe(1361);
  });

  it('translates unit words and keeps numbers', () => {
    const ur: Record<string, string> = { marla: 'مرلہ', kanal: 'کنال', sqyd: 'مربع گز', bed: 'بیڈ' };
    expect(formatSize('5 Marla (125 sq yd)', (k) => ur[k] ?? k)).toBe('5 مرلہ (125 مربع گز)');
    expect(formatSize('1 Kanal', (k) => ur[k] ?? k)).toBe('1 کنال');
    expect(formatSize('2 Bed', (k) => ur[k] ?? k)).toBe('2 بیڈ');
  });
});

describe('filterProjects', () => {
  const ids = (f: Partial<typeof EMPTY_FILTERS>) => filterProjects(projects, { ...EMPTY_FILTERS, ...f }).map((p) => p.id);

  it('returns everything with no filters', () => {
    expect(ids({})).toHaveLength(projects.length);
  });

  it('filters by city', () => {
    expect(ids({ city: 'Lahore' })).toEqual(['lahore-smart-city']);
  });

  it('includes sub-projects when a parent society is chosen', () => {
    const r = ids({ society: 'capital-smart-city' });
    expect(r).toContain('capital-smart-city');
    expect(r).toContain('smart-villas');
    expect(r).not.toContain('capital-hills');
  });

  it('filters by total budget on starting price and hides unpriced projects', () => {
    const r = ids({ budget: '25l' });
    expect(r).toContain('capital-smart-city');
    expect(r).not.toContain('mall-of-gujar-khan');
    expect(r).not.toContain('park-view-city');
  });

  it('filters by monthly qist using the cheapest published plan', () => {
    const r = ids({ monthly: '25k' });
    expect(r).toContain('capital-smart-city'); // 17,038 / month
    expect(r).toContain('the-villas'); // 22,375 / month
    expect(r).not.toContain('smart-villas'); // ≈ 210,667 / month (quarterly)
    expect(r).not.toContain('dha-gandhara'); // no plan
  });

  it('filters by size range', () => {
    const r = ids({ size: '20plus' });
    expect(r).toContain('gulberg-green');
    expect(r).not.toContain('the-villas');
  });
});

describe('filters in the URL', () => {
  it('round-trips through the query string', () => {
    const f = { ...EMPTY_FILTERS, intent: 'invest' as const, city: 'Islamabad' as const, monthly: '50k' as const };
    const qs = filtersToSearch(f);
    expect(qs).toBe('?intent=invest&city=Islamabad&monthly=50k');
    expect(filtersFromSearch(qs)).toEqual(f);
  });

  it('drops unknown values from hand-edited URLs', () => {
    expect(filtersFromSearch('?city=Karachi&type=Castle&society=capital-smart-city')).toEqual({
      ...EMPTY_FILTERS,
      society: 'capital-smart-city',
    });
    expect(filtersToSearch(EMPTY_FILTERS)).toBe('');
  });
});
