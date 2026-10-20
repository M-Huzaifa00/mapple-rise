import { useLang } from '../../i18n/useLang';

/**
 * Text wordmark. The only logo file on the live site is a 5 MB animated GIF; swap in a static
 * SVG/PNG when MapleRise supplies one (see DATA_ISSUES.md).
 */
export function Wordmark({ tone = 'dark', compact = false }: { tone?: 'dark' | 'light'; compact?: boolean }) {
  const { t } = useLang();
  const light = tone === 'light';
  return (
    <a href="#home" className="inline-flex min-h-11 flex-col justify-center leading-none" dir="ltr">
      <span className={`font-display transition-[font-size] ${compact ? 'text-xl' : 'text-2xl'} ${light ? 'text-white' : 'text-brand-900'}`}>
        {t('brand.name')}
      </span>{' '}
      <span className={`mt-0.5 text-[0.65rem] font-bold tracking-[0.32em] uppercase ${light ? 'text-gold-300' : 'text-gold-700'}`}>
        {t('brand.suffix')}
      </span>
      <span className="sr-only">{t('brand.home')}</span>
    </a>
  );
}
