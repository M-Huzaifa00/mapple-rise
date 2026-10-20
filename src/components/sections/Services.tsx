import { services } from '../../data/services';
import { useLang } from '../../i18n/useLang';
import { waLink } from '../../lib/whatsapp';
import { goToSection } from '../../state/ui';
import { WhatsAppIcon } from '../ui/BrandIcons';
import { buttonStyles } from '../ui/buttonStyles';
import { iconFor } from '../ui/icons';

/** Editorial list: sticky intro on the left, the 7 services as hairline rows on the right. */
export function Services() {
  const { t } = useLang();
  return (
    <section id="services" aria-labelledby="services-title" className="bg-white py-20 lg:py-24">
      <div className="container-page grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <p className="eyebrow">{t('services.eyebrow')}</p>
            <h2 id="services-title" tabIndex={-1} className="h-section mt-3 outline-none">
              {t('services.title')}
            </h2>
            <p className="mt-5 text-lg text-ink-soft">{t('services.intro')}</p>
            <button type="button" onClick={() => goToSection('contact', 'contact-title')} className={`${buttonStyles.primary} mt-8`}>
              {t('actions.freeConsultation')}
            </button>
          </div>
        </div>

        <ul className="divide-y divide-line border-y border-line lg:col-span-8">
          {services.map((s) => {
            const Icon = iconFor(s.icon);
            const title = t(`data.services.${s.id}.title`);
            return (
              <li key={s.id} className="grid gap-x-8 gap-y-2 py-6 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
                <h3 className="flex items-start gap-3 text-2xl leading-tight">
                  <Icon aria-hidden className="mt-1 size-5 shrink-0 text-gold-700" />
                  {title}
                </h3>
                <div>
                  <p className="text-ink-soft">{t(`data.services.${s.id}.body`)}</p>
                  <a
                    href={waLink(t('wa.service', { service: title }))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex min-h-11 items-center gap-2 font-semibold text-brand-800 underline decoration-gold-500 decoration-2 underline-offset-4 hover:text-brand-600"
                  >
                    <WhatsAppIcon className="size-4" />
                    {t('services.ask')}
                    <span className="sr-only">: {title}</span>
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
