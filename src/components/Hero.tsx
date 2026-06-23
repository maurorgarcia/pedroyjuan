import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    badge: 'Nuevos ingresos',
    title: 'Royal Canin y Eukanuba',
    subtitle: 'Las mejores marcas de alimento premium para tu mascota',
    cta: 'Ver alimentos',
    link: '/perros/alimentos',
    image: '/banner1.jpg',
  },
  {
    badge: '30% OFF',
    title: 'Hasta 30% de descuento en accesorios',
    subtitle: 'Juguetes, correas, camas y más. Solo por tiempo limitado',
    cta: 'Ver accesorios',
    link: '/perros/accesorios',
    image: '/banner2.jpg',
  },
  {
    badge: 'Higiene y salud',
    title: 'Shampoos y productos veterinarios',
    subtitle: 'Cuidado profesional para el bienestar de tu mascota',
    cta: 'Ver higiene',
    link: '/perros/higiene',
    image: '/banner3.jpg',
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), []);
  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className="relative overflow-hidden bg-gray-900">
      <div className="relative w-full aspect-[2.4/1] sm:aspect-[2.8/1] min-h-[300px] max-h-[460px]">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/45 to-gray-900/10" />

            <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="max-w-lg animate-fade-in" key={current}>
                <span className="inline-block bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  {slide.badge}
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight mb-3 sm:mb-4 text-white">
                  {slide.title}
                </h1>
                <p className="text-white/75 text-sm sm:text-base lg:text-lg mb-6 leading-relaxed">
                  {slide.subtitle}
                </p>
                <Link
                  to={slide.link}
                  className="btn-primary"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        aria-label="Slide anterior"
        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/25 backdrop-blur text-white w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        aria-label="Slide siguiente"
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/25 backdrop-blur text-white w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Ir al slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              i === current ? 'bg-white w-7' : 'bg-white/40 w-1.5'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
