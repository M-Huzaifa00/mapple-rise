import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { developerPartners, districts } from '../../data/spotlight';
import { useLang } from '../../i18n/useLang';
import { useUI } from '../../state/ui';
import { buttonStyles } from '../ui/buttonStyles';
import { Img } from '../ui/Img';

/**
 * Replaces RBS "Smart Facilities". Asymmetric: a narrow text column on the dark band, and a
 * scroll-snap row of district photos that runs off the edge.
 */
export function CscSpotlight() {
  const { t, dir } = useLang();
  const ui = useUI();
  const list = useRef<HTMLUListElement>(null);

  const scroll = (step: 1 | -1) => {
    const el = list.current;
    if (!el) return;
    const card = el.querySelector('li');
    const width = card ? card.getBoundingClientRect().width + 20 : 340;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: step * width * (dir === 'rtl' ? -1 : 1), behavior: reduce ? 'auto' : 'smooth' });
  };
  const arrow = 'inline-flex size-12 items-center justify-center rounded-md border border-white/30 text-white hover:border-gold-300 hover:text-gold-300';

  return (
    <section id="spotlight" aria-labelledby="spotlight-title" className="overflow-hidden bg-brand-950 py-24 text-brand-100 lg:py-32">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <p className="eyebrow text-gold-300">{t('spotlight.eyebrow')}</p>
          <h2 id="spotlight-title" tabIndex={-1} className="h-section mt-3 text-white outline-none">
            {t('spotlight.title')}
          </h2>
          <p className="mt-5 text-lg">{t('spotlight.intro')}</p>

          <dl className="mt-8 border-t border-white/15">
            <dt className="pt-4 text-xs font-bold tracking-[0.18em] text-gold-300 uppercase">{t('spotlight.developedBy')}</dt>
            {developerPartners.map((n) => (
              <dd key={n} className="border-b border-white/15 py-3 font-display text-xl text-white">
                <bdi>{n}</bdi>
              </dd>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => ui.open({ kind: 'quickView', projectId: 'capital-smart-city' })} className={buttonStyles.gold}>
              {t('spotlight.view')}
            </button>
            <button type="button" onClick={() => scroll(-1)} className={arrow} aria-label={t('common.previous')}>
              <ChevronLeft aria-hidden className="size-6 rtl:rotate-180" />
            </button>
            <button type="button" onClick={() => scroll(1)} className={arrow} aria-label={t('common.next')}>
              <ChevronRight aria-hidden className="size-6 rtl:rotate-180" />
            </button>
          </div>
        </div>

        <ul
          ref={list}
          tabIndex={0}
          aria-label={t('spotlight.listLabel')}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-6 sm:px-6 lg:col-span-8 lg:-me-8 lg:ms-0 lg:scroll-px-0 lg:ps-0 lg:pe-8"
        >
          {districts.map((d, i) => (
            <li key={d.id} className={`shrink-0 snap-start ${i === 0 ? 'w-[86%] sm:w-[30rem]' : 'w-[78%] sm:w-[22rem]'}`}>
              <Img image={d.image} alt={t('spotlight.imageAlt', { name: t(`data.districts.${d.id}.name`) })} className="aspect-video w-full rounded-sm" />
              <h3 className="mt-4 text-2xl text-white">{t(`data.districts.${d.id}.name`)}</h3>
              <p className="mt-1 max-w-sm text-brand-100">{t(`data.districts.${d.id}.body`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
