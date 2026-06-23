import Hero from '../components/Hero';
import Features from '../components/Features';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import FaqAccordion from '../components/FaqAccordion';
import JsonLd from '../components/JsonLd';
import { usePageMeta } from '../hooks/usePageMeta';
import { BUSINESS } from '../lib/business';

export default function HomePage() {
  usePageMeta({
    title: 'Inicio',
    description: `${BUSINESS.tagline} Retiro en local en San Nicolás de los Arroyos.`,
  });

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'PetStore',
          name: BUSINESS.name,
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Bartolomé Mitre 360',
            addressLocality: 'San Nicolás de Los Arroyos',
            addressRegion: 'Buenos Aires',
            addressCountry: 'AR',
          },
          url: typeof window !== 'undefined' ? window.location.origin : '',
          telephone: BUSINESS.phones[0].tel,
          openingHours: 'Mo-Sa 08:30-13:00,16:30-20:00',
        }}
      />
      <Hero />
      <Categories />
      <Features />
      <FeaturedProducts />
      <About />
      <Testimonials />
      <FaqAccordion />
      <Contact />
    </>
  );
}
