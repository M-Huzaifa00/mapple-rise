import { SearchX, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { projectById, projects } from '../../data/projects';
import { useLang } from '../../i18n/useLang';
import {
  ALL_TYPES,
  CITIES,
  EMPTY_FILTERS,
  TYPE_KEY,
  filterProjects,
  hasActiveFilters,
  sortForDisplay,
  type ProjectFilters,
} from '../../lib/filters';
import { ChipGroup } from '../ui/ChipGroup';
import { ContactActions } from '../ui/ContactActions';
import { ProjectCard } from '../ui/ProjectCard';
import { SectionHeading } from '../ui/SectionHeading';

const INITIAL = 8;

/** Replaces RBS "Signature Projects" + "Projects Marketed by" with one filterable grid. */
export function FeaturedProjects({
  filters,
  onFiltersChange,
}: {
  filters: ProjectFilters;
  onFiltersChange: (f: ProjectFilters) => void;
}) {
  const { t } = useLang();
  const [expanded, setExpanded] = useState(false);
  const matches = useMemo(() => sortForDisplay(filterProjects(projects, filters)), [filters]);
  const visible = expanded ? matches : matches.slice(0, INITIAL);
  const set = (patch: Partial<ProjectFilters>) => onFiltersChange({ ...filters, ...patch });

  // Filters set only by the hero search, shown as removable chips.
  const extra: { key: string; label: string; clear: Partial<ProjectFilters> }[] = [];
  if (filters.society) extra.push({ key: 'society', label: projectById(filters.society)?.name ?? filters.society, clear: { society: '' } });
  if (filters.size) extra.push({ key: 'size', label: t(`filters.size.${filters.size}`), clear: { size: '' } });
  if (filters.budget) extra.push({ key: 'budget', label: t(`filters.budget.${filters.budget}`), clear: { budget: '' } });
  if (filters.monthly) extra.push({ key: 'monthly', label: t(`filters.monthly.${filters.monthly}`), clear: { monthly: '' } });

  const countText = filters.city
    ? t('projects.countIn', { count: matches.length, city: t(`cities.${filters.city}`) })
    : t('projects.count', { count: matches.length });

  const summary = [
    filters.city && t(`cities.${filters.city}`),
    filters.type && t(`types.${TYPE_KEY[filters.type]}`),
    ...extra.map((x) => x.label),
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <section id="projects" aria-labelledby="projects-title" className="bg-white py-20 lg:py-24">
      <div className="container-page">
        <SectionHeading id="projects-title" layout="split" eyebrow={t('projects.eyebrow')} title={t('projects.title')} intro={t('projects.intro')} />

        <div className="space-y-3 border-y border-line py-4">
          <ChipGroup
            label={t('search.city')}
            value={filters.city}
            onChange={(city) => set({ city })}
            options={[{ value: '' as const, label: t('projects.allCities') }, ...CITIES.map((c) => ({ value: c, label: t(`cities.${c}`) }))]}
          />
          <ChipGroup
            label={t('search.type')}
            value={filters.type}
            onChange={(type) => set({ type })}
            options={[{ value: '' as const, label: t('projects.allTypes') }, ...ALL_TYPES.map((ty) => ({ value: ty, label: t(`types.${TYPE_KEY[ty]}`) }))]}
          />
          {extra.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {extra.map((x) => (
                <button
                  key={x.key}
                  type="button"
                  onClick={() => set(x.clear)}
                  className="inline-flex min-h-11 items-center gap-1 rounded-sm border border-gold-500/60 bg-gold-50 px-3 text-[0.95rem] font-semibold text-brand-950 hover:border-gold-700"
                >
                  <bdi>{x.label}</bdi>
                  <X aria-hidden className="size-4" />
                  <span className="sr-only">{t('projects.removeFilter')}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="text-lg font-semibold text-brand-950">
            {countText}
          </p>
          {hasActiveFilters(filters) && (
            <button
              type="button"
              onClick={() => onFiltersChange({ ...EMPTY_FILTERS, intent: filters.intent })}
              className="min-h-11 font-semibold text-brand-800 underline decoration-gold-500 decoration-2 underline-offset-4"
            >
              {t('projects.clear')}
            </button>
          )}
        </div>

        {matches.length > 0 ? (
          <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((p) => (
              <li key={p.id}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-5 max-w-2xl rounded-md border border-dashed border-line bg-paper p-8">
            <SearchX aria-hidden className="size-8 text-brand-700" />
            <h3 className="mt-3 text-2xl">{t('projects.emptyTitle')}</h3>
            <p className="mt-2 text-ink-soft">{t('projects.emptyBody')}</p>
            <ContactActions className="mt-5 max-w-sm" message={t('wa.search', { summary: summary || t('projects.anything') })} />
          </div>
        )}

        {matches.length > INITIAL && (
          <div className="mt-10">
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((e) => !e)}
              className="inline-flex min-h-12 items-center rounded-md border border-brand-800 px-6 font-semibold text-brand-800 hover:bg-brand-50"
            >
              {expanded ? t('projects.showFewer') : t('projects.showAll', { count: matches.length })}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
