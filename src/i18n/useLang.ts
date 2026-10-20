import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPKR, type PKRFormat } from '../lib/currency';
import { formatSize } from '../lib/sizes';
import type { Lang } from './index';

/** Translation + locale-aware formatters. */
export function useLang() {
  const { t, i18n } = useTranslation();
  const lang: Lang = i18n.language === 'ur' ? 'ur' : 'en';

  const money = useCallback(
    (amount: number, format: PKRFormat = 'full') => formatPKR(amount, format, (unit, n) => t(`money.${unit}`, { n })),
    [t],
  );
  const size = useCallback((s: string) => formatSize(s, (word) => t(`units.${word}`)), [t]);
  const date = useCallback(
    (iso: string) =>
      new Intl.DateTimeFormat(lang === 'ur' ? 'ur-PK-u-nu-latn' : 'en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(`${iso}T00:00:00Z`)),
    [lang],
  );

  return { t, lang, dir: lang === 'ur' ? ('rtl' as const) : ('ltr' as const), money, size, date };
}
