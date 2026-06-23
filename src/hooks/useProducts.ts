import { useEffect, useState } from 'react';
import { supabase, Product } from '../lib/supabase';

export const SORT_OPTIONS = [
  { value: 'default', label: 'Más relevantes' },
  { value: 'price_asc', label: 'Menor precio' },
  { value: 'price_desc', label: 'Mayor precio' },
  { value: 'name_asc', label: 'Nombre A–Z' },
  { value: 'rating_desc', label: 'Mejor calificación' },
] as const;

export type ProductFilters = {
  category?: string;
  subcategory?: string;
  type?: string;
  badge?: string;
  brand?: string;
  search?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
};

export function useProducts(filters: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 12;

  useEffect(() => {
    setLoading(true);

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('active', true);

    if (filters.category) query = query.eq('category', filters.category);
    if (filters.subcategory) query = query.eq('subcategory', filters.subcategory);
    if (filters.type) query = query.eq('type', filters.type);
    if (filters.badge) query = query.eq('badge', filters.badge);
    if (filters.brand) query = query.ilike('brand', filters.brand);
    if (filters.search?.trim()) query = query.ilike('name', `%${filters.search.trim()}%`);

    if (filters.sort === 'price_asc') query = query.order('price', { ascending: true });
    else if (filters.sort === 'price_desc') query = query.order('price', { ascending: false });
    else if (filters.sort === 'name_asc') query = query.order('name', { ascending: true });
    else if (filters.sort === 'rating_desc') query = query.order('rating', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    const from = (page - 1) * pageSize;
    query = query.range(from, from + pageSize - 1);

    query.then(({ data, count }) => {
      setProducts(data || []);
      setTotal(count ?? 0);
      setLoading(false);
    });
  }, [
    filters.category,
    filters.subcategory,
    filters.type,
    filters.badge,
    filters.brand,
    filters.search,
    filters.sort,
    page,
    pageSize,
  ]);

  return {
    products,
    total,
    loading,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
