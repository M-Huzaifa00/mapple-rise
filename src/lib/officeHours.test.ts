import { describe, expect, it } from 'vitest';
import { officeStatus } from './officeHours';

// PKT = UTC+5. Office (placeholder) hours: Mon–Sat 10:00–18:00 PKT.
const pkt = (iso: string) => new Date(`${iso}+05:00`);

describe('officeStatus (Asia/Karachi)', () => {
  it('is open during office hours', () => {
    expect(officeStatus(pkt('2026-10-21T11:30:00')).open).toBe(true); // Wednesday
  });

  it('is closed before opening, and reopens later the same day', () => {
    const s = officeStatus(pkt('2026-10-21T08:00:00'));
    expect(s.open).toBe(false);
    expect(s.opensLaterDay).toBe(false);
    expect(s.opensAt).toBe('10 AM');
  });

  it('is closed in the evening and on Sunday, reopening another day', () => {
    expect(officeStatus(pkt('2026-10-21T19:00:00')).opensLaterDay).toBe(true);
    const sunday = officeStatus(pkt('2026-10-25T12:00:00'));
    expect(sunday.open).toBe(false);
    expect(sunday.opensLaterDay).toBe(true);
  });

  it('uses Pakistan time regardless of the visitor time zone', () => {
    // 05:00 UTC = 10:00 PKT
    expect(officeStatus(new Date('2026-10-21T05:00:00Z')).open).toBe(true);
    expect(officeStatus(new Date('2026-10-21T05:00:00Z')).time).toBe('10:00 AM');
  });
});
