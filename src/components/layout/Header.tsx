import { Heart, Menu } from 'lucide-react';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useScrolledPast } from '../../hooks/useScrolledPast';
import { useLang } from '../../i18n/useLang';
import { useShortlist, useUI } from '../../state/ui';
import { WhatsAppIcon } from '../ui/BrandIcons';
import { ButtonLink } from '../ui/ButtonLink';
import { Wordmark } from '../ui/Wordmark';
import { waLink } from '../../lib/whatsapp';
import { LanguageToggle } from './LanguageToggle';
import { MegaMenu } from './MegaMenu';
import { NAV, NAV_KEY, SECTION_IDS } from './nav';

/** Sticky header; shrinks once the page scrolls. */
export function Header() {
  const { t } = useLang();
  const ui = useUI();
  const { ids } = useShortlist();
  const active = useActiveSection(SECTION_IDS);
  const compact = useScrolledPast(40);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div
        className={`container-page flex items-center justify-between gap-3 transition-[height] duration-200 ${compact ? 'h-16' : 'h-[4.75rem]'}`}
      >
        <Wordmark compact={compact} />

        <nav aria-label={t('nav.main')} className="hidden lg:block">
          <ul className="flex items-center">
            {NAV.map((id) => (
              <li key={id}>
                {id === 'projects' ? (
                  <MegaMenu active={active === id} />
                ) : (
                  <a
                    href={`#${id}`}
                    aria-current={active === id ? 'location' : undefined}
                    className={`inline-flex min-h-11 items-center px-3 font-semibold hover:text-brand-600 ${
                      active === id ? 'text-brand-800 underline decoration-gold-500 decoration-2 underline-offset-8' : 'text-ink'
                    }`}
                  >
                    {t(NAV_KEY[id])}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageToggle />
          <button
            type="button"
            onClick={() => ui.open({ kind: 'shortlist' })}
            className="relative inline-flex min-h-11 items-center gap-1.5 rounded-md border border-line px-3 font-semibold text-brand-900 hover:border-brand-700"
          >
            <Heart aria-hidden className={`size-5 ${ids.length ? 'fill-brand-800 text-brand-800' : ''}`} />
            <span className="hidden xl:inline">{t('shortlist.title')}</span>
            <span className="sr-only xl:hidden">{t('shortlist.title')}</span>
            <span aria-hidden className="tabular min-w-5 rounded-sm bg-brand-800 px-1 text-center text-xs leading-5 text-white">
              {ids.length}
            </span>
            <span className="sr-only">{t('shortlist.count', { count: ids.length })}</span>
          </button>
          <ButtonLink href={waLink(t('wa.general'))} external className="hidden px-4 lg:inline-flex">
            <WhatsAppIcon className="size-5" />
            {t('actions.whatsapp')}
          </ButtonLink>
          <button
            type="button"
            onClick={() => ui.open({ kind: 'menu' })}
            aria-expanded={ui.overlay?.kind === 'menu'}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md bg-brand-800 px-3 font-semibold text-white lg:hidden"
          >
            <Menu aria-hidden className="size-5" />
            {t('nav.menu')}
          </button>
        </div>
      </div>
    </header>
  );
}
