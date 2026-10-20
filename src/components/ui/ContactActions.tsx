import { Phone } from 'lucide-react';
import { useLang } from '../../i18n/useLang';
import { telHref, waLink } from '../../lib/whatsapp';
import { WhatsAppIcon } from './BrandIcons';
import { ButtonLink } from './ButtonLink';
import type { ButtonVariant } from './buttonStyles';

interface Props {
  /** Prefilled WhatsApp text, already in the current language. */
  message: string;
  tone?: 'light' | 'dark';
  /** Extra screen-reader context, e.g. the project name. */
  context?: string;
  size?: 'md' | 'sm';
  className?: string;
}

/** WhatsApp + Call pair, always with text labels (never icon-only). */
export function ContactActions({ message, tone = 'light', context, size = 'md', className = '' }: Props) {
  const { t } = useLang();
  const primary: ButtonVariant = tone === 'dark' ? 'gold' : 'primary';
  const secondary: ButtonVariant = tone === 'dark' ? 'outlineLight' : 'outline';
  const pad = size === 'sm' ? 'px-3 text-[0.95rem]' : '';
  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`}>
      <ButtonLink href={waLink(message)} external variant={primary} className={pad}>
        <WhatsAppIcon className="size-5 shrink-0" />
        {t('actions.whatsapp')}
        {context && <span className="sr-only">: {context}</span>}
      </ButtonLink>
      <ButtonLink href={telHref} variant={secondary} className={pad}>
        <Phone aria-hidden className="size-5 shrink-0" />
        {t('actions.call')}
      </ButtonLink>
    </div>
  );
}
