import type { Stat } from '../types';

export const SCRAPED_ON = '2026-10-20';

/** Contact facts. All wording (tagline, about text, labels) lives in the locale files. */
export const company = {
  name: 'MapleRise Estates',
  siteUrl: 'https://mapleriseestates.com/',
  // The live footer links point to contact@mysite.com and tel:123-456-7890 (template defaults).
  // These are the values MapleRise displays in text on every page and on /contact/.
  email: 'info@mapleriseestates.com',
  phoneDisplay: '+92 300 1226381',
  phoneE164: '+923001226381',
  whatsappNumber: '923001226381',
  socials: {
    facebook: 'https://www.facebook.com/people/MapleRise-Estates/61585028874601/',
    instagram: 'https://www.instagram.com/mapleriseestates/',
    youtube: 'https://www.youtube.com/@MapleRiseEstates',
    tiktok: 'https://www.tiktok.com/@mapleriseestates',
  } as Record<'facebook' | 'instagram' | 'youtube' | 'tiktok', string | undefined>,
  privacyUrl: 'https://mapleriseestates.com/privacy-policy/',
};

/**
 * Trust counters (labels in locales: about.stats.<id>). Final values render in the HTML;
 * the count-up is an enhancement only. `clients` is a word ("Hundreds"), not a number.
 */
export const stats: Stat[] = [
  { id: 'returnRate', value: 85, suffix: '%', source: 'https://mapleriseestates.com/about/ ("85% client return & referrals")' },
  { id: 'founderYears', value: 50, suffix: '+', source: 'https://mapleriseestates.com/our-team/ (Asad Khan: "five decades")' },
  { id: 'projects', value: 22, source: 'Count of projects in the Properties menu on https://mapleriseestates.com/' },
  { id: 'clients', source: 'https://mapleriseestates.com/about/ ("guided hundreds of buyers, sellers, and investors")' },
];
