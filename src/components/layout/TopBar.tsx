
import { Clock, MapPin } from 'lucide-react';
import { OFFICE } from '../../config';
import { useLang } from '../../i18n/useLang';
import { SampleChip } from '../ui/Chips';
import { CopyPhone } from '../ui/CopyPhone';
import { OnlineStatus } from '../ui/OfficeStatus';
import { SocialLinks } from '../ui/SocialLinks';

export function TopBar() {
  const { t } = useLang();

  return (
    <div className="hidden bg-brand-950 text-brand-100 lg:block">
      <div className="container-page flex min-h-12 items-center justify-between gap-4">

        {/* LEFT: Location and hours */}
        <div className="flex min-w-0 shrink-0 items-center gap-3 2xl:gap-5">

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <MapPin
              aria-hidden="true"
              className="size-4 shrink-0 text-gold-300"
            />
            <span className="text-xs 2xl:text-sm">
              {t('contact.addressValue')}
            </span>
            {!OFFICE.addressConfirmed && (
              <span className="hidden 2xl:inline-flex">
                <SampleChip />
              </span>
            )}
          </div>

          <span className="hidden h-4 w-px bg-white/20 xl:block" />

          <div className="hidden items-center gap-1.5 whitespace-nowrap xl:flex">
            <Clock
              aria-hidden="true"
              className="size-4 shrink-0 text-gold-300"
            />
            <span className="text-xs 2xl:text-sm">
              {t('contact.hoursValue')}
            </span>
            {!OFFICE.hoursConfirmed && (
              <span className="hidden 2xl:inline-flex">
                <SampleChip />
              </span>
            )}
          </div>
        </div>

        {/* CENTER: Availability status */}
        <div className="hidden min-w-0 items-center justify-center 2xl:flex">
          <div className="whitespace-nowrap text-xs">
            <OnlineStatus tone="dark" />
          </div>
        </div>

        {/* RIGHT: Phone + socials */}
        <div className="flex shrink-0 items-center gap-3 2xl:gap-5">

          <div className="flex items-center whitespace-nowrap text-xs 2xl:text-sm [&_*]:whitespace-nowrap">
            <CopyPhone tone="dark" />
          </div>

          <span className="h-5 w-px shrink-0 bg-white/20" />

          <div className="flex shrink-0 items-center whitespace-nowrap [&_a]:inline-flex [&_a]:shrink-0">
            <SocialLinks className="text-white" />
          </div>

        </div>
      </div>
    </div>
  );
}
