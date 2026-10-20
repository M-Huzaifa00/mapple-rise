import { createContext, useContext } from 'react';
import type { GuideId } from '../data/samples';
import type { VisitType } from '../lib/leads';

export type Overlay =
  | { kind: 'menu' }
  | { kind: 'quickView'; projectId: string }
  | { kind: 'overseas' }
  | { kind: 'guide'; guideId: GuideId }
  | { kind: 'shortlist' };

export interface Toast {
  id: number;
  message: string;
}

export interface UIState {
  overlay: Overlay | null;
  /** Open an overlay. Switching overlays reuses one history entry, so Back always closes. */
  open: (o: Overlay) => void;
  /** Close the overlay. `restoreFocus: false` when the caller moves focus itself. */
  close: (opts?: { restoreFocus?: boolean }) => void;
  restoreFocus: boolean;
  toasts: Toast[];
  toast: (message: string) => void;
  dismissToast: (id: number) => void;
  /** Calculator preselection requested from elsewhere (Quick View). */
  calcRequest: { planId: string; nonce: number } | null;
  requestPlan: (planId: string) => void;
  /** Contact-section tab requested from elsewhere (overseas panel, Quick View). */
  visitRequest: { type: VisitType; projectId?: string; nonce: number } | null;
  requestVisit: (type: VisitType, projectId?: string) => void;
}

export const UIContext = createContext<UIState | null>(null);

export function useUI(): UIState {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI outside UIProvider');
  return ctx;
}

/** Smooth-scrolls to a section (instant with reduced motion) and moves focus to its heading. */
export function goToSection(id: string, headingId?: string) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  if (headingId) document.getElementById(headingId)?.focus({ preventScroll: true });
}

export interface ShortlistState {
  ids: string[];
  has: (id: string) => boolean;
  /** Returns true when the project was added, false when removed. */
  toggle: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
}

export const ShortlistContext = createContext<ShortlistState | null>(null);

export function useShortlist(): ShortlistState {
  const ctx = useContext(ShortlistContext);
  if (!ctx) throw new Error('useShortlist outside ShortlistProvider');
  return ctx;
}
