import { stats } from '../../data/company';
import { useCountUp } from '../../hooks/useCountUp';
import { useLang } from '../../i18n/useLang';
import { goToSection } from '../../state/ui';
import type { Stat } from '../../types';
import { buttonStyles } from '../ui/buttonStyles';
import { SampleChip } from '../ui/Chips';
import { Img } from '../ui/Img';

/** Final value is rendered (and prerendered); counting up is an enhancement only. */
function StatItem({ stat }: { stat: Stat }) {
  const { t } = useLang();
  const { ref, value } = useCountUp<HTMLParagraphElement>(stat.value ?? 0);
  return (
    <li className="border-line py-6 ps-0 not-first:border-s not-first:ps-6 max-lg:nth-3:border-s-0 max-lg:nth-3:ps-0 lg:py-2">
      <p ref={ref} className="tabular font-display text-5xl leading-none text-brand-800">
        <bdi>{stat.value !== undefined ? `${value}${stat.suffix ?? ''}` : t(`about.stats.${stat.id}.value`)}</bdi>
      </p>
      <p className="mt-3 text-[0.95rem] text-ink-soft">{t(`about.stats.${stat.id}.label`)}</p>
      {stat.sample && <SampleChip className="mt-2" />}
    </li>
  );
}

/** RBS "About" block as an editorial split: photo left, MapleRise's own words right, then a stat strip. */
export function About() {
  const { t } = useLang();
  return (
    <section id="about" aria-labelledby="about-title" className="bg-paper py-20 lg:py-28">
      <div className="container-page grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-0">
        <div className="lg:col-span-6">
          <Img image="site/about" alt={t('about.imageAlt')} className="aspect-[4/3] w-full rounded-md" />
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <p className="eyebrow">{t('about.eyebrow')}</p>
          <h2 id="about-title" tabIndex={-1} className="h-section mt-3 outline-none">
            {t('about.title')}
          </h2>
          <p className="mt-6 text-lg">{t('about.p1')}</p>
          <p className="mt-4 text-ink-soft">{t('about.p2')}</p>
          <button type="button" onClick={() => goToSection('contact', 'contact-title')} className={`${buttonStyles.primary} mt-8`}>
            {t('actions.freeConsultation')}
          </button>
        </div>
      </div>
      <ul className="container-page mt-16 grid grid-cols-2 border-t border-line pt-4 lg:mt-20 lg:grid-cols-4 lg:pt-10">
        {stats.map((s) => (
          <StatItem key={s.id} stat={s} />
        ))}
      </ul>
    </section>
  );
}
