import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useLang } from '../../i18n/useLang';

/** Sticky title bar with a labelled close button (text + icon, ≥ 48px). */
export function OverlayHeader({ id, title, sub, onClose }: { id: string; title: ReactNode; sub?: ReactNode; onClose: () => void }) {
  const { t } = useLang();
  return (
    <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-paper px-5 py-4 sm:px-6">
      <div className="min-w-0">
        <h2 id={id} className="text-3xl leading-tight">
          {title}
        </h2>
        {sub && <p className="mt-1 text-[0.95rem] text-ink-mute">{sub}</p>}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="inline-flex min-h-12 shrink-0 items-center gap-1.5 rounded-md border border-line px-3 font-semibold text-brand-900 hover:border-brand-700"
      >
        <X aria-hidden className="size-5" />
        {t('common.close')}
      </button>
    </div>
  );
}
