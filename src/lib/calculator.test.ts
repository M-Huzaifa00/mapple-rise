import { describe, expect, it } from 'vitest';
import type { PaymentPlan } from '../types';
import { breakdown, isConsistent, planMismatch, toInputs } from './calculator';
import { installmentSummary, monthlyEquivalent } from './plans';

const plan: PaymentPlan = {
  id: 't',
  projectId: 'capital-smart-city',
  project: 'Test',
  size: '5 Marla',
  totalPKR: 1_000_000,
  bookingPKR: 100_000,
  confirmationPKR: 100_000,
  monthly: { count: 10, amountPKR: 40_000 },
  halfYearly: { count: 2, amountPKR: 100_000 },
  other: [{ kind: 'possession', amountPKR: 200_000 }],
  lastVerified: '2026-10-20',
  sourceUrl: 'https://mapleriseestates.com/',
};

describe('breakdown', () => {
  it('sums every part of the schedule', () => {
    const { rows, totalPKR } = breakdown(toInputs(plan));
    expect(totalPKR).toBe(1_000_000);
    expect(rows.map((r) => [r.key, r.subtotalPKR])).toEqual([
      ['booking', 100_000],
      ['confirmation', 100_000],
      ['monthly', 400_000],
      ['halfYearly', 200_000],
      ['possession', 200_000],
    ]);
  });

  it('multiplies repeated one-off payments (balloons)', () => {
    const { rows } = breakdown({ ...toInputs(plan), other: [{ kind: 'balloon', count: 7, amountPKR: 10 }] });
    expect(rows.find((r) => r.key === 'balloon')?.subtotalPKR).toBe(70);
  });

  it('drops empty rows and ignores negative or invalid edits', () => {
    const inputs = { ...toInputs(plan), confirmationPKR: -5, monthly: { count: Number.NaN, amountPKR: 40_000 } };
    const { rows, totalPKR } = breakdown(inputs);
    expect(rows.find((r) => r.key === 'confirmation')).toBeUndefined();
    expect(rows.find((r) => r.key === 'monthly')).toBeUndefined();
    expect(totalPKR).toBe(500_000);
  });

  it('floors fractional instalment counts', () => {
    const { totalPKR } = breakdown({ ...toInputs(plan), monthly: { count: 2.9, amountPKR: 1_000 }, other: [] });
    expect(totalPKR).toBe(100_000 + 100_000 + 2_000 + 200_000);
  });
});

describe('planMismatch', () => {
  it('is zero for a consistent plan', () => {
    expect(planMismatch(plan)).toBe(0);
    expect(isConsistent(plan)).toBe(true);
  });

  it('allows up to PKR 1,000 of rounding', () => {
    expect(isConsistent({ ...plan, totalPKR: 1_001_000 })).toBe(true);
    expect(isConsistent({ ...plan, totalPKR: 1_001_001 })).toBe(false);
  });
});

describe('installment-first figures', () => {
  it('converts quarterly and half-yearly plans to a monthly figure', () => {
    expect(monthlyEquivalent({ ...plan, monthly: undefined, quarterly: { count: 12, amountPKR: 300 } })).toEqual({ amount: 100, basis: 'quarterly' });
    expect(monthlyEquivalent({ ...plan, monthly: undefined, halfYearly: { count: 2, amountPKR: 600 } })).toEqual({ amount: 100, basis: 'halfYearly' });
  });

  it('summarises booking and monthly "from" amounts per project', () => {
    const csc = installmentSummary('capital-smart-city');
    expect(csc.bookingFrom).toBe(178_900);
    expect(csc.monthlyFrom).toEqual({ amount: 17_038, basis: 'monthly' });
    // The suspicious 12,265,000 Smart Villa booking never becomes the "from" figure.
    expect(installmentSummary('smart-villas').bookingFrom).toBe(948_000);
    expect(installmentSummary('dha-gandhara').plans).toHaveLength(0);
  });
});
