/**
 * Demo switches. With DEMO_MODE on, nothing navigates away from this page: project links open the
 * in-page Quick View, and pages that don't exist yet show a "coming soon" toast.
 * Set to false once the full website exists; links then go to each project's `sourceUrl`.
 */
export const DEMO_MODE = true;

/** Date the prices and plans were copied from mapleriseestates.com. */
export const LAST_VERIFIED = '2026-10-20';

/**
 * Office hours (PKT) drive the "online now" status. MapleRise hasn't published hours, so these are
 * a placeholder and are shown with a Sample chip until confirmed.
 */
export const OFFICE = {
  timeZone: 'Asia/Karachi',
  /** 0 = Sunday … 6 = Saturday */
  openDays: [1, 2, 3, 4, 5, 6],
  openHour: 10,
  closeHour: 18,
  hoursConfirmed: false,
  addressConfirmed: false,
} as const;

/** No street address is published yet; directions point to Islamabad until MapleRise confirms it. */
export const MAPS_DIRECTIONS_URL = 'https://www.google.com/maps/dir/?api=1&destination=Islamabad%2C+Pakistan';
export const MAPS_EMBED_URL = 'https://www.google.com/maps?q=Islamabad,+Pakistan&output=embed';
