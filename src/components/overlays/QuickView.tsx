import { Calculator, CalendarDays, ChevronLeft, ChevronRight, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useRef, useState, type ReactNode } from 'react';
import { LAST_VERIFIED } from '../../config';
import { projectById } from '../../data/projects';
import { useLang } from '../../i18n/useLang';
import { installmentSummary } from '../../lib/plans';
import { goToSection, useUI } from '../../state/ui';
import { AreaChip } from '../ui/AreaChip';
import { buttonStyles } from '../ui/buttonStyles';
import { ReviewChip } from '../ui/Chips';
import { ContactActions } from '../ui/ContactActions';
import { Img } from '../ui/Img';
import { ShortlistHeart } from '../ui/ShortlistHeart';
import { OverlayHeader } from './OverlayHeader';

/** In-page project details (DEMO_MODE replacement for the live project page). */
export function QuickView({ projectId }: { projectId: string }) {
  const { t, money, date, dir } = useLang();
  const ui = useUI();
  const gallery = useRef<HTMLUListElement>(null);
  const [slide, setSlide] = useState(0);
  const p = projectById(projectId);
  if (!p) return null;

  const plan = installmentSummary(p.id);
  const area = t(`data.projects.${p.id}.area`);
  const noc = t(`data.projects.${p.id}.noc`);
  const raw: unknown = t(`data.projects.${p.id}.highlights`, { returnObjects: true });
  const highlights = Array.isArray(raw) ? (raw as string[]) : [];
  const NocIcon = p.nocStatus === 'approved' ? ShieldCheck : ShieldAlert;

  const go = (i: number) => {
    const el = gallery.current;
    if (!el) return;
    const next = Math.max(0, Math.min(p.images.length - 1, i));
    el.scrollTo({ left: next * el.clientWidth * (dir === 'rtl' ? -1 : 1), behavior: 'smooth' });
    setSlide(next);
  };

  const calculate = () => {
    const first = plan.plans[0];
    if (!first) return;
    ui.close({ restoreFocus: false });
    ui.requestPlan(first.id);
    window.setTimeout(() => goToSection('payment-plans', 'calc-title'), 60);
  };
  const bookVisit = () => {
    ui.close({ restoreFocus: false });
    ui.requestVisit('site', p.id);
    window.setTimeout(() => goToSection('contact', 'contact-title'), 60);
  };

  const fact = (label: string, value: ReactNode) => (
    <div className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-3 py-2.5">
      <dt className="text-sm text-ink-mute">{label}</dt>
      <dd className="font-semibold text-brand-950">{value}</dd>
    </div>
  );

  return (
    <article>
      <OverlayHeader
        id="qv-title"
        title={<bdi>{p.name}</bdi>}
        sub={`${t(`cities.${p.city}`)}${area ? ` · ${area}` : ''}`}
        onClose={() => ui.close()}
      />

      <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div>
          <div className="relative">
            <ul
              ref={gallery}
              aria-label={t('quickView.gallery', { name: p.name })}
              onScroll={(e) => setSlide(Math.round(Math.abs(e.currentTarget.scrollLeft) / e.currentTarget.clientWidth))}
              className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-md"
            >
              {p.images.map((img, i) => (
                <li key={img} className="w-full shrink-0 snap-start">
                  <Img
                    image={img}
                    large
                    sizes="(min-width: 768px) 520px, 100vw"
                    alt={t('quickView.photo', { name: p.name, current: i + 1, total: p.images.length })}
                    className="aspect-[4/3] w-full"
                    eager={i === 0}
                  />
                </li>
              ))}
            </ul>
            {p.images.length > 1 && (
              <div className="mt-2 flex items-center justify-between">
                <span className="tabular text-sm text-ink-mute" aria-live="polite">
                  {t('quickView.counter', { current: slide + 1, total: p.images.length })}
                </span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => go(slide - 1)} disabled={slide === 0} aria-label={t('common.previous')} className="inline-flex size-11 items-center justify-center rounded-md border border-line disabled:opacity-40">
                    <ChevronLeft aria-hidden className="size-5 rtl:rotate-180" />
                  </button>
                  <button type="button" onClick={() => go(slide + 1)} disabled={slide === p.images.length - 1} aria-label={t('common.next')} className="inline-flex size-11 items-center justify-center rounded-md border border-line disabled:opacity-40">
                    <ChevronRight aria-hidden className="size-5 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {highlights.length > 0 && (
            <>
              <h3 className="mt-6 text-xl">{t('quickView.highlights')}</h3>
              <ul className="mt-2 space-y-2">
                {highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-ink-soft">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 bg-gold-500" />
                    {h}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div>
          {p.needsReview && (
            <div className="mb-3">
              <ReviewChip note={t(`data.projects.${p.id}.review`)} />
              <p className="mt-2 text-sm text-ink-soft">{t(`data.projects.${p.id}.review`)}</p>
            </div>
          )}
          <dl className="divide-y divide-line border-y border-line">
            {plan.bookingFrom !== undefined && fact(t('projects.bookingFrom'), <bdi className="tabular">{money(plan.bookingFrom, 'short')}</bdi>)}
            {plan.monthlyFrom &&
              fact(
                t('projects.monthlyFrom'),
                <>
                  <bdi className="tabular">{money(plan.monthlyFrom.amount, 'short')}</bdi>
                  {plan.monthlyFrom.basis !== 'monthly' && (
                    <span className="block text-sm font-normal text-ink-mute">{t(`projects.basis.${plan.monthlyFrom.basis}`)}</span>
                  )}
                </>,
              )}
            {fact(
              t('projects.startingFrom'),
              p.startingPricePKR !== undefined ? <bdi className="tabular">{money(p.startingPricePKR, 'short')}</bdi> : t('projects.priceOnRequest'),
            )}
            <div className="py-2.5 text-sm text-ink-mute">{t(`data.projects.${p.id}.priceNote`)}</div>
            {p.developer && fact(t('quickView.developer'), <bdi>{p.developer}</bdi>)}
            {fact(
              t('quickView.sizes'),
              <span className="flex flex-wrap gap-1.5">
                {p.sizes.map((s) => (
                  <AreaChip key={s} size={s} sqftPerMarla={p.sqftPerMarla} />
                ))}
              </span>,
            )}
            {noc &&
              fact(
                t('projects.nocLabel'),
                <span className="flex gap-2 font-normal text-ink-soft">
                  <NocIcon aria-hidden className={`mt-1 size-4 shrink-0 ${p.nocStatus === 'approved' ? 'text-brand-700' : 'text-gold-700'}`} />
                  {noc}
                </span>,
              )}
          </dl>
          <p className="mt-2 text-sm text-ink-mute">{t('common.lastVerified', { date: date(LAST_VERIFIED) })}</p>

          <div className="mt-5 space-y-2">
            {plan.plans.length > 0 ? (
              <button type="button" onClick={calculate} className={`${buttonStyles.primary} w-full`}>
                <Calculator aria-hidden className="size-5" />
                {t('quickView.calculate')}
              </button>
            ) : (
              <p className="text-sm text-ink-soft">{t('quickView.noPlan')}</p>
            )}
            <ContactActions message={t('wa.project', { name: p.name })} context={p.name} />
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={bookVisit} className={`${buttonStyles.outline} px-3`}>
                <CalendarDays aria-hidden className="size-5" />
                {t('quickView.bookVisit')}
              </button>
              <ShortlistHeart project={p} withLabel />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
