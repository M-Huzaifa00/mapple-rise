import { Heart, Trash2 } from 'lucide-react';
import { projectById } from '../../data/projects';
import { useLang } from '../../i18n/useLang';
import { installmentSummary } from '../../lib/plans';
import { waLink } from '../../lib/whatsapp';
import { useShortlist, useUI } from '../../state/ui';
import { WhatsAppIcon } from '../ui/BrandIcons';
import { ButtonLink } from '../ui/ButtonLink';
import { Img } from '../ui/Img';
import { OverlayHeader } from './OverlayHeader';

/** Saved projects; one tap sends the whole list on WhatsApp. */
export function ShortlistDrawer() {
  const { t, money } = useLang();
  const ui = useUI();
  const { ids, remove, clear } = useShortlist();
  const items = ids.map((id) => projectById(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  const lines = items.map((p) => {
    const s = installmentSummary(p.id);
    return s.bookingFrom !== undefined
      ? t('wa.shortlistLineBooking', { name: p.name, amount: money(s.bookingFrom, 'short') })
      : t('wa.shortlistLine', { name: p.name });
  });
  const message = [t('wa.shortlistIntro'), ...lines].join('\n');

  return (
    <div className="flex min-h-full flex-col">
      <OverlayHeader id="shortlist-title" title={t('shortlist.title')} sub={t('shortlist.count', { count: items.length })} onClose={() => ui.close()} />
      {items.length === 0 ? (
        <div className="flex-1 p-6">
          <Heart aria-hidden className="size-8 text-brand-700" />
          <p className="mt-3 text-lg">{t('shortlist.empty')}</p>
        </div>
      ) : (
        <ul className="flex-1 divide-y divide-line px-5 sm:px-6">
          {items.map((p) => {
            const s = installmentSummary(p.id);
            return (
              <li key={p.id} className="flex items-center gap-4 py-4">
                <Img image={p.images[0]} alt="" className="aspect-[4/3] w-24 shrink-0 rounded-sm" />
                <div className="min-w-0 flex-1">
                  <button type="button" onClick={() => ui.open({ kind: 'quickView', projectId: p.id })} className="text-start font-display text-xl leading-tight text-brand-950 hover:underline">
                    <bdi>{p.name}</bdi>
                  </button>
                  <p className="text-sm text-ink-mute">
                    {s.bookingFrom !== undefined ? (
                      <>
                        {t('projects.bookingFrom')} <bdi className="tabular">{money(s.bookingFrom, 'short')}</bdi>
                      </>
                    ) : (
                      t(`cities.${p.city}`)
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  aria-label={t('shortlist.remove', { name: p.name })}
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-line text-ink-soft hover:border-brand-700"
                >
                  <Trash2 aria-hidden className="size-5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {items.length > 0 && (
        <div className="sticky bottom-0 space-y-2 border-t border-line bg-paper p-5 sm:p-6">
          <ButtonLink href={waLink(message)} external className="w-full">
            <WhatsAppIcon className="size-5" />
            {t('shortlist.send')}
          </ButtonLink>
          <button type="button" onClick={clear} className="min-h-11 w-full font-semibold text-ink-soft underline underline-offset-4">
            {t('shortlist.clear')}
          </button>
        </div>
      )}
    </div>
  );
}
