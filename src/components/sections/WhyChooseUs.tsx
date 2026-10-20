import { pillars } from '../../data/howWeWork';
import { useLang } from '../../i18n/useLang';

/** MapleRise's three "Why Choose Us?" pillars as numbered columns (no icon circles, no cards). */
export function WhyChooseUs() {
  const { t } = useLang();
  return (
    <section id="why" aria-labelledby="why-title" className="bg-paper py-16 lg:py-20">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">{t('why.eyebrow')}</p>
            <h2 id="why-title" className="h-section mt-3">
              {t('why.title')}
            </h2>
          </div>
          <ol className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            {pillars.map((id, i) => (
              <li key={id} className="border-t-2 border-brand-800 pt-5">
                <span aria-hidden className="tabular font-display text-3xl text-gold-700">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-2xl leading-tight">{t(`data.pillars.${id}.title`)}</h3>
                <p className="mt-2 text-ink-soft">{t(`data.pillars.${id}.body`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
