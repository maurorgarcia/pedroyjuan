import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import FilterSection from './FilterSection';
import { CATALOG } from '../data/catalog';

type SidebarProps = {
  mode: 'catalog' | 'all';
  activeCategory?: string;
  activeSubcategory?: string;
  activeTipo?: string;
  activeBadge?: string;
  activeBrand?: string;
};

export default function CatalogSidebar({
  mode,
  activeCategory,
  activeSubcategory,
  activeTipo,
  activeBadge,
}: SidebarProps) {
  return (
    <aside className="w-56 flex-shrink-0">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Filtrar por</p>

      {mode === 'all' && (
        <FilterSection title="Destacados">
          <div className="space-y-0.5">
            <Link
              to="/productos"
              className={`block px-2 py-1.5 rounded-lg text-sm transition-colors ${!activeBadge ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Todos los productos
            </Link>
            <Link
              to="/productos?badge=oferta"
              className={`block px-2 py-1.5 rounded-lg text-sm transition-colors ${activeBadge === 'oferta' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Ofertas
            </Link>
            <Link
              to="/marcas"
              className="block px-2 py-1.5 rounded-lg text-sm transition-colors text-gray-600 hover:bg-gray-50"
            >
              Marcas
            </Link>
          </div>
        </FilterSection>
      )}

      {CATALOG.map(cat => (
        <FilterSection key={cat.id} title={cat.label}>
          <div className="space-y-0.5">
            <Link
              to={`/${cat.id}`}
              className={`block px-2 py-1.5 rounded-lg text-sm transition-colors ${
                activeCategory === cat.id && !activeSubcategory
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Todos
            </Link>
            {cat.subcategorias.map(sub => (
              <div key={sub.id}>
                <Link
                  to={`/${cat.id}/${sub.id}`}
                  className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-colors ${
                    activeCategory === cat.id && activeSubcategory === sub.id && !activeTipo
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {sub.label}
                  <ChevronRight size={13} className="text-gray-300" />
                </Link>
                {activeCategory === cat.id && activeSubcategory === sub.id && sub.tipos.length > 0 && (
                  <div className="ml-3 mt-0.5 space-y-0.5">
                    {sub.tipos.map(t => (
                      <Link
                        key={t.id}
                        to={`/${cat.id}/${sub.id}/${t.id}`}
                        className={`block px-2 py-1 rounded-lg text-xs transition-colors ${
                          activeTipo === t.id
                            ? 'bg-brand-600 text-white font-semibold'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {t.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </FilterSection>
      ))}
    </aside>
  );
}
