import { TriangleAlert } from 'lucide-react';
import { useLang } from '../../i18n/useLang';

/** Grey chip on anything that is a placeholder rather than MapleRise data. */
export function SampleChip({ className = '' }: { className?: string }) {
  const { t } = useLang();
  return (
    <span
      title={t('common.sampleHint')}
      className={`inline-flex items-center rounded-sm border border-line bg-sand px-1.5 py-px align-middle text-xs font-bold tracking-wide text-ink-soft uppercase ${className}`}
    >
      {t('common.sample')}
      <span className="sr-only">: {t('common.sampleHint')}</span>
    </span>
  );
}

/** Data flagged needsReview. The note is in the tooltip and the screen-reader text. */
export function ReviewChip({ note }: { note?: string }) {
  const { t } = useLang();
  return (
    <span title={note} className="inline-flex items-center gap-1 rounded-sm border border-gold-500/50 bg-gold-50 px-1.5 py-px text-xs font-semibold text-gold-700">
      <TriangleAlert aria-hidden className="size-3.5" />
      {t('common.underReview')}
      {note && <span className="sr-only">: {note}</span>}
    </span>
  );
}
