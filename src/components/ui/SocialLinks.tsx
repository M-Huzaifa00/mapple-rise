import { company } from '../../data/company';
import { useLang } from '../../i18n/useLang';
import { useUI } from '../../state/ui';
import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon } from './BrandIcons';

const LINKS = [
  { key: 'facebook', network: 'Facebook', Icon: FacebookIcon },
  { key: 'instagram', network: 'Instagram', Icon: InstagramIcon },
  { key: 'youtube', network: 'YouTube', Icon: YouTubeIcon },
  { key: 'tiktok', network: 'TikTok', Icon: TikTokIcon },
] as const;

/** MapleRise's own channels open in a new tab. A channel without a known URL shows the coming-soon toast. */
export function SocialLinks({ className = '' }: { className?: string }) {
  const { t } = useLang();
  const { toast } = useUI();
  const box = 'inline-flex size-11 items-center justify-center rounded-md transition-colors hover:bg-white/10';
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {LINKS.map(({ key, network, Icon }) => {
        const href = company.socials[key];
        const label = t('social.label', { network });
        return (
          <li key={key}>
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={box}>
                <Icon />
              </a>
            ) : (
              <button type="button" aria-label={label} className={box} onClick={() => toast(t('common.comingSoon'))}>
                <Icon />
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
