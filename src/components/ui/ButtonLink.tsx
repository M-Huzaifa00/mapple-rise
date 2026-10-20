import type { ComponentProps } from 'react';
import { buttonStyles, type ButtonVariant } from './buttonStyles';

type Props = ComponentProps<'a'> & { variant?: ButtonVariant; external?: boolean };

/** Anchor styled as a button. `external` opens a new tab safely (WhatsApp, Maps, socials). */
export function ButtonLink({ variant = 'primary', external, className = '', ...rest }: Props) {
  const ext = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return <a {...ext} {...rest} className={`${buttonStyles[variant]} ${className}`} />;
}
