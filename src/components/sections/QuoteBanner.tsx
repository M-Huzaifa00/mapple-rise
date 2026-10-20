import { useLang } from '../../i18n/useLang';
import { ContactActions } from '../ui/ContactActions';

/** Full-width dark quote band (RBS pattern) with an original line, left-aligned, and contact actions. */
export function QuoteBanner() {
  const { t } = useLang();
  return (
    <section aria-labelledby="quote-label" className="bg-brand-900 py-20 lg:py-28">
      <div className="container-page grid gap-10 lg:grid-cols-12 lg:items-end">
        <figure className="lg:col-span-8">
          <p id="quote-label" className="eyebrow text-gold-300">
            {t('quote.label')}
          </p>
          <blockquote className="mt-5 border-s-2 border-gold-500 ps-6">
            <p className="font-display text-4xl leading-[1.12] text-white sm:text-5xl lg:text-6xl">{t('quote.text')}</p>
          </blockquote>
        </figure>
        <div className="lg:col-span-4">
          <p className="text-lg text-brand-100">{t('quote.cta')}</p>
          <ContactActions tone="dark" message={t('wa.general')} className="mt-5" />
        </div>
      </div>
    </section>
  );
}
