import type { ImageKey } from '../assets/images/manifest';

export type City = 'Islamabad' | 'Rawalpindi' | 'Lahore' | 'Gujar Khan' | 'Wah' | 'Murree' | 'Other';

export type PropertyType =
  | 'Residential Plot'
  | 'Commercial Plot'
  | 'Villa/House'
  | 'Apartment'
  | 'Farmhouse'
  | 'Shop/Office';

/**
 * Card-level project data. Human-readable text (area, price note, NOC note, highlights, review
 * note) lives in the locale files under `data.projects.<id>` so it can be translated.
 */
export interface ProjectCard {
  id: string;
  name: string;
  /** Spelling used on the live MapleRise site, when it differs from `name`. */
  sourceName?: string;
  city: City;
  developer?: string;
  sizes: string[];
  types: PropertyType[];
  startingPricePKR?: number;
  featured?: boolean;
  /** Live MapleRise page. Only used as a link when DEMO_MODE is off. */
  sourceUrl: string;
  /** Data looks wrong on the source; explained in `data.projects.<id>.review`. */
  needsReview?: boolean;
  /** Parent project id (Capital Smart City sub-projects). */
  parent?: string;
  /** Square feet per Marla when the project's own data states it. */
  sqftPerMarla?: number;
  /** Local images; the first is the card image. */
  images: ImageKey[];
  nocStatus: 'approved' | 'pending' | 'not-stated';
}

export interface InstallmentGroup {
  count: number;
  amountPKR: number;
}

export type OtherPaymentKind = 'possession' | 'plotSelection' | 'balloon' | 'finalQuarter';

/** Label, note and review text live under `data.plans.<id>` in the locale files. */
export interface PaymentPlan {
  id: string;
  projectId: string;
  /** Group label in the plan picker (project names stay in English). */
  project: string;
  size: string;
  totalPKR: number;
  bookingPKR?: number;
  confirmationPKR?: number;
  monthly?: InstallmentGroup;
  halfYearly?: InstallmentGroup;
  quarterly?: InstallmentGroup;
  /** One-off or irregular amounts that are part of the schedule. */
  other?: { kind: OtherPaymentKind; amountPKR: number; count?: number }[];
  lastVerified: string;
  sourceUrl: string;
  needsReview?: boolean;
  hasNote?: boolean;
}

export interface Stat {
  id: string;
  value?: number;
  suffix?: string;
  source: string;
  sample?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  image?: ImageKey;
  leader?: boolean;
  sourceName?: string;
}
