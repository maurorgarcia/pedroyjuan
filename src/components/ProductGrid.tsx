import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '../lib/supabase';

type Props = {
  products: Product[];
  loading: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyAction?: { label: string; to: string };
};

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-100" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="h-4 bg-gray-100 rounded" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-8 bg-gray-100 rounded mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProductGrid({
  products,
  loading,
  emptyTitle = 'Sin resultados',
  emptyMessage = 'No encontramos productos con esos criterios.',
  emptyAction,
}: Props) {
  if (loading) return <ProductGridSkeleton />;

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <Search size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">{emptyTitle}</h3>
        <p className="text-gray-500 text-sm mb-5">{emptyMessage}</p>
        {emptyAction && (
          <Link to={emptyAction.to} className="btn-primary">
            {emptyAction.label}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
