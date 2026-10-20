import { Video } from 'lucide-react';
import { useLang } from '../../i18n/useLang';
import { goToSection, useUI } from '../../state/ui';
import { buttonStyles } from '../ui/buttonStyles';
import { ContactActions } from '../ui/ContactActions';
import { OfficeClock, OnlineStatus } from '../ui/OfficeStatus';
import { OverlayHeader } from './OverlayHeader';

const list = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);

/** Remote booking steps and documents, from MapleRise's own booking procedure. */
export function OverseasPanel() {
  const { t } = useLang();
  const ui = useUI();
  const steps = list(t('overseas.steps', { returnObjects: true }));
  const docs = list(t('overseas.docs', { returnObjects: true }));

  const bookCall = () => {
    ui.close({ restoreFocus: false });
    ui.requestVisit('virtual');
    window.setTimeout(() => goToSection('contact', 'contact-title'), 60);
  };

  return (
    <div>
      <OverlayHeader id="overseas-title" title={t('overseas.title')} sub={<OfficeClock />} onClose={() => ui.close()} />
      <div className="grid gap-8 p-5 sm:p-6 md:grid-cols-2">
        <div>
          <p className="text-lg text-ink-soft">{t('overseas.intro')}</p>
          <h3 className="mt-6 text-xl">{t('overseas.stepsTitle')}</h3>
          <ol className="mt-3 space-y-3">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className="tabular grid size-7 shrink-0 place-items-center rounded-sm bg-brand-800 text-sm font-bold text-white">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="text-xl">{t('overseas.docsTitle')}</h3>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {docs.map((d) => (
              <li key={d} className="py-2.5">
                {d}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-mute">{t('overseas.note')}</p>
          <button type="button" onClick={bookCall} className={`${buttonStyles.primary} mt-6 w-full`}>
            <Video aria-hidden className="size-5" />
            {t('overseas.videoCall')}
          </button>
          <ContactActions message={t('wa.overseas')} className="mt-2" />
          <OnlineStatus className="mt-2" />
        </div>
      </div>
    </div>
  );
}
