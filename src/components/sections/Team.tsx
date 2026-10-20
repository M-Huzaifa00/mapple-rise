import { ChevronDown } from 'lucide-react';
import { leaders, team } from '../../data/team';
import { useLang } from '../../i18n/useLang';
import { SampleChip } from '../ui/Chips';
import { Img } from '../ui/Img';
import { SectionHeading } from '../ui/SectionHeading';

/** RBS "Visionary Leaders" pattern: portraits with name and role, then the wider team. */
export function Team() {
  const { t } = useLang();
  return (
    <section id="team" aria-labelledby="team-title" className="bg-paper py-20 lg:py-24">
      <div className="container-page">
        <SectionHeading id="team-title" layout="split" eyebrow={t('team.eyebrow')} title={t('team.title')} intro={t('team.intro')} />

        {leaders.length === 0 ? (
          <p>
            {t('team.empty')} <SampleChip />
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {leaders.map((m) => (
              <li key={m.id}>
                {m.image && (
                  <Img image={m.image} alt={t('team.photoAlt', { name: m.name, role: t(`data.team.${m.id}.role`) })} className="aspect-[4/5] w-full rounded-md" />
                )}
                <h3 className="mt-4 text-2xl leading-tight">
                  <bdi>{m.name}</bdi>
                </h3>
                <p className="mt-1 text-sm font-bold tracking-wide text-gold-700 uppercase">{t(`data.team.${m.id}.role`)}</p>
                <p className="mt-2 text-[0.95rem] text-ink-soft">{t(`data.team.${m.id}.bio`)}</p>
              </li>
            ))}
          </ul>
        )}

        <details className="group mt-12 border-y border-line">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 font-semibold text-brand-950">
            {t('team.wider', { count: team.length })}
            <ChevronDown aria-hidden className="size-5 transition-transform group-open:rotate-180" />
          </summary>
          <ul className="grid gap-x-6 gap-y-3 pb-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <li key={m.id}>
                <bdi className="font-semibold text-brand-950">{m.name}</bdi>
                <span className="block text-sm text-ink-mute">{t(`data.team.${m.id}.role`)}</span>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
