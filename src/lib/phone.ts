export interface Country {
  id: string;
  label: string;
  dial: string;
}

/** Default first. Overseas options cover the largest Pakistani diaspora markets. */
export const COUNTRIES: Country[] = [
  { id: 'PK', label: 'Pakistan', dial: '+92' },
  { id: 'AE', label: 'UAE', dial: '+971' },
  { id: 'SA', label: 'Saudi Arabia', dial: '+966' },
  { id: 'GB', label: 'United Kingdom', dial: '+44' },
  { id: 'US', label: 'USA', dial: '+1' },
  { id: 'CA', label: 'Canada', dial: '+1' },
];

export function dialFor(countryId: string): string {
  return COUNTRIES.find((c) => c.id === countryId)?.dial ?? '+92';
}

const strip = (raw: string) => raw.trim().replace(/[\s\-().]/g, '');

/** Accepts 03XXXXXXXXX, 03XX-XXXXXXX, 3XXXXXXXXX, +923XXXXXXXXX, 00923XXXXXXXXX → "+923XXXXXXXXX". */
export function normalizePakistaniMobile(raw: string): string | null {
  const s = strip(raw);
  const m = s.match(/^(?:\+92|0092|92)(3\d{9})$/) ?? s.match(/^0(3\d{9})$/) ?? s.match(/^(3\d{9})$/);
  return m ? `+92${m[1]}` : null;
}

/**
 * Normalise a phone number to E.164.
 * A number typed with its own "+" or "00" prefix wins over the selected country code.
 */
export function normalizePhone(raw: string, dial = '+92'): string | null {
  const s = strip(raw);
  if (!s) return null;

  const isPk = /^(\+92|0092)/.test(s) || (dial === '+92' && !/^(\+|00)/.test(s));
  if (isPk) return normalizePakistaniMobile(s);

  if (s.startsWith('+')) return /^\+\d{8,15}$/.test(s) ? s : null;
  if (s.startsWith('00')) return /^00\d{8,15}$/.test(s) ? `+${s.slice(2)}` : null;

  const national = s.replace(/^0+/, '');
  return /^\d{6,14}$/.test(national) ? `${dial}${national}` : null;
}

/**
 * As-you-type formatting for Pakistani mobiles: "03001234567" → "0300-1234567".
 * Other country codes and numbers typed with "+"/"00" are left exactly as typed.
 */
export function formatPhoneInput(raw: string, dial: string): string {
  const trimmed = raw.trimStart();
  if (dial !== '+92' || trimmed.startsWith('+') || trimmed.startsWith('00')) return raw;
  const d = raw.replace(/\D/g, '');
  if (d.startsWith('0')) {
    const x = d.slice(0, 11);
    return x.length > 4 ? `${x.slice(0, 4)}-${x.slice(4)}` : x;
  }
  if (d.startsWith('3')) {
    const x = d.slice(0, 10);
    return x.length > 3 ? `${x.slice(0, 3)}-${x.slice(3)}` : x;
  }
  return d.slice(0, 12);
}
