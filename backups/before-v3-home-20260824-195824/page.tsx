import Hero from '@/components/home/Hero';
import Stats from '@/components/home/Stats';
import Categories from '@/components/home/Categories';
import HowItWorks from '@/components/home/HowItWorks';
import CTA from '@/components/home/CTA';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Stats />
      <Categories />
      <HowItWorks />
      <CTA />
    </main>
  );
}
