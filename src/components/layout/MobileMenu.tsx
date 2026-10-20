import { ChevronDown, X } from 'lucide-react';
import type { MouseEvent } from 'react';
import { projectTree } from '../../data/projects';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useLang } from '../../i18n/useLang';
import { goToSection, useUI } from '../../state/ui';
import { ContactActions } from '../ui/ContactActions';
import { LanguageToggle } from './LanguageToggle';
import { NAV, NAV_KEY, SECTION_IDS } from './nav';

const tree = projectTree();

/** Full-screen phone menu (rendered inside the overlay Dialog). Big tap targets. */
export function MobileMenu() {
  const { t } = useLang();
  const ui = useUI();
  const active = useActiveSection(SECTION_IDS);
  const link = 'flex min-h-14 w-full items-center px-1 text-xl font-semibold';

  // Close (Back pops the menu's history entry), then scroll ourselves so the jump isn't undone.
  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    ui.close({ restoreFocus: false });
    window.setTimeout(() => goToSection(id), 60);
  };

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <h2 id="menu-title" className="text-2xl">
          {t('nav.menu')}
        </h2>
        <button
          type="button"
          onClick={() => ui.close()}
          className="inline-flex min-h-12 items-center gap-1.5 rounded-md px-3 font-semibold text-brand-900 hover:bg-sand"
        >
          <X aria-hidden className="size-6" />
          {t('common.close')}
        </button>
      </div>

      <nav aria-label={t('nav.mobile')} className="flex-1 px-4 py-3">
        <ul className="divide-y divide-line">
          {NAV.map((id) =>
            id === 'projects' ? (
              <li key={id}>
                <details className="group">
                  <summary className={`${link} cursor-pointer list-none justify-between text-brand-950`}>
                    {t(NAV_KEY[id])}
                    <ChevronDown aria-hidden className="size-6 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="space-y-4 pb-4">
                    {tree.map((group) => (
                      <div key={group.id}>
                        <p className="eyebrow mb-1">{t(`nav.group.${group.id}`)}</p>
                        <ul>
                          {group.items.map(({ project, children }) => (
                            <li key={project.id}>
                              <button
                                type="button"
                                onClick={() => ui.open({ kind: 'quickView', projectId: project.id })}
                                className="flex min-h-12 w-full items-center text-start text-lg font-medium text-brand-950"
                              >
                                <bdi>{project.name}</bdi>
                              </button>
                              {children.length > 0 && (
                                <ul className="ms-1 border-s border-gold-500/50 ps-3">
                                  {children.map((c) => (
                                    <li key={c.id}>
                                      <button
                                        type="button"
                                        onClick={() => ui.open({ kind: 'quickView', projectId: c.id })}
                                        className="flex min-h-12 w-full items-center text-start text-ink-soft"
                                      >
                                        <bdi>{c.name}</bdi>
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </details>
              </li>
            ) : (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => go(e, id)}
                  aria-current={active === id ? 'location' : undefined}
                  className={`${link} ${active === id ? 'text-brand-600' : 'text-brand-950'}`}
                >
                  {t(NAV_KEY[id])}
                </a>
              </li>
            ),
          )}
        </ul>
      </nav>

      <div className="grid gap-3 border-t border-line p-4">
        <LanguageToggle className="w-full" />
        <ContactActions message={t('wa.general')} />
      </div>
    </div>
  );
}
