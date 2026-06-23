import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { usePageMeta } from '../hooks/usePageMeta';

export default function MarcasPage() {
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: 'Marcas',
    description: 'Explorá todas las marcas disponibles en Pedro y Juan Petshop.',
  });

  useEffect(() => {
    supabase
      .from('products')
      .select('brand')
      .eq('active', true)
      .not('brand', 'is', null)
      .then(({ data }) => {
        const unique = [...new Set((data || []).map(r => r.brand).filter(Boolean))] as string[];
        setBrands(unique.sort());
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="page-title">Marcas</h1>
          <p className="text-gray-500 text-sm mt-2">
            Marcas premium y certificadas para el cuidado de tu mascota.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : brands.length === 0 ? (
          <p className="text-center text-gray-500 py-16">No hay marcas disponibles todavía.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {brands.map(brand => (
              <Link
                key={brand}
                to={`/productos?brand=${encodeURIComponent(brand)}`}
                className="card p-6 flex flex-col items-center justify-center gap-3 hover:border-brand-300 transition-colors min-h-[120px] text-center"
              >
                <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Award size={22} />
                </div>
                <span className="font-semibold text-gray-800">{brand}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
