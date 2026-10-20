import { steps } from '../../data/howWeWork';
import { useLang } from '../../i18n/useLang';
import { SectionHeading } from '../ui/SectionHeading';

/** Four steps on a hairline: horizontal from md up, vertical on phones. */
export function HowWeWork() {
  const { t } = useLang();
  return (
    <section id="how" aria-labelledby="how-title" className="border-y border-line bg-sand py-16 lg:py-20">
      <div className="container-page">
        <SectionHeading id="how-title" layout="split" eyebrow={t('how.eyebrow')} title={t('how.title')} intro={t('how.intro')} />
        <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
          <span aria-hidden className="absolute start-[1.1rem] top-2 bottom-2 w-px bg-brand-800/30 md:start-0 md:end-0 md:top-[1.1rem] md:bottom-auto md:h-px md:w-auto" />
          {steps.map((id, i) => (
            <li key={id} className="relative flex gap-4 md:block">
              <span className="tabular relative z-10 grid size-9 shrink-0 place-items-center rounded-sm bg-brand-800 text-sm font-bold text-white">
                {i + 1}
              </span>
              <div className="md:mt-5">
                <h3 className="text-xl leading-tight">{t(`data.steps.${id}.title`)}</h3>
                <p className="mt-1 text-ink-soft">{t(`data.steps.${id}.body`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
