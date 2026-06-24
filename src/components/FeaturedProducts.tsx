import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { supabase, Product } from '../lib/supabase';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('rating', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        setProducts(data || []);
        setLoading(false);
      });
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.8;
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Productos destacados</h2>
            <p className="text-xs text-gray-500 mt-1">Los favoritos de nuestros clientes</p>
          </div>
          <Link to="/productos" className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#5c3e98] hover:text-[#4b3180] transition-colors">
            Ver todos los productos <ArrowRight size={14} />
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative group px-1 sm:px-4">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="card overflow-hidden animate-pulse border border-gray-100 rounded-2xl">
                  <div className="h-44 bg-gray-50" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-4 bg-gray-100 rounded w-full" />
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                    <div className="h-9 bg-gray-100 rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Product list with horizontal scroll */}
              <div
                ref={containerRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {products.map(p => (
                  <div key={p.id} className="w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(20%-13px)] flex-shrink-0 snap-start">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>

              {/* Navigation controls */}
              <button
                onClick={() => scroll('left')}
                className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-100 shadow-md flex items-center justify-center text-gray-500 hover:text-[#5c3e98] opacity-0 group-hover:opacity-100 transition-all z-20"
                aria-label="Scroll izquierda"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="absolute right-[-16px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-100 shadow-md flex items-center justify-center text-gray-500 hover:text-[#5c3e98] opacity-0 group-hover:opacity-100 transition-all z-20"
                aria-label="Scroll derecha"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
