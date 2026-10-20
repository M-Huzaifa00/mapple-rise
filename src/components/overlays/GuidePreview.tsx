import type { GuideId } from '../../data/samples';
import { useLang } from '../../i18n/useLang';
import { useUI } from '../../state/ui';
import { SampleChip } from '../ui/Chips';
import { ContactActions } from '../ui/ContactActions';
import { OverlayHeader } from './OverlayHeader';

/** Short in-page preview of a guide (Sample text) with the coming-soon note. */
export function GuidePreview({ guideId }: { guideId: GuideId }) {
  const { t } = useLang();
  const ui = useUI();
  const raw: unknown = t(`data.guides.${guideId}.body`, { returnObjects: true });
  const paragraphs = Array.isArray(raw) ? (raw as string[]) : [];
  const title = t(`data.guides.${guideId}.title`);

  return (
    <div className="mx-auto max-w-2xl">
      <OverlayHeader id="guide-title" title={title} sub={<SampleChip />} onClose={() => ui.close()} />
      <div className="space-y-4 p-5 text-lg sm:p-6">
        {paragraphs.map((para) => (
          <p key={para}>{para}</p>
        ))}
        <p className="border-s-2 border-gold-500 ps-4 text-base text-ink-soft">{t('guides.comingSoonNote')}</p>
        <ContactActions message={t('wa.guide', { title })} className="max-w-md pt-2" />
      </div>
    </div>
  );
}
