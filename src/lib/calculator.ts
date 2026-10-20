import type { InstallmentGroup, OtherPaymentKind, PaymentPlan } from '../types';

/** Allowed difference between a plan's listed total and the sum of its parts. */
export const TOLERANCE_PKR = 1_000;

export interface PlanInputs {
  bookingPKR: number;
  confirmationPKR: number;
  monthly: InstallmentGroup;
  halfYearly: InstallmentGroup;
  quarterly: InstallmentGroup;
  other: { kind: OtherPaymentKind; amountPKR: number; count?: number }[];
}

export type RowKey = 'booking' | 'confirmation' | 'monthly' | 'halfYearly' | 'quarterly' | OtherPaymentKind;

export interface BreakdownRow {
  key: RowKey;
  count: number;
  amountPKR: number;
  subtotalPKR: number;
}

const EMPTY: InstallmentGroup = { count: 0, amountPKR: 0 };
const clean = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function toInputs(plan: PaymentPlan): PlanInputs {
  return {
    bookingPKR: plan.bookingPKR ?? 0,
    confirmationPKR: plan.confirmationPKR ?? 0,
    monthly: plan.monthly ?? EMPTY,
    halfYearly: plan.halfYearly ?? EMPTY,
    quarterly: plan.quarterly ?? EMPTY,
    other: plan.other ?? [],
  };
}

export function breakdown(inputs: PlanInputs): { rows: BreakdownRow[]; totalPKR: number } {
  const row = (key: RowKey, amount: number, count = 1): BreakdownRow => {
    const c = Math.floor(clean(count));
    const a = clean(amount);
    return { key, count: c, amountPKR: a, subtotalPKR: c * a };
  };

  const rows = [
    row('booking', inputs.bookingPKR),
    row('confirmation', inputs.confirmationPKR),
    row('monthly', inputs.monthly.amountPKR, inputs.monthly.count),
    row('halfYearly', inputs.halfYearly.amountPKR, inputs.halfYearly.count),
    row('quarterly', inputs.quarterly.amountPKR, inputs.quarterly.count),
    ...inputs.other.map((o) => row(o.kind, o.amountPKR, o.count ?? 1)),
  ].filter((r) => r.subtotalPKR > 0);

  return { rows, totalPKR: rows.reduce((sum, r) => sum + r.subtotalPKR, 0) };
}

export function sumOfParts(plan: PaymentPlan): number {
  return breakdown(toInputs(plan)).totalPKR;
}

/** Positive when the parts add up to more than the listed total. */
export function planMismatch(plan: PaymentPlan): number {
  return sumOfParts(plan) - plan.totalPKR;
}

export function isConsistent(plan: PaymentPlan): boolean {
  return Math.abs(planMismatch(plan)) <= TOLERANCE_PKR;
}
