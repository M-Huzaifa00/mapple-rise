import { Copy, TriangleAlert } from 'lucide-react';
import { projectById } from '../../data/projects';
import { useLang } from '../../i18n/useLang';
import { TOLERANCE_PKR, breakdown, type BreakdownRow, type PlanInputs, type RowKey } from '../../lib/calculator';
import type { PKRFormat } from '../../lib/currency';
import { useUI } from '../../state/ui';
import type { PaymentPlan } from '../../types';
import { ContactActions } from '../ui/ContactActions';

// One accent colour (gold) plus brand-green shades and a neutral; no gradients.
const COLOR: Record<RowKey, string> = {
  booking: 'bg-brand-800',
  confirmation: 'bg-brand-600',
  monthly: 'bg-gold-500',
  halfYearly: 'bg-gold-300',
  quarterly: 'bg-brand-200',
  possession: 'bg-ink-mute',
  plotSelection: 'bg-line',
  balloon: 'bg-gold-700',
  finalQuarter: 'bg-brand-100',
};

/** Breakdown table + stacked bar + copy / WhatsApp hand-off. */
export function PlanBreakdown({ plan, inputs, format }: { plan: PaymentPlan; inputs: PlanInputs; format: PKRFormat }) {
  const { t, money, size, date } = useLang();
  const { toast } = useUI();
  const { rows, totalPKR } = breakdown(inputs);
  const diff = totalPKR - plan.totalPKR;
  const projectName = projectById(plan.projectId)?.name ?? plan.project;
  const title = t('calc.planTitle', { project: projectName, label: t(`data.plans.${plan.id}.label`), size: size(plan.size) });
  const amount = (n: number) => money(n, format);
  const rowText = (r: BreakdownRow) =>
    r.count > 1 ? t('calc.times', { count: r.count, amount: amount(r.amountPKR) }) : amount(r.subtotalPKR);

  const text = [
    title,
    ...rows.map((r) => `• ${t(`calc.rows.${r.key}`)}: ${rowText(r)}`),
    `${t('calc.total')}: ${amount(totalPKR)}`,
    t('calc.disclaimer', { date: date(plan.lastVerified) }),
  ].join('\n');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast(t('calc.copied'));
    } catch {
      toast(t('common.copyFailed'));
    }
  };

  return (
    <div className="rounded-md border border-line bg-white p-5 sm:p-6">
      <h3 className="text-2xl">{t('calc.breakdown')}</h3>
      <p className="mt-1 text-sm text-ink-mute">
        <bdi>{title}</bdi>
      </p>

      <div aria-hidden className="mt-5 flex h-3 w-full overflow-hidden rounded-sm bg-sand">
        {rows.map((r, i) => (
          <div key={`${r.key}-${i}`} className={`${COLOR[r.key]} h-full`} style={{ width: `${totalPKR ? (r.subtotalPKR / totalPKR) * 100 : 0}%` }} />
        ))}
      </div>

      <table className="mt-5 w-full text-start">
        <caption className="sr-only">{title}</caption>
        <tbody className="divide-y divide-line">
          {rows.map((r, i) => (
            <tr key={`${r.key}-${i}`}>
              <th scope="row" className="py-2.5 pe-3 text-start font-medium text-ink">
                <span aria-hidden className={`me-2 inline-block size-2.5 rounded-sm align-middle ${COLOR[r.key]}`} />
                {t(`calc.rows.${r.key}`)}
                {r.count > 1 && (
                  <span className="block ps-[1.125rem] text-sm font-normal text-ink-mute">
                    <bdi className="tabular">{t('calc.times', { count: r.count, amount: amount(r.amountPKR) })}</bdi>
                  </span>
                )}
              </th>
              <td className="py-2.5 text-end font-semibold whitespace-nowrap text-brand-950">
                <bdi className="tabular">{amount(r.subtotalPKR)}</bdi>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-brand-800">
            <th scope="row" className="pt-3 text-start text-lg font-bold text-brand-950">
              {t('calc.total')}
            </th>
            <td className="pt-3 text-end text-xl font-bold whitespace-nowrap text-brand-950">
              <bdi className="tabular">{amount(totalPKR)}</bdi>
            </td>
          </tr>
          <tr>
            <th scope="row" className="pt-1 text-start text-sm font-normal text-ink-mute">
              {t('calc.listed')}
            </th>
            <td className="pt-1 text-end text-sm whitespace-nowrap text-ink-mute">
              <bdi className="tabular">{amount(plan.totalPKR)}</bdi>
            </td>
          </tr>
        </tfoot>
      </table>

      {Math.abs(diff) > TOLERANCE_PKR && (
        <p className="mt-3 flex gap-2 rounded-sm border border-gold-500/50 bg-gold-50 p-3 text-sm text-gold-700">
          <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {t('calc.differs', { amount: money(Math.abs(diff)) })}
        </p>
      )}

      <div className="mt-5 space-y-2">
        <ContactActions message={`${t('wa.planIntro')}\n${text}`} />
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-line font-semibold text-brand-900 hover:border-brand-700"
        >
          <Copy aria-hidden className="size-5" />
          {t('calc.copy')}
        </button>
      </div>

      <p className="mt-4 text-sm text-ink-mute">{t('calc.disclaimer', { date: date(plan.lastVerified) })}</p>
    </div>
  );
}
