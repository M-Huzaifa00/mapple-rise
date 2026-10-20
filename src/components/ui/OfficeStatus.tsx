import { useOfficeStatus } from '../../hooks/useOfficeStatus';
import { useLang } from '../../i18n/useLang';

/** "We're online now" / "We'll reply at 10 AM PKT", from the office clock in Asia/Karachi. */
export function OnlineStatus({ tone = 'light', className = '' }: { tone?: 'light' | 'dark'; className?: string }) {
  const { t } = useLang();
  const s = useOfficeStatus();
  const text = tone === 'dark' ? 'text-brand-100' : 'text-ink-soft';
  return (
    <p className={`flex min-h-6 items-center gap-2 text-sm ${text} ${className}`}>
      {s && (
        <>
          <span aria-hidden className={`size-2 shrink-0 rounded-full ${s.open ? 'bg-[#3fb171]' : 'bg-gold-500'}`} />
          {s.open
            ? t('status.online')
            : s.opensLaterDay
              ? t('status.offlineNextDay', { time: s.opensAt })
              : t('status.offline', { time: s.opensAt })}
        </>
      )}
    </p>
  );
}

/** "Office time: 3:42 PM PKT" for overseas buyers. */
export function OfficeClock({ className = '' }: { className?: string }) {
  const { t } = useLang();
  const s = useOfficeStatus();
  return <span className={`inline-block min-h-6 ${className}`}>{s && t('status.officeTime', { time: s.time })}</span>;
}
