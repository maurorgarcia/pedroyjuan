import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  { name: 'Carla Lizazu', badge: 'Local Guide · 29 opiniones', text: 'Maravillosa atención, variedad de productos y son muy amables siempre.', rating: 5 },
  { name: 'Ronaldo Villalba', badge: 'Local Guide · 58 opiniones', text: 'Gran variedad de productos y excelente atención.', rating: 5 },
  { name: 'Adriana Avelin', badge: 'Local Guide · 31 opiniones', text: 'Me encanta. Fue donde compramos nuestra pecera, los chicos son muy amables y siempre nos ayudan con consejos de cómo cuidar a nuestros peces.', rating: 5 },
  { name: 'Rober Escalas', badge: 'Local Guide · 257 opiniones', text: 'Excelente atención, el chico que nos atendió es un genio y muy amable.', rating: 5 },
  { name: 'Mery Liz', badge: 'Local Guide · 30 opiniones', text: 'Buena atención, buenos productos!!! 👌🏼', rating: 5 },
  { name: 'Marcos Ezequiel Bordon', badge: '13 opiniones', text: 'Muy buena atención y rápida.', rating: 5 },
  { name: 'Fabio Javier', badge: 'Local Guide · 60 opiniones', text: 'Excelente Precio y Calidad.', rating: 5 },
  { name: 'Jo Romero', badge: 'Local Guide · 26 opiniones', text: 'Excelente atención.', rating: 5 },
  { name: 'Florencia Petrucci', badge: 'Local Guide · 27 opiniones', text: 'Tienen los cobayos más lindos 😊', rating: 5 }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

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

  const maxIndex = testimonials.length - visibleCount;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [visibleCount, currentIndex, isPaused]);

  // Generate background color based on name first letter
  const getAvatarBg = (name: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-600', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const code = name.charCodeAt(0);
    return colors[code % colors.length];
  };

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title">Lo que dicen nuestros clientes</h2>
          <p className="section-subtitle">
            Opiniones reales extraídas directamente de nuestro perfil de Google Maps
          </p>
        </div>

        <div 
          className="relative px-4 md:px-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Carousel Wrapper */}
          <div className="overflow-hidden py-4">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
            >
              {testimonials.map((t, idx) => (
                <div 
                  key={idx} 
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
                >
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between">
                    <div>
                      {/* Rating and Google Badge */}
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-0.5">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.706 0 3.277.614 4.5 1.625l2.437-2.437C17.312 1.696 14.933 1 12.24 1 6.583 1 2 5.583 2 11.24s4.583 10.24 10.24 10.24c5.795 0 10.254-4.074 10.254-10.24 0-.695-.08-1.355-.22-1.955H12.24z"/>
                          </svg>
                          Google
                        </span>
                      </div>
                      
                      {/* Review Text */}
                      <p className="text-gray-600 leading-relaxed text-sm italic mb-6">
                        "{t.text}"
                      </p>
                    </div>

                    {/* Reviewer Details */}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${getAvatarBg(t.name)}`}>
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                        <p className="text-xs text-gray-400">{t.badge}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full border border-gray-100 shadow-md flex items-center justify-center text-gray-600 hover:text-brand-600 hover:shadow-lg transition-all z-10"
            aria-label="Anterior opinión"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full border border-gray-100 shadow-md flex items-center justify-center text-gray-600 hover:text-brand-600 hover:shadow-lg transition-all z-10"
            aria-label="Siguiente opinión"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-1.5 mt-8">
          {Array.from({ length: testimonials.length - visibleCount + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === i ? 'w-6 bg-brand-600' : 'w-2 bg-gray-200 hover:bg-gray-300'
              }`}
              aria-label={`Ir al grupo ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
