import { Copy } from 'lucide-react';
import { company } from '../../data/company';
import { useLang } from '../../i18n/useLang';
import { useUI } from '../../state/ui';

/** Phone number as a tel: link plus a copy button (handy for overseas buyers dialling from another app). */
export function CopyPhone({ tone = 'light', className = '' }: { tone?: 'light' | 'dark'; className?: string }) {
  const { t } = useLang();
  const { toast } = useUI();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(company.phoneE164);
      toast(t('common.copied', { value: company.phoneDisplay }));
    } catch {
      toast(t('common.copyFailed'));
    }
  };
  const link = tone === 'dark' ? 'text-white hover:text-gold-300' : 'text-brand-900 hover:text-brand-600';
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <a href={`tel:${company.phoneE164}`} className={`inline-flex min-h-11 items-center font-semibold ${link}`}>
        <bdi dir="ltr" className="tabular">
          {company.phoneDisplay}
        </bdi>
      </a>
      <button
        type="button"
        onClick={copy}
        className={`inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-sm font-semibold ${
          tone === 'dark' ? 'text-gold-300 hover:bg-white/10' : 'text-brand-800 hover:bg-brand-50'
        }`}
      >
        <Copy aria-hidden className="size-4" />
        {t('actions.copyNumber')}
      </button>
    </span>
  );
}
