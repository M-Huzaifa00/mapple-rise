import { describe, expect, it } from 'vitest';
import en from '../i18n/locales/en.json';
import ur from '../i18n/locales/ur.json';
import { formatPKR, type MoneyTemplate } from './currency';

const fromLocale =
  (m: Record<string, string>): MoneyTemplate =>
  (unit, n) =>
    m[unit].replace('{{n}}', n);
const URDU = fromLocale(ur.money);
const ENGLISH = fromLocale(en.money);

describe('formatPKR (English)', () => {
  it('formats full amounts with thousands separators', () => {
    expect(formatPKR(4_675_000)).toBe('PKR 4,675,000');
    expect(formatPKR(325_000, 'full')).toBe('PKR 325,000');
    expect(formatPKR(0)).toBe('PKR 0');
  });

  it('formats short amounts in Lakh and Crore', () => {
    expect(formatPKR(4_675_000, 'short')).toBe('PKR 46.75 Lakh');
    expect(formatPKR(2_000_000, 'short')).toBe('PKR 20 Lakh');
    expect(formatPKR(1_789_000, 'short')).toBe('PKR 17.89 Lakh');
    expect(formatPKR(10_500_000, 'short')).toBe('PKR 1.05 Crore');
    expect(formatPKR(12_000_000, 'short')).toBe('PKR 1.2 Crore');
    expect(formatPKR(350_000_000, 'short')).toBe('PKR 35 Crore');
  });

  it('rolls 99.99+ Lakh over to 1 Crore instead of "100 Lakh"', () => {
    expect(formatPKR(9_999_999, 'short')).toBe('PKR 1 Crore');
  });

  it('falls back to full format under 1 Lakh', () => {
    expect(formatPKR(44_430, 'short')).toBe('PKR 44,430');
  });

  it('handles negatives and invalid numbers', () => {
    expect(formatPKR(-40_920)).toBe('-PKR 40,920');
    expect(formatPKR(Number.NaN)).toBe('PKR –');
  });

  it('matches the English locale templates', () => {
    expect(formatPKR(4_675_000, 'short', ENGLISH)).toBe('PKR 46.75 Lakh');
  });
});

describe('formatPKR (Urdu, Western digits)', () => {
  it('uses لاکھ / کروڑ for short amounts', () => {
    expect(formatPKR(4_675_000, 'short', URDU)).toBe('46.75 لاکھ');
    expect(formatPKR(10_500_000, 'short', URDU)).toBe('1.05 کروڑ');
  });

  it('uses روپے for full amounts', () => {
    expect(formatPKR(4_675_000, 'full', URDU)).toBe('4,675,000 روپے');
    expect(formatPKR(44_430, 'short', URDU)).toBe('44,430 روپے');
  });
});
