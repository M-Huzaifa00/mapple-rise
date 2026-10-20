import { Mail } from 'lucide-react';
import { DEMO_MODE } from '../../config';
import { company } from '../../data/company';
import { projectTree } from '../../data/projects';
import { useLang } from '../../i18n/useLang';
import { mailHref } from '../../lib/whatsapp';
import { useUI } from '../../state/ui';
import { ContactActions } from '../ui/ContactActions';
import { CopyPhone } from '../ui/CopyPhone';
import { SocialLinks } from '../ui/SocialLinks';
import { Wordmark } from '../ui/Wordmark';
import { NAV, NAV_KEY } from './nav';

const tree = projectTree();
/** Pages that belong to the full website, not this home-page demo. */
const LATER_PAGES = ['privacy', 'terms', 'careers', 'blog'] as const;

/** Four columns (RBS pattern): brand + contact, quick links, projects by city, more. */
export function Footer() {
  const { t } = useLang();
  const ui = useUI();
  const heading = 'eyebrow text-gold-300';
  const link = 'inline-flex min-h-11 items-center text-start hover:text-gold-300 hover:underline';

  return (
    <footer className="bg-brand-950 pb-24 text-brand-100 md:pb-0">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_1.5fr_0.8fr]">
        <div className="space-y-5">
          <Wordmark tone="light" />
          <p className="max-w-sm">{t('brand.tagline')}</p>
          <div className="space-y-1">
            <CopyPhone tone="dark" />
            <a href={mailHref} className="flex min-h-11 items-center gap-2 hover:text-gold-300">
              <Mail aria-hidden className="size-4 text-gold-300" />
              <bdi dir="ltr">{company.email}</bdi>
            </a>
          </div>
          <ContactActions tone="dark" message={t('wa.general')} className="max-w-sm" />
          <SocialLinks className="-ms-3 text-white" />
        </div>

        <nav aria-labelledby="footer-quick">
          <h2 id="footer-quick" className={heading}>
            {t('footer.quickLinks')}
          </h2>
          <ul className="mt-3">
            {NAV.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className={link}>
                  {t(NAV_KEY[id])}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-projects">
          <h2 id="footer-projects" className={heading}>
            {t('footer.projects')}
          </h2>
          <div className="mt-3 grid gap-6 sm:grid-cols-2">
            {tree.map((g) => (
              <div key={g.id}>
                <h3 className="text-sm font-semibold text-white">{t(`nav.group.${g.id}`)}</h3>
                <ul className="mt-1">
                  {g.items.map(({ project }) => (
                    <li key={project.id}>
                      <button type="button" className={link} onClick={() => ui.open({ kind: 'quickView', projectId: project.id })}>
                        <bdi>{project.name}</bdi>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        <nav aria-labelledby="footer-more">
          <h2 id="footer-more" className={heading}>
            {t('footer.more')}
          </h2>
          <ul className="mt-3">
            {LATER_PAGES.map((page) => (
              <li key={page}>
                {!DEMO_MODE && page === 'privacy' ? (
                  <a href={company.privacyUrl} className={link}>
                    {t(`footer.pages.${page}`)}
                  </a>
                ) : (
                  <button type="button" className={link} onClick={() => ui.toast(t('common.comingSoon'))}>
                    {t(`footer.pages.${page}`)}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl">{t('footer.disclaimer')}</p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {DEMO_MODE && <span className="rounded-sm border border-white/25 px-1.5 text-xs font-semibold text-brand-100">{t('footer.demo')}</span>}
            <span suppressHydrationWarning>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
