import { CircleCheck } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useLang } from '../../i18n/useLang';
import { waLink } from '../../lib/whatsapp';
import { WhatsAppIcon } from './BrandIcons';
import { ButtonLink } from './ButtonLink';

/** Shown after a form is saved. WhatsApp opens only when the user taps the button. */
export function FormSuccess({
  title,
  body,
  waMessage,
  waLabel,
  onReset,
}: {
  title: string;
  body: string;
  waMessage: string;
  waLabel: string;
  onReset: () => void;
}) {
  const { t } = useLang();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);

  return (
    <div className="flex flex-col items-start gap-3 py-4">
      <CircleCheck aria-hidden className="size-10 text-brand-700" />
      <h3 ref={heading} tabIndex={-1} className="text-2xl outline-none">
        {title}
      </h3>
      <p className="text-ink-soft">{body}</p>
      <ButtonLink href={waLink(waMessage)} external className="w-full sm:w-auto">
        <WhatsAppIcon className="size-5" />
        {waLabel}
      </ButtonLink>
      <button type="button" onClick={onReset} className="min-h-11 font-semibold text-brand-800 underline underline-offset-4">
        {t('form.sendAnother')}
      </button>
    </div>
  );
}
