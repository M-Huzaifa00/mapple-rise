import { ArrowRight, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { projectTree } from '../../data/projects';
import { useLang } from '../../i18n/useLang';
import { useUI } from '../../state/ui';
import type { ProjectCard } from '../../types';

const tree = projectTree();

/**
 * Projects mega menu (desktop). Click/Enter/Space toggles, Escape closes and returns focus,
 * clicking outside or tabbing out closes. Each project opens the in-page Quick View.
 */
export function MegaMenu({ active }: { active: boolean }) {
  const { t } = useLang();
  const ui = useUI();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      button.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  const show = (p: ProjectCard) => {
    setOpen(false);
    ui.open({ kind: 'quickView', projectId: p.id });
  };
  const item = (p: ProjectCard, strong: boolean) => (
    <button
      type="button"
      onClick={() => show(p)}
      className={`flex min-h-10 items-center text-start hover:text-brand-600 hover:underline ${strong ? 'font-semibold text-brand-950' : 'text-ink-soft'}`}
    >
      <bdi>{p.name}</bdi>
    </button>
  );

  return (
    <div
      ref={wrap}
      onBlur={(e) => {
        if (!wrap.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="mega-projects"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex min-h-11 items-center gap-1 px-3 font-semibold hover:text-brand-600 ${
          active ? 'text-brand-800 underline decoration-gold-500 decoration-2 underline-offset-8' : 'text-ink'
        }`}
      >
        {t('nav.projects')}
        <ChevronDown aria-hidden className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <div id="mega-projects" hidden={!open} className="absolute inset-x-0 top-full border-y border-line bg-paper">
        {open && (
          <div className="container-page grid gap-10 py-8 lg:grid-cols-[1.4fr_1fr_auto]">
            {tree.map((group) => {
              const parents = group.items.filter((i) => i.children.length > 0);
              const singles = group.items.filter((i) => i.children.length === 0);
              return (
                <div key={group.id}>
                  <p className="eyebrow mb-3">{t(`nav.group.${group.id}`)}</p>
                  <div className={parents.length ? 'grid grid-cols-2 gap-x-10' : ''}>
                    {parents.length > 0 && (
                      <ul>
                        {parents.map(({ project, children }) => (
                          <li key={project.id}>
                            {item(project, true)}
                            <ul className="ms-1 border-s border-gold-500/50 ps-3 text-[0.95rem]">
                              {children.map((c) => (
                                <li key={c.id}>{item(c, false)}</li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    )}
                    <ul>
                      {singles.map(({ project }) => (
                        <li key={project.id}>{item(project, true)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
            <a
              href="#projects"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center gap-2 self-end font-semibold text-brand-800 hover:underline"
            >
              {t('nav.browseAll')}
              <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
