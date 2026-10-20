import { projects } from '../data/projects';
import type { City, ProjectCard, PropertyType } from '../types';
import { sizeToMarla } from './area';
import { installmentSummary } from './plans';

export type Intent = 'buy' | 'invest';

/** Labels: filters.size.<id> */
export const SIZE_RANGES = [
  { id: 'upto5', min: 0, max: 5 },
  { id: '5to10', min: 5, max: 10 },
  { id: '10to20', min: 10, max: 20 },
  { id: '20plus', min: 20, max: Number.POSITIVE_INFINITY },
] as const;
export type SizeRangeId = (typeof SIZE_RANGES)[number]['id'];

/** Total budget = the most a buyer can put into the starting price. Labels: filters.budget.<id> */
export const BUDGETS = [
  { id: '25l', max: 2_500_000 },
  { id: '50l', max: 5_000_000 },
  { id: '1c', max: 10_000_000 },
  { id: '2c', max: 20_000_000 },
  { id: '5c', max: 50_000_000 },
] as const;
export type BudgetId = (typeof BUDGETS)[number]['id'];

/** Monthly qist the buyer can manage. Labels: filters.monthly.<id> */
export const MONTHLY_BUDGETS = [
  { id: '25k', max: 25_000 },
  { id: '50k', max: 50_000 },
  { id: '1l', max: 100_000 },
  { id: '2l', max: 200_000 },
  { id: '2lplus', max: Number.POSITIVE_INFINITY },
] as const;
export type MonthlyBudgetId = (typeof MONTHLY_BUDGETS)[number]['id'];

export const BUY_TYPES: PropertyType[] = ['Residential Plot', 'Villa/House', 'Apartment', 'Farmhouse'];
export const ALL_TYPES: PropertyType[] = [...BUY_TYPES, 'Commercial Plot', 'Shop/Office'];
export const CITIES = [...new Set(projects.map((p) => p.city))] as City[];

/** Translation-key slug for a property type (types.<slug>). */
export const TYPE_KEY: Record<PropertyType, string> = {
  'Residential Plot': 'residentialPlot',
  'Commercial Plot': 'commercialPlot',
  'Villa/House': 'villaHouse',
  Apartment: 'apartment',
  Farmhouse: 'farmhouse',
  'Shop/Office': 'shopOffice',
};

export interface ProjectFilters {
  intent: Intent;
  city: City | '';
  society: string;
  type: PropertyType | '';
  size: SizeRangeId | '';
  budget: BudgetId | '';
  monthly: MonthlyBudgetId | '';
}

export const EMPTY_FILTERS: ProjectFilters = { intent: 'buy', city: '', society: '', type: '', size: '', budget: '', monthly: '' };

export function hasActiveFilters(f: ProjectFilters): boolean {
  return Boolean(f.city || f.society || f.type || f.size || f.budget || f.monthly);
}

export function filterProjects(list: ProjectCard[], f: ProjectFilters): ProjectCard[] {
  const size = SIZE_RANGES.find((r) => r.id === f.size);
  const budget = BUDGETS.find((b) => b.id === f.budget);
  const monthly = MONTHLY_BUDGETS.find((m) => m.id === f.monthly);

  return list.filter((p) => {
    if (f.city && p.city !== f.city) return false;
    if (f.society && p.id !== f.society && p.parent !== f.society) return false;
    if (f.type && !p.types.includes(f.type)) return false;
    if (size) {
      const fits = p.sizes.some((s) => {
        const m = sizeToMarla(s);
        return m !== null && m >= size.min && m <= size.max;
      });
      if (!fits) return false;
    }
    // Unpriced projects are hidden while a budget is chosen, since they can't be compared.
    if (budget && (p.startingPricePKR === undefined || p.startingPricePKR > budget.max)) return false;
    if (monthly) {
      const m = installmentSummary(p.id).monthlyFrom;
      if (!m || m.amount > monthly.max) return false;
    }
    return true;
  });
}

/** Featured first, otherwise keep data order. */
export function sortForDisplay(list: ProjectCard[]): ProjectCard[] {
  return [...list].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
}
