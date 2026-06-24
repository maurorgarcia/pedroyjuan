import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: 'María L.',
    badge: 'Hace 1 semana',
    text: 'Excelente atención y muy buenos precios. Siempre encuentro lo que necesito para mi perro.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=compress&cs=tinysrgb&w=100',
  },
  {
    name: 'Lucas R.',
    badge: 'Hace 2 semanas',
    text: 'Compro siempre el alimento de mi gata acá. Llegan rápido y la atención es increíble.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=compress&cs=tinysrgb&w=100',
  },
  {
    name: 'Sofía A.',
    badge: 'Hace 3 semanas',
    text: 'Llevé a mi perrita a peluquería y quedó hermosa! Súper recomendados.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1537151608828-ea2b117b6b86?auto=compress&cs=tinysrgb&w=100',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - visibleCount);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xs text-gray-500 mt-1">Opiniones reales de Google Maps</p>
          </div>
          <a
            href="https://maps.app.goo.gl/uYqifwpKArGiT5AT6"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-semibold text-[#5c3e98] hover:text-[#4b3180] transition-colors"
          >
            Ver todas las opiniones →
          </a>
        </div>

        <div className="relative px-2 sm:px-6">
          {/* Carousel Wrapper */}
          <div className="overflow-hidden py-2">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
            >
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
                >
                  <div className="bg-gray-50/60 rounded-2xl p-6 border border-gray-100/80 flex gap-4 items-start h-full">
                    {/* Left avatar photo */}
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
                    />

                    {/* Right details */}
                    <div className="flex-1">
                      {/* Rating */}
                      <div className="flex gap-0.5 mb-1.5">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                        ))}
                      </div>

                      {/* Text */}
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3">
                        "{t.text}"
                      </p>

                      {/* Name & Time */}
                      <div>
                        <p className="font-bold text-gray-900 text-xs sm:text-sm">{t.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{t.badge}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          {maxIndex > 0 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-[#5c3e98] transition-colors z-10"
                aria-label="Anterior"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-[#5c3e98] transition-colors z-10"
                aria-label="Siguiente"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Indicators */}
        {maxIndex > 0 && (
          <div className="flex justify-center gap-1.5 mt-6">
            {Array.from({ length: testimonials.length - visibleCount + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  currentIndex === i ? 'w-5 bg-[#5c3e98]' : 'w-1.5 bg-[#e9e1f8]'
                }`}
                aria-label={`Grupo ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
