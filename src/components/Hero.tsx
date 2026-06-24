import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Store, ShieldCheck, Award } from 'lucide-react';

const slides = [
  {
    badge: 'Hasta 30% OFF',
    title: 'Hasta 30% de descuento en accesorios',
    subtitle: 'Las mejores marcas y todo lo que necesitás para tu mascota.',
    cta: 'Ver accesorios',
    link: '/productos?categoria=accesorios',
    image: 'https://images.unsplash.com/photo-1623387641168-d9803dba3f35?auto=compress&cs=tinysrgb&w=800',
    features: [
      { icon: Store, title: 'Retirá en el local', desc: 'Rápido y gratis' },
      { icon: ShieldCheck, title: 'Compra segura', desc: 'Protegemos tus datos' },
      { icon: Award, title: 'Productos de calidad', desc: 'Elegidos para su bienestar' },
    ]
  },
  {
    badge: 'Novedades',
    title: 'Alimentos Premium para tu mascota',
    subtitle: 'Nutrición de alta calidad con Royal Canin, Eukanuba y más.',
    cta: 'Ver alimentos',
    link: '/productos?categoria=alimentos',
    image: 'https://images.unsplash.com/photo-1589748438579-c483f2d48580?auto=compress&cs=tinysrgb&w=800',
    features: [
      { icon: Store, title: 'Retirá en el local', desc: 'Rápido y gratis' },
      { icon: ShieldCheck, title: 'Compra segura', desc: 'Protegemos tus datos' },
      { icon: Award, title: 'Marcas certificadas', desc: 'Nutrición premium' },
    ]
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), []);
  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group">
        
        {/* Slider Box */}
        <div className="bg-[#F4EFFF] rounded-[2.5rem] p-8 md:p-12 lg:px-16 lg:py-12 flex flex-col md:flex-row items-center justify-between gap-8 min-h-[420px] transition-all duration-500 relative overflow-hidden">
          
          {/* Left Column (Text and Action) */}
          <div className="w-full md:w-1/2 flex flex-col items-start z-10 animate-fade-in" key={current}>
            <span className="inline-block bg-[#5c3e98] text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6">
              {slide.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2a174d] leading-tight mb-4 tracking-tight">
              {slide.title}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-8 leading-relaxed max-w-md">
              {slide.subtitle}
            </p>

            {/* Micro-Features */}
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 w-full mb-8">
              {slide.features.map((feat, idx) => {
                const FeatIcon = feat.icon;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#e9e1f8] text-[#5c3e98] flex items-center justify-center flex-shrink-0">
                      <FeatIcon size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-[11px] leading-tight">{feat.title}</p>
                      <p className="text-[10px] text-gray-500 leading-tight">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              to={slide.link}
              className="inline-flex items-center justify-center bg-[#5c3e98] hover:bg-[#4b3180] text-white text-sm font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-[#5c3e98]/10 group-hover:shadow-lg"
            >
              {slide.cta} →
            </Link>
          </div>

          {/* Right Column (Collage Image) */}
          <div className="w-full md:w-1/2 flex justify-center z-10 animate-fade-in" key={`img-${current}`}>
            <img
              src={slide.image}
              alt="Mascotas"
              className="w-full max-w-[420px] md:max-w-none h-64 sm:h-80 md:h-[350px] object-contain mix-blend-multiply transition-transform duration-700 hover:scale-102"
            />
          </div>

          {/* Decorative background pawprints/patterns */}
          <div className="absolute top-10 right-1/3 opacity-5 pointer-events-none select-none">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="#5c3e98" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 14c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-4.5-5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm9 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-12 7c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm15 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z" />
            </svg>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prev}
          aria-label="Slide anterior"
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-50 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          aria-label="Slide siguiente"
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-50 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ChevronRight size={20} />
        </button>

        {/* Bullet indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ir al slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-200 ${
                i === current ? 'bg-[#5c3e98] w-6' : 'bg-[#e9e1f8] w-2'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
