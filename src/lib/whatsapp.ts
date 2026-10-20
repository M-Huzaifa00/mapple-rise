import { company } from '../data/company';

export const telHref = `tel:${company.phoneE164}`;
export const mailHref = `mailto:${company.email}`;

/** All WhatsApp CTAs go through here. Message text comes from the locale (wa.*) in the current language. */
export function waLink(message: string): string {
  return `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
