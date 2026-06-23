import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, X, SlidersHorizontal } from 'lucide-react';
import { SORT_OPTIONS } from '../hooks/useProducts';

type Breadcrumb = { label: string; href?: string };

type Props = {
  breadcrumbs: Breadcrumb[];
  pageTitle: string;
  productCount: number;
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  sidebar: ReactNode;
  pills?: ReactNode;
  pagination?: ReactNode;
  children: ReactNode;
};

export default function ProductListingLayout({
  breadcrumbs,
  pageTitle,
  productCount,
  loading,
  search,
  onSearchChange,
  sort,
  onSortChange,
  sidebar,
  pills,
  pagination,
  children,
}: Props) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-0">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-gray-400 uppercase tracking-wider mb-4 flex-wrap">
            {breadcrumbs.map((crumb, i) => (
              <span key={`${crumb.label}-${i}`} className="flex items-center gap-1">
                {i > 0 && <span className="text-gray-300">/</span>}
                {crumb.href ? (
                  <Link to={crumb.href} className="hover:text-brand-600 transition-colors flex items-center gap-1">
                    {i === 0 && <Home size={11} />}
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-600 font-semibold">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          <div className="hidden md:block">{sidebar}</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
              <div>
                <h1 className="page-title">{pageTitle}</h1>
                <p className="text-xs text-gray-400 mt-1">
                  {loading ? 'Cargando...' : `${productCount} producto${productCount !== 1 ? 's' : ''}`}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="md:hidden flex items-center gap-2 text-sm font-medium text-gray-600 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50"
                >
                  <SlidersHorizontal size={15} />
                  Filtros
                </button>

                <div className="relative flex-1 sm:flex-none sm:w-44">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={search}
                    onChange={e => onSearchChange(e.target.value)}
                    placeholder="Buscar..."
                    aria-label="Buscar productos"
                    className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-brand-400 bg-white"
                  />
                  {search && (
                    <button
                      onClick={() => onSearchChange('')}
                      aria-label="Limpiar búsqueda"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="hidden sm:block font-medium">Ordenar por</span>
                  <select
                    value={sort}
                    onChange={e => onSortChange(e.target.value)}
                    aria-label="Ordenar productos"
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-400 bg-white"
                  >
                    {SORT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {pills && <div className="flex gap-2 flex-wrap mb-5">{pills}</div>}

            {children}

            {pagination}
          </div>
        </div>
      </div>

      {mobileSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMobileSidebarOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 overflow-y-auto p-5 animate-slide-right">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-gray-900">Filtrar por</p>
              <button onClick={() => setMobileSidebarOpen(false)} aria-label="Cerrar filtros">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            {sidebar}
          </div>
        </>
      )}
    </div>
  );
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-white transition-colors"
      >
        Anterior
      </button>
      <span className="text-sm text-gray-500 px-2">
        Página {page} de {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-white transition-colors"
      >
        Siguiente
      </button>
    </div>
  );
}
