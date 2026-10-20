/** Sections that exist on this page. Labels: nav.<id>. */
export const NAV = ['home', 'projects', 'payment-plans', 'services', 'about', 'team', 'contact'] as const;
export type NavId = (typeof NAV)[number];

/** Translation key for each nav id ("payment-plans" → nav.paymentPlans). */
export const NAV_KEY: Record<NavId, string> = {
  home: 'nav.home',
  projects: 'nav.projects',
  'payment-plans': 'nav.paymentPlans',
  services: 'nav.services',
  about: 'nav.about',
  team: 'nav.team',
  contact: 'nav.contact',
};

export const SECTION_IDS: readonly string[] = NAV;
