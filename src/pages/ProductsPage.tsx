import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import ProductListingLayout, { Pagination } from '../components/ProductListingLayout';
import CatalogSidebar from '../components/CatalogSidebar';
import { CATALOG } from '../data/catalog';
import { useProducts } from '../hooks/useProducts';
import { usePageMeta } from '../hooks/usePageMeta';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'default');
  const [page, setPage] = useState(Number(searchParams.get('page') || 1));

  const badgeParam = searchParams.get('badge') || '';
  const brandParam = searchParams.get('brand') || '';
  const searchParam = searchParams.get('search') || '';

  useEffect(() => {
    setSearch(searchParam);
  }, [searchParam]);

  const pageTitle = badgeParam === 'oferta'
    ? 'Ofertas'
    : brandParam
      ? brandParam
      : searchParam
        ? `Resultados para "${searchParam}"`
        : 'Todos los productos';

  usePageMeta({
    title: pageTitle,
    description: 'Explorá todo el catálogo de Pedro y Juan Petshop.',
  });

  const { products, total, loading, totalPages } = useProducts({
    badge: badgeParam || undefined,
    brand: brandParam || undefined,
    search: searchParam || undefined,
    sort,
    page,
  });

  const updateParams = (updates: Record<string, string>) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      return next;
    });
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    updateParams({ search: value.trim(), page: '' });
  };

  const handleSort = (value: string) => {
    setSort(value);
    setPage(1);
    updateParams({ sort: value === 'default' ? '' : value, page: '' });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateParams({ page: newPage > 1 ? String(newPage) : '' });
  };

  const pills = !badgeParam && !searchParam && !brandParam ? (
    CATALOG.map(cat => (
      <Link
        key={cat.id}
        to={`/${cat.id}`}
        className="px-4 py-1.5 rounded-full text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:border-brand-400 hover:text-brand-700 hover:bg-brand-50 transition-all"
      >
        {cat.label}
      </Link>
    ))
  ) : null;

  return (
    <ProductListingLayout
      breadcrumbs={[
        { label: 'Inicio', href: '/' },
        { label: pageTitle },
      ]}
      pageTitle={pageTitle}
      productCount={total}
      loading={loading}
      search={search}
      onSearchChange={handleSearch}
      sort={sort}
      onSortChange={handleSort}
      sidebar={
        <CatalogSidebar mode="all" activeBadge={badgeParam || undefined} />
      }
      pills={pills}
      pagination={
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      }
    >
      <ProductGrid
        products={products}
        loading={loading}
        emptyAction={{ label: 'Ver todos los productos', to: '/productos' }}
      />
    </ProductListingLayout>
  );
}
