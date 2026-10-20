import { ArrowUp, MessageSquareText, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useScrolledPast } from '../../hooks/useScrolledPast';
import { useLang } from '../../i18n/useLang';
import { telHref, waLink } from '../../lib/whatsapp';
import { goToSection } from '../../state/ui';
import { WhatsAppIcon } from '../ui/BrandIcons';

const TEXT_INPUT = /^(text|tel|email|number|search|date|password|url)$/;

/** True while an on-screen keyboard is likely open (a text field has focus). */
function useKeyboardOpen(): boolean {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const isField = (el: EventTarget | null) =>
      el instanceof HTMLTextAreaElement ||
      el instanceof HTMLSelectElement ||
      (el instanceof HTMLInputElement && TEXT_INPUT.test(el.type));
    const onIn = (e: FocusEvent) => setOpen(isField(e.target));
    const onOut = () => setOpen(false);
    document.addEventListener('focusin', onIn);
    document.addEventListener('focusout', onOut);
    return () => {
      document.removeEventListener('focusin', onIn);
      document.removeEventListener('focusout', onOut);
    };
  }, []);
  return open;
}

/** Floating WhatsApp (tablet and up; phones have the bottom bar). Small, text-labelled, never covers forms. */
export function FloatingWhatsApp() {
  const { t } = useLang();
  return (
    <a
      href={waLink(t('wa.general'))}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed end-5 bottom-5 z-30 hidden min-h-12 items-center gap-2 rounded-md bg-brand-800 px-4 font-semibold text-white ring-1 ring-white/30 hover:bg-brand-700 md:inline-flex"
    >
      <WhatsAppIcon className="size-5" />
      {t('actions.whatsapp')}
    </a>
  );
}

/** Phone bottom bar: Call | WhatsApp | Enquire. Hides while the keyboard is open. */
export function MobileBottomBar() {
  const { t } = useLang();
  const keyboard = useKeyboardOpen();
  const item = 'flex min-h-16 flex-1 flex-col items-center justify-center gap-0.5 text-sm font-semibold';
  return (
    <nav
      aria-label={t('nav.quickContact')}
      className={`fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-paper transition-transform md:hidden ${
        keyboard ? 'translate-y-full' : ''
      }`}
    >
      <a href={telHref} className={`${item} text-brand-900`}>
        <Phone aria-hidden className="size-5" />
        {t('actions.call')}
      </a>
      <a href={waLink(t('wa.general'))} target="_blank" rel="noopener noreferrer" className={`${item} border-x border-line text-brand-900`}>
        <WhatsAppIcon className="size-5" />
        {t('actions.whatsapp')}
      </a>
      <a
        href="#contact"
        onClick={(e) => {
          e.preventDefault();
          goToSection('contact', 'contact-title');
        }}
        className={`${item} bg-brand-800 text-white`}
      >
        <MessageSquareText aria-hidden className="size-5" />
        {t('actions.enquire')}
      </a>
    </nav>
  );
}

export function BackToTop() {
  const { t } = useLang();
  const show = useScrolledPast(900);
  return (
    <a
      href="#home"
      aria-label={t('actions.backToTop')}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={`fixed end-4 bottom-20 z-30 inline-flex size-12 items-center justify-center rounded-md border border-line bg-paper text-brand-900 transition-opacity md:end-5 md:bottom-20 ${
        show ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <ArrowUp aria-hidden className="size-5" />
    </a>
  );
}
