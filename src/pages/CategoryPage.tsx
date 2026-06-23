import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import ProductListingLayout, { Pagination } from '../components/ProductListingLayout';
import CatalogSidebar from '../components/CatalogSidebar';
import { buildBreadcrumb, findCategoria, findSubcategoria, isValidCategoria } from '../data/catalog';
import { useProducts } from '../hooks/useProducts';
import { usePageMeta } from '../hooks/usePageMeta';

export default function CategoryPage() {
  const { categoria, subcategoria, tipo } = useParams<{
    categoria: string;
    subcategoria?: string;
    tipo?: string;
  }>();

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);

  const isValid =
    !!categoria &&
    isValidCategoria(categoria) &&
    (!subcategoria || !!findSubcategoria(categoria, subcategoria)) &&
    (!tipo || !!findSubcategoria(categoria, subcategoria!)?.tipos.find(t => t.id === tipo));

  const catData = categoria && isValidCategoria(categoria) ? findCategoria(categoria) : undefined;
  const subData = categoria && subcategoria ? findSubcategoria(categoria, subcategoria) : undefined;

  const pageTitle = (() => {
    if (!isValid || !catData) return 'Productos';
    if (tipo && subData) {
      return subData.tipos.find(t => t.id === tipo)?.label ?? tipo;
    }
    return subData?.label ?? catData.label;
  })();

  const breadcrumbs = isValid ? buildBreadcrumb(categoria, subcategoria, tipo) : [{ label: 'Inicio', href: '/' }];

  const { products, total, loading, totalPages } = useProducts({
    category: isValid ? categoria : undefined,
    subcategory: isValid ? subcategoria : undefined,
    type: isValid ? tipo : undefined,
    search,
    sort,
    page,
  });

  usePageMeta({
    title: pageTitle,
    description: `Comprá ${pageTitle.toLowerCase()} en Pedro y Juan Petshop.`,
  });

  if (!isValid) {
    return <Navigate to="/404" replace />;
  }

  const pills = !tipo ? (
    (!subcategoria ? catData!.subcategorias : subData?.tipos ?? []).map(item => (
      <Link
        key={item.id}
        to={subcategoria ? `/${categoria}/${subcategoria}/${item.id}` : `/${categoria}/${item.id}`}
        className="px-4 py-1.5 rounded-full text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:border-brand-400 hover:text-brand-700 hover:bg-brand-50 transition-all"
      >
        {item.label}
      </Link>
    ))
  ) : null;

  return (
    <ProductListingLayout
      breadcrumbs={breadcrumbs}
      pageTitle={pageTitle}
      productCount={total}
      loading={loading}
      search={search}
      onSearchChange={value => { setSearch(value); setPage(1); }}
      sort={sort}
      onSortChange={value => { setSort(value); setPage(1); }}
      sidebar={
        <CatalogSidebar
          mode="catalog"
          activeCategory={categoria}
          activeSubcategory={subcategoria}
          activeTipo={tipo}
        />
      }
      pills={pills}
      pagination={
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      }
    >
      <ProductGrid
        products={products}
        loading={loading}
        emptyTitle="Sin resultados"
        emptyMessage="No encontramos productos en esta sección."
        emptyAction={{ label: `Ver todo en ${catData!.label}`, to: `/${categoria}` }}
      />
    </ProductListingLayout>
  );
}
