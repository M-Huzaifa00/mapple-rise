import { Phone, Plane } from 'lucide-react';
import { IMAGES } from '../../assets/images/manifest';
import { useLang } from '../../i18n/useLang';
import type { ProjectFilters } from '../../lib/filters';
import { telHref, waLink } from '../../lib/whatsapp';
import { useUI } from '../../state/ui';
import { WhatsAppIcon } from '../ui/BrandIcons';
import { ButtonLink } from '../ui/ButtonLink';
import { OnlineStatus } from '../ui/OfficeStatus';
import { HeroSearch } from './HeroSearch';
import { LeadForm } from './LeadForm';

const hero = IMAGES['site/hero'];

/**
 * RBS hero + lead form, plus the portal-style search. Phones get a portrait crop behind the
 * headline only; the search and form sit on paper below it. The LCP image is preloaded by the
 * prerender step (data-lcp).
 */
export function Hero({ onSearch }: { onSearch: (f: ProjectFilters) => void }) {
  const { t } = useLang();
  const ui = useUI();

  return (
    <section id="home" aria-labelledby="hero-title" className="relative isolate bg-paper lg:bg-brand-950">
      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] overflow-hidden bg-brand-950 sm:h-[36rem] lg:h-full">
        <picture>
          <source
            data-lcp
            media="(max-width: 767px)"
            srcSet={`${hero.m480.src} 480w, ${hero.m720.src} 578w`}
            sizes="100vw"
          />
          <img
            data-lcp
            src={hero.w1280.src}
            srcSet={`${hero.w800.src} 800w, ${hero.w1280.src} 1280w, ${hero.w1440.src} 1440w`}
            sizes="100vw"
            width={hero.w1440.width}
            height={hero.w1440.height}
            alt={t('hero.imageAlt')}
            fetchPriority="high"
            className="size-full object-cover"
            style={{ backgroundImage: `url(${hero.blur})`, backgroundSize: 'cover' }}
          />
        </picture>
        {/* The only gradient on the site: a dark overlay so white text stays readable on the photo. */}
        <div aria-hidden className="absolute inset-0 bg-brand-950/60 lg:bg-linear-to-r lg:from-brand-950/90 lg:via-brand-950/60 lg:to-brand-950/15" />
      </div>

      <div className="container-page grid gap-8 pb-12 lg:grid-cols-[minmax(0,1fr)_23.5rem] lg:gap-x-14 lg:pt-20 lg:pb-14">
        <div className="flex min-h-[34rem] flex-col justify-end pt-20 pb-10 text-white sm:min-h-[36rem] lg:min-h-0 lg:justify-start lg:pt-6 lg:pb-0">
          <p className="eyebrow text-gold-300">{t('hero.eyebrow')}</p>
          <h1 id="hero-title" className="mt-4 text-[2.75rem] leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            {t('hero.title')}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-brand-50">{t('hero.body')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={waLink(t('wa.general'))} external variant="gold">
              <WhatsAppIcon className="size-5" />
              {t('actions.whatsappUs')}
            </ButtonLink>
            <ButtonLink href={telHref} variant="outlineLight">
              <Phone aria-hidden className="size-5" />
              {t('actions.call')}
            </ButtonLink>
          </div>
          <OnlineStatus tone="dark" className="mt-3" />
          <button
            type="button"
            onClick={() => ui.open({ kind: 'overseas' })}
            className="mt-6 inline-flex min-h-11 items-center gap-2 self-start rounded-sm border border-white/40 px-3 text-[0.95rem] font-semibold text-white hover:border-gold-300 hover:text-gold-300"
          >
            <Plane aria-hidden className="size-4 text-gold-300 rtl:-scale-x-100" />
            {t('hero.overseas')}
          </button>
        </div>

        <div className="order-3 lg:order-none lg:row-span-2 lg:self-end">
          <LeadForm />
        </div>

        <div className="order-2 lg:order-none">
          <HeroSearch onSearch={onSearch} />
        </div>
      </div>
    </section>
  );
}
