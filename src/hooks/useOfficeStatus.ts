import { useEffect, useState } from 'react';
import { useLang } from '../i18n/useLang';
import { officeStatus, type OfficeStatus } from '../lib/officeHours';

/** Live office status in PKT. Null until mounted (time-dependent), so prerendered HTML stays stable. */
export function useOfficeStatus(): OfficeStatus | null {
  const { lang } = useLang();
  const [status, setStatus] = useState<OfficeStatus | null>(null);
  useEffect(() => {
    const locale = lang === 'ur' ? 'ur-PK-u-nu-latn' : 'en-US';
    const tick = () => setStatus(officeStatus(new Date(), locale));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [lang]);
  return status;
}
