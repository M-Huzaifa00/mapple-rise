import { Suspense, lazy, useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { BackToTop, FloatingWhatsApp, MobileBottomBar } from './components/layout/GlobalCtas';
import { Header } from './components/layout/Header';
import { TopBar } from './components/layout/TopBar';
import { Hero } from './components/sections/Hero';
import { Toaster } from './components/ui/Toaster';
import { savedLanguage, setLanguage } from './i18n';
import { useLang } from './i18n/useLang';
import { EMPTY_FILTERS, type ProjectFilters } from './lib/filters';
import { filtersFromSearch, filtersToSearch } from './lib/urlState';
import { Providers } from './state/Providers';
import { goToSection, useUI } from './state/ui';
import { DemoBanner } from './components/layout/DemoBanner';

// Below-the-fold sections share one lazy chunk (see belowFold.ts). The prerendered HTML already
// contains them, so they are visible immediately and hydrate in small tasks once the chunk loads.
type BelowFold = typeof import('./components/sections/belowFold');
const loadBelowFold = () => import('./components/sections/belowFold');
/** Lazy wrapper for the prop-less sections. */
function section(name: Exclude<keyof BelowFold, 'FeaturedProjects'>) {
  return lazy(() => loadBelowFold().then((m): { default: ComponentType } => ({ default: m[name] })));
}
const About = section('About');
const FeaturedProjects = lazy(() => loadBelowFold().then((m) => ({ default: m.FeaturedProjects })));
const PaymentPlans = section('PaymentPlans');
const CscSpotlight = section('CscSpotlight');
const WhyChooseUs = section('WhyChooseUs');
const HowWeWork = section('HowWeWork');
const Services = section('Services');
const Team = section('Team');
const QuoteBanner = section('QuoteBanner');
const Guides = section('Guides');
const Testimonials = section('Testimonials');
const Contact = section('Contact');
const Footer = section('Footer');

// Quick View, menu, overseas panel, guide preview and shortlist: client-only, loaded on idle.
const loadOverlays = () => import('./components/overlays/OverlayHost');
const OverlayHost = lazy(loadOverlays);

const Lazy = ({ children }: { children: ReactNode }) => <Suspense fallback={null}>{children}</Suspense>;

function SkipLink() {
  const { t } = useLang();
  return (
    <a
      href="#main"
      className="sr-only z-50 rounded-md bg-brand-800 px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
    >
      {t('common.skip')}
    </a>
  );
}

function Page() {
  const ui = useUI();
  const [filters, setFilters] = useState<ProjectFilters>(EMPTY_FILTERS);
  const [overlaysReady, setOverlaysReady] = useState(false);
  const fromUrl = useRef(false);

  // After hydration: restore language, read shared filters from the URL, prefetch overlays.
  useEffect(() => {
    const lang = savedLanguage();
    if (lang) void setLanguage(lang);
    const initial = filtersFromSearch(window.location.search);
    fromUrl.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time post-hydration restore
    setFilters(initial);
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    idle(() => void loadOverlays());
  }, []);

  // Keep filters in the URL so a filtered view can be shared.
  useEffect(() => {
    if (!fromUrl.current) return;
    const url = `${window.location.pathname}${filtersToSearch(filters)}${window.location.hash}`;
    history.replaceState(history.state, '', url);
  }, [filters]);

  // Mount overlays the first time one is requested (or after idle prefetch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount once, then keep
    if (ui.overlay && !overlaysReady) setOverlaysReady(true);
  }, [ui.overlay, overlaysReady]);

  const search = useCallback((f: ProjectFilters) => {
    setFilters(f);
    goToSection('projects', 'projects-title');
  }, []);

  return (
    <>
      <DemoBanner/>
      <SkipLink />
      {/* RBS 1–2: top info bar, header with menus */}
      
<div className="pt-8 md:pt-9">
  <TopBar />
  <Header />
</div>
      <main id="main">
        {/* RBS 3–4: hero + lead form (+ search panel upgrade) */}
        <Hero onSearch={search} />
        {/* RBS 5: about + 4 counters */}
        <Lazy><About /></Lazy>
        {/* RBS 6–7: signature + marketed projects → one filterable grid */}
        <Lazy><FeaturedProjects filters={filters} onFiltersChange={setFilters} /></Lazy>
        {/* RBS "Payment Plan" menu → installment calculator */}
        <Lazy><PaymentPlans /></Lazy>
        {/* RBS 8: Smart Facilities → Capital Smart City districts */}
        <Lazy><CscSpotlight /></Lazy>
        {/* MapleRise content with no RBS equivalent, kept from the MapleRise home page */}
        <Lazy><WhyChooseUs /></Lazy>
        <Lazy><HowWeWork /></Lazy>
        <Lazy><Services /></Lazy>
        {/* RBS 9: Visionary Leaders → team */}
        <Lazy><Team /></Lazy>
        {/* RBS 10: quote banner */}
        <Lazy><QuoteBanner /></Lazy>
        {/* RBS 11: News & Events → buyer guides */}
        <Lazy><Guides /></Lazy>
        {/* RBS 12: reviews */}
        <Lazy><Testimonials /></Lazy>
        {/* RBS 13: request a call back (+ site visit booking) */}
        <Lazy><Contact /></Lazy>
      </main>
      {/* RBS 14: footer */}
      <Lazy><Footer /></Lazy>
      <FloatingWhatsApp />
      <BackToTop />
      <MobileBottomBar />
      <Toaster />
      {overlaysReady && (
        <Lazy>
          <OverlayHost />
        </Lazy>
      )}
    </>
  );
}

/** Section order follows RBS_REFERENCE.md (RBS layout, MapleRise content). */
export default function App() {
  return (
    <Providers>
      <Page />
    </Providers>
  );
}
