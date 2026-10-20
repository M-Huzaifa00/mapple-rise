import { OFFICE } from '../config';

export interface OfficeStatus {
  open: boolean;
  /** Office clock in the requested locale, e.g. "3:42 PM". */
  time: string;
  /** Opening hour in the requested locale, e.g. "10 AM". */
  opensAt: string;
  /** Closed now and the next opening is a later day (not later today). */
  opensLaterDay: boolean;
}

const UTC_OFFSET_HOURS = 5; // Asia/Karachi has no daylight saving

function karachiDayHour(d: Date) {
  const p = new Intl.DateTimeFormat('en-US', {
    timeZone: OFFICE.timeZone,
    weekday: 'short',
    hour: 'numeric',
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) => p.find((x) => x.type === type)?.value ?? '';
  return {
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')),
    hour: Number(get('hour')) % 24,
  };
}

/** Office status in Pakistan time, whatever the visitor's own time zone. */
export function officeStatus(now: Date = new Date(), locale = 'en-US'): OfficeStatus {
  const { day, hour } = karachiDayHour(now);
  const openToday = (OFFICE.openDays as readonly number[]).includes(day);
  const open = openToday && hour >= OFFICE.openHour && hour < OFFICE.closeHour;
  const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { timeZone: OFFICE.timeZone, ...opts });
  const opening = new Date(Date.UTC(2026, 0, 1, OFFICE.openHour - UTC_OFFSET_HOURS));
  return {
    open,
    time: fmt({ hour: 'numeric', minute: '2-digit' }).format(now),
    opensAt: fmt({ hour: 'numeric' }).format(opening),
    opensLaterDay: !open && !(openToday && hour < OFFICE.openHour),
  };
}
