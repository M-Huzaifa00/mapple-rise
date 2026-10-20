import { Clock, Mail, MapPin, Navigation } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MAPS_DIRECTIONS_URL, MAPS_EMBED_URL, OFFICE } from '../../config';
import { company } from '../../data/company';
import { useLang } from '../../i18n/useLang';
import { mailHref, waLink } from '../../lib/whatsapp';
import { useUI } from '../../state/ui';
import { WhatsAppIcon } from '../ui/BrandIcons';
import { ButtonLink } from '../ui/ButtonLink';
import { SampleChip } from '../ui/Chips';
import { CopyPhone } from '../ui/CopyPhone';
import { Img } from '../ui/Img';
import { OfficeClock, OnlineStatus } from '../ui/OfficeStatus';
import { CallBackForm } from './CallBackForm';
import { VisitForm } from './VisitForm';

type Tab = 'callback' | 'visit';

/** RBS "Request a call back" banner + form, with a "Visit our office" block and site-visit booking. */
export function Contact() {
  const { t } = useLang();
  const { visitRequest } = useUI();
  const [tab, setTab] = useState<Tab>('callback');
  const [map, setMap] = useState(false);

  // Overseas panel / Quick View ask for the visit form.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- applying an external request
    if (visitRequest) setTab('visit');
  }, [visitRequest]);

  const row = 'flex items-start gap-3';
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-paper py-20 lg:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-10">
        <aside aria-labelledby="visit-title" className="lg:col-span-5">
          {map ? (
            <iframe
              title={t('contact.mapTitle')}
              src={MAPS_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full rounded-md border border-line"
            />
          ) : (
            <Img image="site/visit" alt={t('contact.visitImageAlt')} className="aspect-[4/3] w-full rounded-md" />
          )}
          <h3 id="visit-title" className="mt-6 text-3xl">
            {t('contact.visitTitle')}
          </h3>
          <ul className="mt-4 space-y-3">
            <li className={row}>
              <MapPin aria-hidden className="mt-1 size-5 shrink-0 text-gold-700" />
              <span>
                {t('contact.addressValue')} {!OFFICE.addressConfirmed && <SampleChip />}
              </span>
            </li>
            <li className={row}>
              <Clock aria-hidden className="mt-1 size-5 shrink-0 text-gold-700" />
              <span>
                {t('contact.hoursValue')} {!OFFICE.hoursConfirmed && <SampleChip />}
                <OfficeClock className="block text-sm text-ink-mute" />
              </span>
            </li>
            <li className={row}>
              <Mail aria-hidden className="mt-3 size-5 shrink-0 text-gold-700" />
              <a href={mailHref} className="inline-flex min-h-11 items-center font-semibold text-brand-900 hover:text-brand-600">
                <bdi dir="ltr">{company.email}</bdi>
              </a>
            </li>
          </ul>
          <CopyPhone className="mt-1" />
          <OnlineStatus className="mt-1" />
          <div className="mt-5 grid grid-cols-2 gap-2">
            <ButtonLink href={MAPS_DIRECTIONS_URL} external variant="outline">
              <Navigation aria-hidden className="size-5 rtl:-scale-x-100" />
              {t('contact.directions')}
            </ButtonLink>
            <ButtonLink href={waLink(t('wa.general'))} external>
              <WhatsAppIcon className="size-5" />
              {t('actions.whatsapp')}
            </ButtonLink>
          </div>
          {!map && (
            <button
              type="button"
              onClick={() => setMap(true)}
              className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-brand-800 underline decoration-gold-500 decoration-2 underline-offset-4"
            >
              {t('contact.showMap')}
            </button>
          )}
        </aside>

        <div className="lg:col-span-7 lg:border-s lg:border-line lg:ps-10">
          <p className="eyebrow">{t('contact.eyebrow')}</p>
          <h2 id="contact-title" tabIndex={-1} className="h-section mt-3 outline-none">
            {t('contact.title')}
          </h2>
          <p className="mt-4 max-w-xl text-lg text-ink-soft">{t('contact.intro')}</p>

          <div role="tablist" aria-label={t('contact.title')} className="mt-8 flex gap-6 border-b border-line">
            {(['callback', 'visit'] as const).map((id) => (
              <button
                key={id}
                id={`contact-tab-${id}`}
                type="button"
                role="tab"
                aria-selected={tab === id}
                aria-controls={`contact-panel-${id}`}
                onClick={() => setTab(id)}
                className={`-mb-px min-h-12 border-b-2 font-semibold transition-colors ${
                  tab === id ? 'border-brand-800 text-brand-950' : 'border-transparent text-ink-mute hover:text-brand-800'
                }`}
              >
                {t(`contact.tabs.${id}`)}
              </button>
            ))}
          </div>
          <div id={`contact-panel-${tab}`} role="tabpanel" aria-labelledby={`contact-tab-${tab}`} className="pt-6">
            {tab === 'callback' ? <CallBackForm /> : <VisitForm preset={visitRequest} />}
          </div>
        </div>
      </div>
    </section>
  );
}
