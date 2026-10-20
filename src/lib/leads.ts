/**
 * Lead capture without a backend. Enquiries go to localStorage["leads"], visit requests to
 * localStorage["visits"]. To plug in a real API, replace the bodies of `submitLead` / `submitVisit`
 * with fetch() calls and keep the return shape; the forms only depend on the result types.
 */

export const LEADS_KEY = 'leads';
export const VISITS_KEY = 'visits';

export type PreferredTime = 'morning' | 'afternoon' | 'evening';
export type VisitType = 'site' | 'virtual';

export interface LeadInput {
  source: 'hero' | 'callback';
  name: string;
  /** E.164, already normalised. */
  phone: string;
  project?: string;
  preferredTime?: PreferredTime;
  /** Honeypot. Humans never see this field. */
  website?: string;
}

export interface VisitInput {
  name: string;
  phone: string;
  project: string;
  visitType: VisitType;
  /** YYYY-MM-DD */
  date: string;
  timeOfDay: PreferredTime;
  website?: string;
}

export interface Lead extends Omit<LeadInput, 'website'> {
  id: string;
  createdAt: string;
}

export interface Visit extends Omit<VisitInput, 'website'> {
  id: string;
  createdAt: string;
}

export type LeadResult = { ok: true; lead: Lead } | { ok: false; error: string };
export type VisitResult = { ok: true; visit: Visit } | { ok: false; error: string };

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readList<T>(key: string): T[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function append<T>(key: string, item: T) {
  try {
    localStorage.setItem(key, JSON.stringify([...readList<T>(key), item]));
  } catch {
    // Storage blocked (private mode). Still succeed so the user can continue on WhatsApp.
  }
}

export const readLeads = () => readList<Lead>(LEADS_KEY);
export const readVisits = () => readList<Visit>(VISITS_KEY);

export async function submitLead(input: LeadInput): Promise<LeadResult> {
  const { website, ...data } = input;
  const lead: Lead = { ...data, id: newId(), createdAt: new Date().toISOString() };
  if (!website) append(LEADS_KEY, lead); // bot filled the honeypot: report success, store nothing
  return { ok: true, lead };
}

export async function submitVisit(input: VisitInput): Promise<VisitResult> {
  const { website, ...data } = input;
  const visit: Visit = { ...data, id: newId(), createdAt: new Date().toISOString() };
  if (!website) append(VISITS_KEY, visit);
  return { ok: true, visit };
}
