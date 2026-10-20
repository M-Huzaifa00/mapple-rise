import { DEFAULT_SQFT_PER_MARLA } from '../../data/projects';
import { useLang } from '../../i18n/useLang';
import { sizeToSqft } from '../../lib/area';

/**
 * Marla/Kanal first; sq ft in the tooltip and for screen readers. Uses the project's own sq ft per
 * Marla when known, otherwise the configured default (and says so).
 */
export function AreaChip({ size, sqftPerMarla }: { size: string; sqftPerMarla?: number }) {
  const { t, size: label } = useLang();
  const perMarla = sqftPerMarla ?? DEFAULT_SQFT_PER_MARLA;
  const sqft = sizeToSqft(size, perMarla);
  const hint = sqft
    ? sqftPerMarla
      ? t('projects.sqftHint', { sqft: sqft.toLocaleString('en-US') })
      : t('projects.sqftHintDefault', { sqft: sqft.toLocaleString('en-US'), per: perMarla })
    : undefined;
  return (
    <span
      title={hint}
      className={`inline-flex rounded-sm border border-line px-2 py-0.5 text-sm font-medium text-ink-soft ${hint ? 'cursor-help' : ''}`}
    >
      <bdi className="tabular">{label(size)}</bdi>
      {hint && <span className="sr-only">, {hint}</span>}
    </span>
  );
}
