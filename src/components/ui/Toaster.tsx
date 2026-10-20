import { X } from 'lucide-react';
import { useLang } from '../../i18n/useLang';
import { useUI } from '../../state/ui';

/** Polite live region for short confirmations ("Number copied", "coming soon"). Never blocks the page. */
export function Toaster() {
  const { t } = useLang();
  const { toasts, dismissToast } = useUI();
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 md:bottom-6"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex max-w-md animate-fade-in items-center gap-3 rounded-md bg-brand-950 py-2 ps-4 pe-1 text-[0.95rem] text-white"
        >
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-md hover:bg-white/10"
            aria-label={t('common.dismiss')}
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
