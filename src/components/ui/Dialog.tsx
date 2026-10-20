import { useEffect, useRef, type ReactNode, type TouchEvent } from 'react';

type Variant = 'sheet' | 'side' | 'full';

const VARIANT: Record<Variant, string> = {
  // Bottom sheet on phones, centred modal from sm up.
  sheet:
    'm-0 mt-auto w-full max-w-none max-h-[92dvh] rounded-t-lg sm:m-auto sm:max-h-[88vh] sm:w-[min(58rem,calc(100%-2rem))] sm:rounded-lg',
  // Bottom sheet on phones, end-side drawer from sm up.
  side: 'm-0 mt-auto w-full max-w-none max-h-[88dvh] rounded-t-lg sm:ms-auto sm:me-0 sm:my-0 sm:h-dvh sm:max-h-none sm:w-[26rem] sm:rounded-none',
  full: 'm-0 h-dvh max-h-none w-full max-w-none',
};

interface Props {
  open: boolean;
  onRequestClose: () => void;
  labelledBy: string;
  variant?: Variant;
  restoreFocus?: boolean;
  children: ReactNode;
}

/**
 * Native <dialog> (focus trap, inert page, Esc). Adds: backdrop click, swipe-down on phones,
 * scroll lock, and focus returned to the element that opened it.
 */
export function Dialog({ open, onRequestClose, labelledBy, variant = 'sheet', restoreFocus = true, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const restore = useRef(restoreFocus);
  const drag = useRef<{ startY: number; dy: number } | null>(null);

  useEffect(() => {
    restore.current = restoreFocus;
  }, [restoreFocus]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      d.showModal();
      document.documentElement.style.overflow = 'hidden';
    } else if (!open && d.open) {
      d.close();
      document.documentElement.style.overflow = '';
      if (restore.current && opener.current?.isConnected) opener.current.focus({ preventScroll: true });
    }
  }, [open]);

  useEffect(() => () => void (document.documentElement.style.overflow = ''), []);

  // Swipe down from the top of the sheet to close (phones only).
  const onTouchStart = (e: TouchEvent<HTMLDialogElement>) => {
    const d = ref.current;
    if (!d || window.innerWidth >= 640 || variant === 'full') return;
    const top = d.getBoundingClientRect().top;
    if (e.touches[0].clientY - top < 72 || d.scrollTop === 0) drag.current = { startY: e.touches[0].clientY, dy: 0 };
  };
  const onTouchMove = (e: TouchEvent<HTMLDialogElement>) => {
    const d = ref.current;
    if (!d || !drag.current) return;
    const dy = e.touches[0].clientY - drag.current.startY;
    if (dy <= 0 || d.scrollTop > 0) return;
    drag.current.dy = dy;
    d.style.transform = `translateY(${dy}px)`;
  };
  const onTouchEnd = () => {
    const d = ref.current;
    if (!d || !drag.current) return;
    const { dy } = drag.current;
    drag.current = null;
    d.style.transform = '';
    if (dy > 90) onRequestClose();
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        e.preventDefault();
        onRequestClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onRequestClose();
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={`mr-dialog overflow-y-auto overscroll-contain bg-paper p-0 text-ink ${VARIANT[variant]}`}
    >
      {variant !== 'full' && <div aria-hidden className="mx-auto mt-2 h-1 w-10 rounded-full bg-line sm:hidden" />}
      {open && children}
    </dialog>
  );
}
