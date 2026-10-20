export const LAKH = 100_000;
export const CRORE = 10_000_000;

export type PKRFormat = 'short' | 'full';
export type MoneyUnit = 'full' | 'lakh' | 'crore';

/** Turns a unit + number into words. The app passes translated templates (money.* in the locales). */
export type MoneyTemplate = (unit: MoneyUnit, n: string) => string;

const EN: MoneyTemplate = (unit, n) => (unit === 'lakh' ? `PKR ${n} Lakh` : unit === 'crore' ? `PKR ${n} Crore` : `PKR ${n}`);

// Western digits and grouping in both languages (the norm on Pakistani property sites).
const whole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const twoDp = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

/** Unit and number string, before any wording is applied. */
export function pkrParts(amount: number, format: PKRFormat): { unit: MoneyUnit; n: string; negative: boolean } {
  const negative = amount < 0;
  const abs = Math.abs(amount);
  if (format === 'short') {
    const crore = Math.round((abs / CRORE) * 100) / 100;
    if (crore >= 1) return { unit: 'crore', n: twoDp.format(crore), negative };
    const lakh = Math.round((abs / LAKH) * 100) / 100;
    if (lakh >= 1) return { unit: 'lakh', n: twoDp.format(lakh), negative };
  }
  return { unit: 'full', n: whole.format(Math.round(abs)), negative };
}

/**
 * - `full`  → "PKR 4,675,000" / "4,675,000 روپے" (breakdowns)
 * - `short` → "PKR 46.75 Lakh" / "46.75 لاکھ", "PKR 1.05 Crore" / "1.05 کروڑ" (cards)
 * Under 1 Lakh, `short` falls back to `full`.
 */
export function formatPKR(amount: number, format: PKRFormat = 'full', template: MoneyTemplate = EN): string {
  if (!Number.isFinite(amount)) return template('full', '–');
  const { unit, n, negative } = pkrParts(amount, format);
  return `${negative ? '-' : ''}${template(unit, n)}`;
}
