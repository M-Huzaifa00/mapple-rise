import { ArrowRight } from 'lucide-react';
import { guides } from '../../data/samples';
import { useLang } from '../../i18n/useLang';
import { useUI } from '../../state/ui';
import { SampleChip } from '../ui/Chips';
import { iconFor } from '../ui/icons';

/** RBS "News & Events" as a compact text row. Each guide opens an in-page preview (Sample content). */
export function Guides() {
  const { t } = useLang();
  const ui = useUI();
  return (
    <section id="guides" aria-labelledby="guides-title" className="bg-white py-14 lg:py-16">
      <div className="container-page">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{t('guides.eyebrow')}</p>
            <h2 id="guides-title" className="mt-3 text-3xl sm:text-4xl">
              {t('guides.title')} <SampleChip className="ms-1" />
            </h2>
          </div>
          <button
            type="button"
            onClick={() => ui.toast(t('common.comingSoon'))}
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand-800 underline decoration-gold-500 decoration-2 underline-offset-4"
          >
            {t('guides.all')}
            <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
          </button>
        </div>
        <ul className="grid border-t border-line md:grid-cols-3 md:divide-x md:divide-line rtl:md:divide-x-reverse">
          {guides.map((g) => {
            const Icon = iconFor(g.icon);
            return (
              <li key={g.id} className="flex flex-col border-b border-line py-6 md:border-b-0 md:px-6 md:first:ps-0 md:last:pe-0">
                <Icon aria-hidden className="size-5 text-gold-700" />
                <h3 className="mt-3 text-xl leading-snug">{t(`data.guides.${g.id}.title`)}</h3>
                <p className="mt-2 flex-1 text-[0.95rem] text-ink-soft">{t(`data.guides.${g.id}.excerpt`)}</p>
                <button
                  type="button"
                  onClick={() => ui.open({ kind: 'guide', guideId: g.id })}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 self-start font-semibold text-brand-800 hover:text-brand-600"
                >
                  {t('guides.preview')}
                  <span className="sr-only">: {t(`data.guides.${g.id}.title`)}</span>
                  <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
