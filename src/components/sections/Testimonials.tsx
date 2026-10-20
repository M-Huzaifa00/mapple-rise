import { reviews } from '../../data/samples';
import { useLang } from '../../i18n/useLang';
import { useUI } from '../../state/ui';
import { SampleChip } from '../ui/Chips';

/** Reviews as a CSS scroll-snap row (no carousel script, no autoplay). All are labelled Sample. */
export function Testimonials() {
  const { t } = useLang();
  const ui = useUI();
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-sand py-16 lg:py-20">
      <div className="container-page">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{t('reviews.eyebrow')}</p>
            <h2 id="reviews-title" className="mt-3 text-3xl sm:text-4xl">
              {t('reviews.title')} <SampleChip className="ms-1" />
            </h2>
          </div>
          <button
            type="button"
            onClick={() => ui.toast(t('common.comingSoon'))}
            className="min-h-11 font-semibold text-brand-800 underline decoration-gold-500 decoration-2 underline-offset-4"
          >
            {t('reviews.readAll')}
          </button>
        </div>
        <ul
          tabIndex={0}
          aria-label={t('reviews.listLabel')}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-1 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0"
        >
          {reviews.map((id) => (
            <li key={id} className="w-[85%] shrink-0 snap-start md:w-auto">
              <figure className="flex h-full flex-col border-t-2 border-brand-800 bg-paper p-6">
                <blockquote className="flex-1">
                  <p className="font-display text-xl leading-snug text-brand-950">{t(`data.reviews.${id}.quote`)}</p>
                </blockquote>
                <figcaption className="mt-5 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
                  {t(`data.reviews.${id}.who`)}
                  <SampleChip />
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
