import type { ImageKey } from '../assets/images/manifest';

/** Capital Smart City districts from https://mapleriseestates.com/capital-smart-city/. Text: data.districts.<id>. */
export const districts: { id: string; image: ImageKey }[] = [
  { id: 'gatePrecinct', image: 'districts/gate-precinct' },
  { id: 'aviation', image: 'districts/aviation' },
  { id: 'crystalLake', image: 'districts/crystal-lake' },
  { id: 'financialSquare', image: 'districts/financial-square' },
  { id: 'healthcare', image: 'districts/healthcare' },
  { id: 'overseasEast', image: 'districts/overseas-east-district' },
  { id: 'sports', image: 'districts/sports' },
];

/** Developer trust strip (proper names, not translated). */
export const developerPartners = ['Habib Rafiq (Pvt) Ltd', 'Future Development Holdings (FDHL)', 'Surbana Jurong'] as const;
