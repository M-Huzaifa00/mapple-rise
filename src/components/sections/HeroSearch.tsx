import { Search } from 'lucide-react';
import { useRef, useState, type KeyboardEvent } from 'react';
import { projects } from '../../data/projects';
import { useLang } from '../../i18n/useLang';
import {
  ALL_TYPES,
  BUDGETS,
  BUY_TYPES,
  CITIES,
  EMPTY_FILTERS,
  MONTHLY_BUDGETS,
  SIZE_RANGES,
  TYPE_KEY,
  type Intent,
  type ProjectFilters,
} from '../../lib/filters';
import type { City } from '../../types';
import { buttonStyles } from '../ui/buttonStyles';
import { SelectField } from '../ui/FormFields';

const INTENTS: Intent[] = ['buy', 'invest'];

/**
 * Portal-style search in the order Pakistani buyers know: City → Society → Type → Size → Budget,
 * plus monthly qist. Submitting filters the project grid and scrolls to it.
 */
export function HeroSearch({ onSearch }: { onSearch: (f: ProjectFilters) => void }) {
  const { t } = useLang();
  const [f, setF] = useState<ProjectFilters>(EMPTY_FILTERS);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const types = f.intent === 'buy' ? BUY_TYPES : ALL_TYPES;
  const societies = projects.filter((p) => !f.city || p.city === f.city);
  const update = (patch: Partial<ProjectFilters>) => setF((prev) => ({ ...prev, ...patch }));

  const selectIntent = (intent: Intent) =>
    update({ intent, type: f.type && (intent === 'buy' ? BUY_TYPES : ALL_TYPES).includes(f.type) ? f.type : '' });

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const next = (i + 1) % INTENTS.length;
    selectIntent(INTENTS[next]);
    tabs.current[next]?.focus();
  };

  return (
    <form
      role="search"
      aria-label={t('search.title')}
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(f);
      }}
      className="rounded-md border border-line bg-white p-4 sm:p-5"
    >
      <div role="tablist" aria-label={t('search.title')} className="inline-flex border-b border-line">
        {INTENTS.map((intent, i) => {
          const selected = f.intent === intent;
          return (
            <button
              key={intent}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`tab-${intent}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="hero-search-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => selectIntent(intent)}
              onKeyDown={(e) => onTabKey(e, i)}
              className={`-mb-px min-h-11 border-b-2 px-4 font-semibold transition-colors ${
                selected ? 'border-brand-800 text-brand-900' : 'border-transparent text-ink-mute hover:text-brand-800'
              }`}
            >
              {t(`search.${intent}`)}
            </button>
          );
        })}
      </div>

      <div
        id="hero-search-panel"
        role="tabpanel"
        aria-labelledby={`tab-${f.intent}`}
        className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4"
      >
        <SelectField
          label={t('search.city')}
          value={f.city}
          onChange={(e) => {
            const city = e.target.value as City | '';
            const keep = projects.some((p) => p.id === f.society && (!city || p.city === city));
            update({ city, society: keep ? f.society : '' });
          }}
        >
          <option value="">{t('search.any')}</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {t(`cities.${c}`)}
            </option>
          ))}
        </SelectField>
        <SelectField label={t('search.society')} value={f.society} onChange={(e) => update({ society: e.target.value })}>
          <option value="">{t('search.any')}</option>
          {societies.map((p) => (
            <option key={p.id} value={p.id}>
              {p.parent ? t('projects.subOf', { parent: 'CSC', name: p.name }) : p.name}
            </option>
          ))}
        </SelectField>
        <SelectField label={t('search.type')} value={f.type} onChange={(e) => update({ type: e.target.value as ProjectFilters['type'] })}>
          <option value="">{t('search.any')}</option>
          {types.map((ty) => (
            <option key={ty} value={ty}>
              {t(`types.${TYPE_KEY[ty]}`)}
            </option>
          ))}
        </SelectField>
        <SelectField label={t('search.size')} value={f.size} onChange={(e) => update({ size: e.target.value as ProjectFilters['size'] })}>
          <option value="">{t('search.any')}</option>
          {SIZE_RANGES.map((r) => (
            <option key={r.id} value={r.id}>
              {t(`filters.size.${r.id}`)}
            </option>
          ))}
        </SelectField>
        <SelectField label={t('search.budget')} value={f.budget} onChange={(e) => update({ budget: e.target.value as ProjectFilters['budget'] })}>
          <option value="">{t('search.any')}</option>
          {BUDGETS.map((b) => (
            <option key={b.id} value={b.id}>
              {t(`filters.budget.${b.id}`)}
            </option>
          ))}
        </SelectField>
        <SelectField label={t('search.monthly')} value={f.monthly} onChange={(e) => update({ monthly: e.target.value as ProjectFilters['monthly'] })}>
          <option value="">{t('search.any')}</option>
          {MONTHLY_BUDGETS.map((m) => (
            <option key={m.id} value={m.id}>
              {t(`filters.monthly.${m.id}`)}
            </option>
          ))}
        </SelectField>
        <div className="col-span-2 flex items-end md:col-span-3 xl:col-span-2">
          <button type="submit" className={`${buttonStyles.primary} w-full`}>
            <Search aria-hidden className="size-5" />
            {t('search.submit')}
          </button>
        </div>
      </div>
    </form>
  );
}
