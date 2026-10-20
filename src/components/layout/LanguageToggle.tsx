import { Languages } from 'lucide-react';
import { useState } from 'react';
import { setLanguage } from '../../i18n';
import { useLang } from '../../i18n/useLang';

/** "اردو" / "English". Urdu text and fonts load on first switch; the page doesn't reload. */
export function LanguageToggle({ className = '' }: { className?: string }) {
  const { t, lang } = useLang();
  const [busy, setBusy] = useState(false);
  const next = lang === 'en' ? 'ur' : 'en';

  const onClick = async () => {
    setBusy(true);
    try {
      await setLanguage(next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-busy={busy}
      title={t('lang.switchLabel')}
      className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border border-line px-3 font-semibold text-brand-900 hover:border-brand-700 disabled:opacity-60 ${className}`}
      disabled={busy}
    >
      <Languages aria-hidden className="size-4" />
      <span lang={next}>{t('lang.switchTo')}</span>
      <span className="sr-only">: {t('lang.switchLabel')}</span>
    </button>
  );
}
