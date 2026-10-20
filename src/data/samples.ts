/**
 * PLACEHOLDER CONTENT. MapleRise has published no guides or reviews.
 * Text lives in the locales (data.guides.<id>, data.reviews.<id>) and every item renders with a
 * grey "Sample" chip. Reviews use role/location descriptors, never names that could look real.
 */
export const guides = [
  { id: 'noc', icon: 'FileCheck' },
  { id: 'marlaKanal', icon: 'Ruler' },
  { id: 'overseas', icon: 'Plane' },
] as const;

export type GuideId = (typeof guides)[number]['id'];

export const reviews = ['overseasUae', 'firstTimeRwp', 'investorLhr'] as const;
