import { HeroSection } from '../components/home/hero-section';
import { EventTicker } from '../components/home/event-ticker';
import { SportCategories } from '../components/home/sport-categories';
import { QuickStats } from '../components/home/quick-stats';
import { FeaturedEvents } from '../components/home/featured-events';

export default function HomePage() {
  return (
    <>
      <EventTicker />
      <HeroSection />
      <QuickStats />
      <FeaturedEvents />
      <SportCategories />
    </>
  );
}