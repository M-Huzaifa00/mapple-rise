/**
 * Everything below the hero, loaded as one lazy chunk. Each section still gets its own
 * <Suspense> boundary in App.tsx so React hydrates them as separate small tasks.
 */
export { About } from './About';
export { Contact } from './Contact';
export { CscSpotlight } from './CscSpotlight';
export { FeaturedProjects } from './FeaturedProjects';
export { Guides } from './Guides';
export { HowWeWork } from './HowWeWork';
export { PaymentPlans } from './PaymentPlans';
export { QuoteBanner } from './QuoteBanner';
export { Services } from './Services';
export { Team } from './Team';
export { Testimonials } from './Testimonials';
export { WhyChooseUs } from './WhyChooseUs';
export { Footer } from '../layout/Footer';
