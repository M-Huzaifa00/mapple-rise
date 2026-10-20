import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { projects } from '../data/projects';
import type { VisitType } from '../lib/leads';
import { ShortlistContext, UIContext, type Overlay, type Toast, type UIState } from './ui';

const HISTORY_KEY = 'mrOverlay';
const SHORTLIST_KEY = 'shortlist';
const knownIds = new Set(projects.map((p) => p.id));

/** Overlays (one history entry, Back closes), toasts and cross-section requests. */
function UIProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [restoreFocus, setRestoreFocus] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [calcRequest, setCalcRequest] = useState<UIState['calcRequest']>(null);
  const [visitRequest, setVisitRequest] = useState<UIState['visitRequest']>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const nextId = useRef(1);

  useEffect(() => {
    overlayRef.current = overlay;
  }, [overlay]);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (history.state?.[HISTORY_KEY]) history.replaceState({ ...history.state, [HISTORY_KEY]: undefined }, '');
    const onPop = () => {
      if (!history.state?.[HISTORY_KEY] && overlayRef.current) setOverlay(null);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const open = useCallback((o: Overlay) => {
    const state = { ...(history.state ?? {}), [HISTORY_KEY]: o.kind };
    if (overlayRef.current) history.replaceState(state, '');
    else history.pushState(state, '');
    overlayRef.current = o;
    setRestoreFocus(true);
    setOverlay(o);
  }, []);

  const close = useCallback((opts?: { restoreFocus?: boolean }) => {
    setRestoreFocus(opts?.restoreFocus ?? true);
    if (history.state?.[HISTORY_KEY]) history.back(); // popstate clears the overlay
    else setOverlay(null);
  }, []);

  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = useCallback(
    (message: string) => {
      const id = nextId.current++;
      setToasts((t) => [...t.slice(-2), { id, message }]);
      window.setTimeout(() => dismissToast(id), 4000);
    },
    [dismissToast],
  );

  const requestPlan = useCallback((planId: string) => setCalcRequest({ planId, nonce: Date.now() }), []);
  const requestVisit = useCallback(
    (type: VisitType, projectId?: string) => setVisitRequest({ type, projectId, nonce: Date.now() }),
    [],
  );

  const value = useMemo<UIState>(
    () => ({ overlay, open, close, restoreFocus, toasts, toast, dismissToast, calcRequest, requestPlan, visitRequest, requestVisit }),
    [overlay, open, close, restoreFocus, toasts, toast, dismissToast, calcRequest, requestPlan, visitRequest, requestVisit],
  );
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

/** Shortlisted projects in localStorage. Empty on first render to match the prerendered HTML. */
function ShortlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(SHORTLIST_KEY) ?? '[]');
      if (!Array.isArray(parsed)) return;
      const saved = parsed.filter((x): x is string => typeof x === 'string' && knownIds.has(x));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time post-hydration restore
      if (saved.length) setIds(saved);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const save = useCallback((next: string[]) => {
    setIds(next);
    try {
      localStorage.setItem(SHORTLIST_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const value = useMemo(
    () => ({
      ids,
      has: (id: string) => ids.includes(id),
      toggle: (id: string) => {
        const adding = !ids.includes(id);
        save(adding ? [...ids, id] : ids.filter((x) => x !== id));
        return adding;
      },
      remove: (id: string) => save(ids.filter((x) => x !== id)),
      clear: () => save([]),
    }),
    [ids, save],
  );
  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UIProvider>
      <ShortlistProvider>{children}</ShortlistProvider>
    </UIProvider>
  );
}
