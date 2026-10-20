import { RotateCcw, TriangleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { paymentPlans } from '../../data/paymentPlans';
import { projectById } from '../../data/projects';
import { useLang } from '../../i18n/useLang';
import { toInputs, type PlanInputs } from '../../lib/calculator';
import type { PKRFormat } from '../../lib/currency';
import { useUI } from '../../state/ui';
import { SelectField } from '../ui/FormFields';
import { SectionHeading } from '../ui/SectionHeading';
import { AffordPanel } from './AffordPanel';
import { PlanBreakdown } from './PlanBreakdown';
import { PlanEditor } from './PlanEditor';

const byProject = [...new Set(paymentPlans.map((p) => p.projectId))].map((projectId) => ({
  projectId,
  plans: paymentPlans.filter((p) => p.projectId === projectId),
}));

type Tab = 'breakdown' | 'afford';

/** Installment calculator: the key upgrade over RBS's static "Payment Plan" page. */
export function PaymentPlans() {
  const { t, money, size } = useLang();
  const { calcRequest } = useUI();
  const [tab, setTab] = useState<Tab>('breakdown');
  const [format, setFormat] = useState<PKRFormat>('full');
  const [planId, setPlanId] = useState(paymentPlans[0].id);
  const plan = paymentPlans.find((p) => p.id === planId) ?? paymentPlans[0];
  const [inputs, setInputs] = useState<PlanInputs>(() => toInputs(plan));

  const choose = (id: string) => {
    const next = paymentPlans.find((p) => p.id === id) ?? paymentPlans[0];
    setPlanId(next.id);
    setInputs(toInputs(next));
    setTab('breakdown');
  };

  // "Calculate installments" from a Quick View preselects that project's plan.
  useEffect(() => {
    if (!calcRequest) return;
    const next = paymentPlans.find((p) => p.id === calcRequest.planId);
    if (!next) return;
    /* eslint-disable react-hooks/set-state-in-effect -- applying an external request */
    setPlanId(next.id);
    setInputs(toInputs(next));
    setTab('breakdown');
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [calcRequest]);

  const tabBtn = (id: Tab) =>
    `-mb-px min-h-11 border-b-2 px-1 font-semibold transition-colors ${
      tab === id ? 'border-brand-800 text-brand-950' : 'border-transparent text-ink-mute hover:text-brand-800'
    }`;

  return (
    <section id="payment-plans" aria-labelledby="calc-title" className="bg-sand py-20 lg:py-24">
      <div className="container-page">
        <SectionHeading id="calc-title" layout="split" eyebrow={t('calc.eyebrow')} title={t('calc.title')} intro={t('calc.intro')} />

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-line">
          <div role="tablist" aria-label={t('calc.title')} className="flex gap-6">
            {(['breakdown', 'afford'] as const).map((id) => (
              <button
                key={id}
                id={`calc-tab-${id}`}
                type="button"
                role="tab"
                aria-selected={tab === id}
                aria-controls={`calc-panel-${id}`}
                onClick={() => setTab(id)}
                className={tabBtn(id)}
              >
                {t(`calc.tabs.${id}`)}
              </button>
            ))}
          </div>
          <div role="group" aria-label={t('calc.format.label')} className="mb-2 inline-flex rounded-md border border-line bg-white p-0.5">
            {(['short', 'full'] as const).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={format === f}
                onClick={() => setFormat(f)}
                className={`min-h-10 rounded-[5px] px-3 text-sm font-semibold ${format === f ? 'bg-brand-800 text-white' : 'text-ink-soft hover:text-brand-800'}`}
              >
                {t(`calc.format.${f}`)}
              </button>
            ))}
          </div>
        </div>

        {tab === 'afford' ? (
          <div id="calc-panel-afford" role="tabpanel" aria-labelledby="calc-tab-afford">
            <AffordPanel format={format} onUse={choose} />
          </div>
        ) : (
          <div
            id="calc-panel-breakdown"
            role="tabpanel"
            aria-labelledby="calc-tab-breakdown"
            className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10"
          >
            <div className="space-y-5 rounded-md border border-line bg-white p-5 sm:p-6">
              <SelectField label={t('calc.plan')} value={planId} onChange={(e) => choose(e.target.value)}>
                {byProject.map(({ projectId, plans }) => (
                  <optgroup key={projectId} label={projectById(projectId)?.name ?? projectId}>
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {t('calc.option', { label: t(`data.plans.${p.id}.label`), size: size(p.size) })}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </SelectField>

              <div className="text-[0.95rem] text-ink-soft">
                <p>
                  {t('calc.listed')}: <bdi className="tabular font-semibold text-brand-950">{money(plan.totalPKR, format)}</bdi>
                </p>
                {plan.hasNote && <p className="mt-1">{t(`data.plans.${plan.id}.note`)}</p>}
                {plan.needsReview && (
                  <p role="note" className="mt-3 flex gap-2 rounded-sm border border-gold-500/50 bg-gold-50 p-3 text-gold-700">
                    <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
                    <span>
                      <strong>{t('common.underReview')}:</strong> {t(`data.plans.${plan.id}.review`)}
                    </span>
                  </p>
                )}
              </div>

              <PlanEditor inputs={inputs} onChange={setInputs} />

              <button
                type="button"
                onClick={() => setInputs(toInputs(plan))}
                className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand-800 underline-offset-4 hover:underline"
              >
                <RotateCcw aria-hidden className="size-4 rtl:-scale-x-100" />
                {t('calc.reset')}
              </button>
            </div>

            <div className="lg:sticky lg:top-20">
              <PlanBreakdown plan={plan} inputs={inputs} format={format} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
