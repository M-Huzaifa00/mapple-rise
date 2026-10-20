import { projects } from '../data/projects';
import {
  ALL_TYPES,
  BUDGETS,
  CITIES,
  EMPTY_FILTERS,
  MONTHLY_BUDGETS,
  SIZE_RANGES,
  type ProjectFilters,
} from './filters';

/** Filters ↔ query string, so a filtered view can be shared (?city=Lahore&monthly=50k). */
export function filtersToSearch(f: ProjectFilters): string {
  const q = new URLSearchParams();
  if (f.intent === 'invest') q.set('intent', 'invest');
  for (const key of ['city', 'society', 'type', 'size', 'budget', 'monthly'] as const) if (f[key]) q.set(key, f[key]);
  const s = q.toString();
  return s ? `?${s}` : '';
}

const pick = <T extends string>(value: string | null, allowed: readonly T[]): T | '' =>
  value !== null && (allowed as readonly string[]).includes(value) ? (value as T) : '';

/** Unknown values are dropped, so a hand-edited URL can't break the page. */
export function filtersFromSearch(search: string): ProjectFilters {
  const q = new URLSearchParams(search);
  return {
    ...EMPTY_FILTERS,
    intent: q.get('intent') === 'invest' ? 'invest' : 'buy',
    city: pick(q.get('city'), CITIES),
    society: pick(q.get('society'), projects.map((p) => p.id)),
    type: pick(q.get('type'), ALL_TYPES),
    size: pick(q.get('size'), SIZE_RANGES.map((r) => r.id)),
    budget: pick(q.get('budget'), BUDGETS.map((b) => b.id)),
    monthly: pick(q.get('monthly'), MONTHLY_BUDGETS.map((m) => m.id)),
  };
}
