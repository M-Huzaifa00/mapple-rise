import { useId } from 'react';
import { useLang } from '../../i18n/useLang';
import type { PlanInputs } from '../../lib/calculator';

function NumberField({ label, value, onChange, hint }: { label: string; value: number; onChange: (n: number) => void; hint?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        step={1}
        placeholder="0"
        value={value === 0 ? '' : value}
        onChange={(e) => onChange(Number.isFinite(e.target.valueAsNumber) ? e.target.valueAsNumber : 0)}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="field-input tabular"
        dir="ltr"
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-ink-mute">
          <bdi className="tabular">{hint}</bdi>
        </p>
      )}
    </div>
  );
}

const GROUPS = ['monthly', 'halfYearly', 'quarterly'] as const;

/** Editable plan values. Every field starts from the developer's plan. */
export function PlanEditor({ inputs, onChange }: { inputs: PlanInputs; onChange: (next: PlanInputs) => void }) {
  const { t, money } = useLang();
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label={t('calc.rows.booking')}
          value={inputs.bookingPKR}
          hint={money(inputs.bookingPKR)}
          onChange={(bookingPKR) => onChange({ ...inputs, bookingPKR })}
        />
        <NumberField
          label={t('calc.rows.confirmation')}
          value={inputs.confirmationPKR}
          hint={money(inputs.confirmationPKR)}
          onChange={(confirmationPKR) => onChange({ ...inputs, confirmationPKR })}
        />
      </div>

      {GROUPS.map((key) => (
        <fieldset key={key} className="border-t border-line pt-4">
          <legend className="pe-2 font-semibold text-brand-950">{t(`calc.rows.${key}`)}</legend>
          <div className="mt-2 grid grid-cols-[7rem_minmax(0,1fr)] gap-3">
            <NumberField label={t('calc.count')} value={inputs[key].count} onChange={(count) => onChange({ ...inputs, [key]: { ...inputs[key], count } })} />
            <NumberField
              label={t('calc.amount')}
              value={inputs[key].amountPKR}
              hint={money(inputs[key].amountPKR)}
              onChange={(amountPKR) => onChange({ ...inputs, [key]: { ...inputs[key], amountPKR } })}
            />
          </div>
        </fieldset>
      ))}

      {inputs.other.length > 0 && (
        <ul className="space-y-1 border-t border-line pt-4 text-[0.95rem]">
          {inputs.other.map((o) => (
            <li key={o.kind} className="flex justify-between gap-4">
              <span>
                {t(`calc.rows.${o.kind}`)}
                {o.count && o.count > 1 ? ` × ${o.count}` : ''}
              </span>
              <bdi className="tabular font-semibold">{money(o.amountPKR)}</bdi>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
