import { describe, expect, it } from 'vitest';
import { callbackSchema, quickLeadSchema } from './validation';

const issues = (r: { success: boolean; error?: { issues: { path: PropertyKey[]; message: string }[] } }) =>
  r.success ? [] : (r.error?.issues ?? []).map((i) => `${i.path.join('.')}:${i.message}`);

describe('lead form schemas', () => {
  it('accepts a valid quick lead', () => {
    const r = quickLeadSchema.safeParse({ name: 'Ali', country: 'PK', phone: '0300-1226381', project: 'DHA Gandhara' });
    expect(r.success).toBe(true);
  });

  it('reports i18n keys for invalid fields', () => {
    const r = quickLeadSchema.safeParse({ name: ' A ', country: 'PK', phone: '12345', project: '' });
    expect(issues(r)).toEqual(
      expect.arrayContaining(['name:errNameShort', 'project:errProjectRequired']),
    );
  });

  it('flags an invalid phone for the selected country', () => {
    const r = quickLeadSchema.safeParse({ name: 'Ali', country: 'PK', phone: '12345', project: 'X' });
    expect(issues(r)).toEqual(['phone:errPhoneInvalid']);
  });

  it('accepts an overseas number with its country code', () => {
    const r = callbackSchema.safeParse({ name: 'Sara', country: 'AE', phone: '050 123 4567', preferredTime: 'evening', project: '' });
    expect(r.success).toBe(true);
  });

  it('requires a preferred call time', () => {
    const r = callbackSchema.safeParse({ name: 'Sara', country: 'PK', phone: '03001226381', project: '' });
    expect(issues(r)).toEqual(['preferredTime:errTimeRequired']);
  });
});
