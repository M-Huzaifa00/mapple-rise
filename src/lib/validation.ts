import { z } from 'zod/mini';
import { dialFor, normalizePhone } from './phone';

/**
 * zod/mini keeps the form bundle small on mid-range phones.
 * Error messages are translation keys under `errors.*` (shown in the current language).
 */
const contactFields = {
  name: z.string().check(z.trim(), z.minLength(2, 'errors.nameShort'), z.maxLength(80, 'errors.nameLong')),
  country: z.string(),
  phone: z.string().check(z.trim(), z.minLength(1, 'errors.phoneRequired')),
  website: z.optional(z.string()),
};

const validPhone = z.refine<{ phone: string; country: string }>(
  (v) => !v.phone.trim() || normalizePhone(v.phone, dialFor(v.country)) !== null,
  { message: 'errors.phoneInvalid', path: ['phone'] },
);

const timeOfDay = z.enum(['morning', 'afternoon', 'evening'], { error: 'errors.timeRequired' });

export const quickLeadSchema = z
  .object({ ...contactFields, project: z.string().check(z.minLength(1, 'errors.projectRequired')) })
  .check(validPhone);

export const callbackSchema = z
  .object({ ...contactFields, preferredTime: timeOfDay, project: z.string() })
  .check(validPhone);

/** Today in YYYY-MM-DD (local), the earliest date a visit can be requested for. */
export function todayISO(now = new Date()): string {
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export const visitSchema = z
  .object({
    ...contactFields,
    project: z.string().check(z.minLength(1, 'errors.projectRequired')),
    visitType: z.enum(['site', 'virtual'], { error: 'errors.visitTypeRequired' }),
    date: z.string().check(z.regex(/^\d{4}-\d{2}-\d{2}$/, 'errors.dateRequired')),
    timeOfDay,
  })
  .check(
    validPhone,
    z.refine((v) => !/^\d{4}-\d{2}-\d{2}$/.test(v.date) || v.date >= todayISO(), {
      message: 'errors.datePast',
      path: ['date'],
    }),
  );

export type QuickLeadValues = z.infer<typeof quickLeadSchema>;
export type CallbackValues = z.infer<typeof callbackSchema>;
export type VisitValues = z.infer<typeof visitSchema>;
