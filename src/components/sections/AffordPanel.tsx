import { useId, useMemo, useState } from 'react';
import { paymentPlans } from '../../data/paymentPlans';
import { projectById } from '../../data/projects';
import { useLang } from '../../i18n/useLang';
import type { PKRFormat } from '../../lib/currency';
import { monthlyEquivalent } from '../../lib/plans';
import { ReviewChip } from '../ui/Chips';

/** "Can I afford it?": enter a monthly budget, see which published plans fit. */
export function AffordPanel({ format, onUse }: { format: PKRFormat; onUse: (planId: string) => void }) {
  const { t, money, size } = useLang();
  const id = useId();
  const [budget, setBudget] = useState(50_000);

  const fits = useMemo(
    () =>
      paymentPlans
        .map((plan) => ({ plan, m: monthlyEquivalent(plan) }))
        .filter((x): x is { plan: (typeof paymentPlans)[number]; m: NonNullable<ReturnType<typeof monthlyEquivalent>> } => x.m !== null && x.m.amount <= budget)
        .sort((a, b) => a.m.amount - b.m.amount),
    [budget],
  );

  return (
    <div className="rounded-md border border-line bg-white p-5 sm:p-6">
      <label htmlFor={id} className="field-label">
        {t('calc.afford.label')}
      </label>
      <div className="flex max-w-md items-center gap-3">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={0}
          step={5000}
          value={budget || ''}
          onChange={(e) => setBudget(Number.isFinite(e.target.valueAsNumber) ? e.target.valueAsNumber : 0)}
          className="field-input tabular"
          dir="ltr"
        />
        <bdi className="tabular shrink-0 text-ink-mute">{money(budget, format)}</bdi>
      </div>
      <p className="mt-2 text-sm text-ink-mute">{t('calc.afford.hint')}</p>

      <p aria-live="polite" className="mt-6 font-semibold text-brand-950">
        {t('calc.afford.results', { count: fits.length })}
      </p>
      {fits.length === 0 ? (
        <p className="mt-2 text-ink-soft">{t('calc.afford.none')}</p>
      ) : (
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {fits.map(({ plan, m }) => (
            <li key={plan.id} className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div>
                <p className="font-semibold text-brand-950">
                  <bdi>{projectById(plan.projectId)?.name}</bdi>
                  <span className="font-normal text-ink-soft"> · {t(`data.plans.${plan.id}.label`)}</span>
                </p>
                <p className="mt-1 text-[0.95rem] text-ink-soft">
                  <bdi className="tabular">{size(plan.size)}</bdi>
                  {' · '}
                  {t('calc.afford.monthly')}: <bdi className="tabular font-semibold text-brand-800">{money(m.amount, format)}</bdi>
                  {m.basis !== 'monthly' && <> ({t(`projects.basis.${m.basis}`)})</>}
                  {plan.bookingPKR !== undefined && (
                    <>
                      {' · '}
                      {t('calc.afford.booking')}: <bdi className="tabular">{money(plan.bookingPKR, format)}</bdi>
                    </>
                  )}
                </p>
                {plan.needsReview && (
                  <div className="mt-1">
                    <ReviewChip note={t(`data.plans.${plan.id}.review`)} />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => onUse(plan.id)}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-brand-800 px-4 font-semibold text-brand-800 hover:bg-brand-50"
              >
                {t('calc.afford.use')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
