import { useId, type ComponentProps, type ReactNode } from 'react';
import { useLang } from '../../i18n/useLang';
import { COUNTRIES, dialFor, formatPhoneInput } from '../../lib/phone';

/** Validation messages are translation keys (errors.*). */
function useErrorText(error?: string): string | undefined {
  const { t } = useLang();
  return error ? t(error) : undefined;
}

interface FieldShell {
  label: string;
  error?: string;
}

export function TextField({ label, error, id, ...input }: FieldShell & ComponentProps<'input'>) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const message = useErrorText(error);
  return (
    <div>
      <label htmlFor={fieldId} className="field-label">
        {label}
      </label>
      <input
        id={fieldId}
        className="field-input"
        aria-invalid={message ? true : undefined}
        aria-describedby={message ? `${fieldId}-err` : undefined}
        {...input}
      />
      {message && (
        <p id={`${fieldId}-err`} className="field-error">
          {message}
        </p>
      )}
    </div>
  );
}

export function SelectField({ label, error, id, children, ...select }: FieldShell & ComponentProps<'select'> & { children: ReactNode }) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const message = useErrorText(error);
  return (
    <div>
      <label htmlFor={fieldId} className="field-label">
        {label}
      </label>
      <select
        id={fieldId}
        className="field-input"
        aria-invalid={message ? true : undefined}
        aria-describedby={message ? `${fieldId}-err` : undefined}
        {...select}
      >
        {children}
      </select>
      {message && (
        <p id={`${fieldId}-err`} className="field-error">
          {message}
        </p>
      )}
    </div>
  );
}

/**
 * Country code + number. Default Pakistan; UAE, KSA, UK, USA, Canada for overseas buyers.
 * Pakistani numbers are formatted as typed (0300-1234567).
 */
export function PhoneField({
  countryProps,
  phoneProps,
  country,
  error,
}: {
  countryProps: ComponentProps<'select'>;
  phoneProps: ComponentProps<'input'>;
  country: string;
  error?: string;
}) {
  const { t } = useLang();
  const id = useId();
  const message = useErrorText(error);
  const { onChange, ...restPhone } = phoneProps;
  return (
    <div>
      <label htmlFor={`${id}-phone`} className="field-label">
        {t('form.phone')}
      </label>
      <div className="flex gap-2" dir="ltr">
        <label htmlFor={`${id}-cc`} className="sr-only">
          {t('form.country')}
        </label>
        <select id={`${id}-cc`} className="field-input w-28 shrink-0 px-2" {...countryProps}>
          {COUNTRIES.map((c) => (
            <option key={c.id} value={c.id}>
              {t(`countries.${c.id}`)} {c.dial}
            </option>
          ))}
        </select>
        <input
          id={`${id}-phone`}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder={t('form.phonePlaceholder')}
          className="field-input tabular"
          aria-invalid={message ? true : undefined}
          aria-describedby={message ? `${id}-err` : undefined}
          onChange={(e) => {
            e.target.value = formatPhoneInput(e.target.value, dialFor(country));
            onChange?.(e);
          }}
          {...restPhone}
        />
      </div>
      {message && (
        <p id={`${id}-err`} className="field-error">
          {message}
        </p>
      )}
    </div>
  );
}

/** Segmented radio group (Morning / Afternoon / Evening, Site visit / Virtual tour). */
export function RadioCards({
  legend,
  options,
  error,
  inputProps,
}: {
  legend: string;
  options: { value: string; label: string }[];
  error?: string;
  inputProps: ComponentProps<'input'>;
}) {
  const id = useId();
  const message = useErrorText(error);
  return (
    <fieldset aria-describedby={message ? `${id}-err` : undefined}>
      <legend className="field-label">{legend}</legend>
      <div className={`grid gap-2 ${options.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {options.map((o) => (
          <label
            key={o.value}
            className="flex min-h-12 cursor-pointer items-center justify-center rounded-md border border-line bg-white px-2 text-center text-[0.95rem] font-semibold text-ink-soft has-checked:border-brand-800 has-checked:bg-brand-800 has-checked:text-white has-focus-visible:ring-2 has-focus-visible:ring-gold-500"
          >
            <input type="radio" value={o.value} className="sr-only" {...inputProps} />
            {o.label}
          </label>
        ))}
      </div>
      {message && (
        <p id={`${id}-err`} className="field-error">
          {message}
        </p>
      )}
    </fieldset>
  );
}

/** Off-screen honeypot. Real users never focus or fill it. */
export function Honeypot(props: ComponentProps<'input'>) {
  const { t } = useLang();
  return (
    <div aria-hidden className="pointer-events-none absolute top-0 size-px overflow-hidden opacity-0 [clip-path:inset(50%)]">
      <label>
        {t('form.honeypot')}
        <input type="text" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  );
}
