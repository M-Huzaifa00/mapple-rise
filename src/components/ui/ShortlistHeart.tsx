import { Heart } from 'lucide-react';
import { useLang } from '../../i18n/useLang';
import { useShortlist, useUI } from '../../state/ui';
import type { ProjectCard } from '../../types';

/** Save/unsave a project. State is in localStorage; the header badge shows the count. */
export function ShortlistHeart({ project, className = '', withLabel = false }: { project: ProjectCard; className?: string; withLabel?: boolean }) {
  const { t } = useLang();
  const { has, toggle } = useShortlist();
  const { toast } = useUI();
  const saved = has(project.id);
  const label = saved ? t('shortlist.remove', { name: project.name }) : t('shortlist.add', { name: project.name });

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={withLabel ? undefined : label}
      onClick={() => toast(toggle(project.id) ? t('shortlist.addedToast', { name: project.name }) : t('shortlist.removedToast', { name: project.name }))}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md text-brand-900 transition-colors ${
        withLabel ? 'border border-line bg-white px-4 font-semibold hover:border-brand-700' : 'bg-white/95 hover:bg-white'
      } ${className}`}
    >
      <Heart aria-hidden className={`size-5 ${saved ? 'fill-[#b4232c] text-[#b4232c]' : ''}`} />
      {withLabel && (saved ? t('shortlist.saved') : t('shortlist.save'))}
    </button>
  );
}
