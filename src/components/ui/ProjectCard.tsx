import { ArrowUpRight, ShieldAlert, ShieldCheck } from 'lucide-react';
import { DEMO_MODE, LAST_VERIFIED } from '../../config';
import { useLang } from '../../i18n/useLang';
import { installmentSummary } from '../../lib/plans';
import { useUI } from '../../state/ui';
import type { ProjectCard as Project } from '../../types';
import { AreaChip } from './AreaChip';
import { buttonStyles } from './buttonStyles';
import { ReviewChip } from './Chips';
import { ContactActions } from './ContactActions';
import { Img } from './Img';
import { ShortlistHeart } from './ShortlistHeart';

const MAX_SIZES = 4;

/** Installment-first card: booking and monthly qist lead; total price is secondary. */
export function ProjectCard({ project: p }: { project: Project }) {
  const { t, money, date } = useLang();
  const { open } = useUI();
  const plan = installmentSummary(p.id);
  const area = t(`data.projects.${p.id}.area`);
  const noc = t(`data.projects.${p.id}.noc`);
  const NocIcon = p.nocStatus === 'approved' ? ShieldCheck : ShieldAlert;
  const extraSizes = p.sizes.length - MAX_SIZES;
  const hasPlan = plan.bookingFrom !== undefined || plan.monthlyFrom !== undefined;
  const label = 'text-xs font-semibold tracking-wide text-ink-mute uppercase';

  return (
    <article className="card-hover flex h-full flex-col overflow-hidden rounded-md border border-line bg-white">
      <div className="relative overflow-hidden">
        <Img image={p.images[0]} alt={t('projects.imageAlt', { name: p.name, area })} className="zoom aspect-[4/3] w-full" />
        <span className="absolute start-3 top-3 rounded-sm bg-white/95 px-2 py-0.5 text-xs font-bold tracking-wide text-brand-900 uppercase">
          {t(`cities.${p.city}`)}
        </span>
        <ShortlistHeart project={p} className="absolute end-2 top-2" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-2xl leading-tight">
          <bdi>{p.name}</bdi>
        </h3>
        <p className="mt-1 text-sm text-ink-mute">
          {p.developer ? t('projects.byLine', { developer: p.developer, area }) : area}
        </p>
        {p.needsReview && (
          <div className="mt-2">
            <ReviewChip note={t(`data.projects.${p.id}.review`)} />
          </div>
        )}

        {hasPlan ? (
          <dl className="mt-4 grid grid-cols-2 gap-x-4 border-y border-line py-3">
            <div>
              <dt className={label}>{t('projects.bookingFrom')}</dt>
              <dd className="tabular text-lg font-bold text-brand-800">
                <bdi>{plan.bookingFrom !== undefined ? money(plan.bookingFrom, 'short') : '—'}</bdi>
              </dd>
            </div>
            <div>
              <dt className={label}>{t('projects.monthlyFrom')}</dt>
              <dd className="tabular text-lg font-bold text-brand-800">
                <bdi>{plan.monthlyFrom ? money(plan.monthlyFrom.amount, 'short') : '—'}</bdi>
                {plan.monthlyFrom && plan.monthlyFrom.basis !== 'monthly' && (
                  <span className="block text-xs font-medium text-ink-mute">{t(`projects.basis.${plan.monthlyFrom.basis}`)}</span>
                )}
              </dd>
            </div>
          </dl>
        ) : (
          <div className="mt-4 border-y border-line py-3">
            <p className={label}>{p.startingPricePKR !== undefined ? t('projects.startingFrom') : t('projects.price')}</p>
            <p className="tabular text-lg font-bold text-brand-800">
              <bdi>{p.startingPricePKR !== undefined ? money(p.startingPricePKR, 'short') : t('projects.priceOnRequest')}</bdi>
            </p>
            <p className="text-xs text-ink-mute">{t('projects.askPlan')}</p>
          </div>
        )}

        <p className="mt-2 text-sm text-ink-mute">
          {hasPlan && p.startingPricePKR !== undefined && (
            <>
              {t('projects.totalFrom', { price: money(p.startingPricePKR, 'short') })}
              <br />
            </>
          )}
          {t('common.lastVerified', { date: date(LAST_VERIFIED) })}
        </p>

        {noc && (
          <p className="mt-3 flex gap-2 text-sm text-ink-soft">
            <NocIcon aria-hidden className={`mt-0.5 size-4 shrink-0 ${p.nocStatus === 'approved' ? 'text-brand-700' : 'text-gold-700'}`} />
            <span>
              <span className="sr-only">{t('projects.nocLabel')}: </span>
              {noc}
            </span>
          </p>
        )}

        <ul aria-label={t('projects.sizesLabel')} className="mt-3 flex flex-wrap gap-1.5">
          {p.sizes.slice(0, MAX_SIZES).map((s) => (
            <li key={s}>
              <AreaChip size={s} sqftPerMarla={p.sqftPerMarla} />
            </li>
          ))}
          {extraSizes > 0 && <li className="inline-flex items-center px-1 text-sm text-ink-mute">{t('projects.moreSizes', { count: extraSizes })}</li>}
        </ul>

        <div className="mt-auto space-y-2 pt-5">
          {DEMO_MODE ? (
            <button type="button" onClick={() => open({ kind: 'quickView', projectId: p.id })} className={`${buttonStyles.outline} w-full`}>
              {t('actions.viewDetails')}
              <span className="sr-only">: {p.name}</span>
            </button>
          ) : (
            <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className={`${buttonStyles.outline} w-full`}>
              {t('actions.viewDetails')}
              <ArrowUpRight aria-hidden className="size-4 rtl:-scale-x-100" />
              <span className="sr-only">: {p.name} {t('common.opensNewTab')}</span>
            </a>
          )}
          <ContactActions size="sm" message={t('wa.project', { name: p.name })} context={p.name} />
        </div>
      </div>
    </article>
  );
}
