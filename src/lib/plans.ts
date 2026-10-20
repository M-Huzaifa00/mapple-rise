import { paymentPlans } from '../data/paymentPlans';
import type { PaymentPlan } from '../types';

export type InstallmentBasis = 'monthly' | 'quarterly' | 'halfYearly';

export function plansFor(projectId: string): PaymentPlan[] {
  return paymentPlans.filter((p) => p.projectId === projectId);
}

/**
 * What the buyer pays per month. Plans without monthly instalments are converted
 * (quarterly ÷ 3, half-yearly ÷ 6) and say so through `basis`.
 */
export function monthlyEquivalent(plan: PaymentPlan): { amount: number; basis: InstallmentBasis } | null {
  if (plan.monthly && plan.monthly.count > 0) return { amount: plan.monthly.amountPKR, basis: 'monthly' };
  if (plan.quarterly && plan.quarterly.count > 0) return { amount: Math.round(plan.quarterly.amountPKR / 3), basis: 'quarterly' };
  if (plan.halfYearly && plan.halfYearly.count > 0) return { amount: Math.round(plan.halfYearly.amountPKR / 6), basis: 'halfYearly' };
  return null;
}

export interface InstallmentSummary {
  bookingFrom?: number;
  monthlyFrom?: { amount: number; basis: InstallmentBasis };
  plans: PaymentPlan[];
}

/** Lowest booking and lowest monthly figure across a project's published plans. */
export function installmentSummary(projectId: string): InstallmentSummary {
  const plans = plansFor(projectId);
  const bookings = plans.map((p) => p.bookingPKR).filter((b): b is number => typeof b === 'number' && b > 0);
  const monthly = plans
    .map(monthlyEquivalent)
    .filter((m): m is NonNullable<typeof m> => m !== null)
    .sort((a, b) => a.amount - b.amount);
  return {
    bookingFrom: bookings.length ? Math.min(...bookings) : undefined,
    monthlyFrom: monthly[0],
    plans,
  };
}
