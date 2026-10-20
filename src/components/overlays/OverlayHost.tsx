import { useUI } from '../../state/ui';
import { MobileMenu } from '../layout/MobileMenu';
import { Dialog } from '../ui/Dialog';
import { GuidePreview } from './GuidePreview';
import { OverseasPanel } from './OverseasPanel';
import { QuickView } from './QuickView';
import { ShortlistDrawer } from './ShortlistDrawer';

/** All overlays, lazy-loaded as one chunk. One is open at a time; Back, Esc and swipe-down close it. */
export default function OverlayHost() {
  const ui = useUI();
  const o = ui.overlay;
  const shared = { onRequestClose: () => ui.close(), restoreFocus: ui.restoreFocus };
  return (
    <>
      <Dialog open={o?.kind === 'menu'} variant="full" labelledBy="menu-title" {...shared}>
        <MobileMenu />
      </Dialog>
      <Dialog open={o?.kind === 'quickView'} labelledBy="qv-title" {...shared}>
        {o?.kind === 'quickView' && <QuickView key={o.projectId} projectId={o.projectId} />}
      </Dialog>
      <Dialog open={o?.kind === 'overseas'} labelledBy="overseas-title" {...shared}>
        <OverseasPanel />
      </Dialog>
      <Dialog open={o?.kind === 'guide'} labelledBy="guide-title" {...shared}>
        {o?.kind === 'guide' && <GuidePreview guideId={o.guideId} />}
      </Dialog>
      <Dialog open={o?.kind === 'shortlist'} variant="side" labelledBy="shortlist-title" {...shared}>
        <ShortlistDrawer />
      </Dialog>
    </>
  );
}
