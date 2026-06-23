import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Star, MapPin, Shield, ChevronRight,
  AlertTriangle, PawPrint, Minus, Plus, CreditCard, Home,
  Megaphone,
} from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { formatPrice, discountPercent } from '../lib/constants';
import { findCategoria } from '../data/catalog';
import ProductCard from '../components/ProductCard';
import JsonLd from '../components/JsonLd';
import { usePageMeta } from '../hooks/usePageMeta';
import { BUSINESS } from '../lib/business';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [cartError, setCartError] = useState('');
  const [activeTab, setActiveTab] = useState<'descripcion' | 'caracteristicas'>('descripcion');

  usePageMeta({
    title: product?.name ?? 'Producto',
    description: product?.description?.slice(0, 160) ?? 'Detalle de producto en Pedro y Juan Petshop.',
  });

  useEffect(() => {
    if (!id) return;
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        setProduct(data);
        setLoading(false);
        // Fetch related products
        if (data?.category) {
          supabase
            .from('products')
            .select('*')
            .eq('active', true)
            .eq('category', data.category)
            .neq('id', id)
            .limit(6)
            .then(({ data: rel }) => setRelated(rel || []));
        }
      });
  }, [id]);

  const handleAdd = async () => {
    if (!product) return;
    setAdding(true);
    setCartError('');
    const result = await addToCart(product, quantity);
    setAdding(false);
    if (!result.ok) {
      setCartError(result.error);
      return;
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-48" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-10 bg-gray-200 rounded w-1/2" />
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Producto no encontrado</h2>
          <button onClick={() => navigate(-1)} className="btn-primary mt-4">Volver</button>
        </div>
      </div>
    );
  }

  const discount = product.original_price
    ? discountPercent(product.original_price, product.price)
    : null;
  const catData = product.category ? findCategoria(product.category) : undefined;

  // Payment installments (illustrative)
  const installments = product.price / 3;

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.image_url,
          brand: { '@type': 'Brand', name: product.brand },
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'ARS',
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            seller: { '@type': 'Organization', name: BUSINESS.name },
          },
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

        {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
        <nav className="flex items-center gap-1 text-xs text-gray-400 uppercase tracking-wider mb-6 flex-wrap">
          <Link to="/" className="hover:text-brand-600 flex items-center gap-1"><Home size={11} />Inicio</Link>
          {catData && (
            <>
              <span className="text-gray-300">/</span>
              <Link to={`/${catData.id}`} className="hover:text-brand-600">{catData.label}</Link>
            </>
          )}
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 font-semibold normal-case truncate max-w-xs">{product.name}</span>
        </nav>

        {/* ── Main product section ────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">

          {/* Left: Image + thumbnails */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden relative aspect-square flex items-center justify-center p-8">
              {discount && (
                <span className="absolute top-4 left-4 bg-green-500 text-white text-sm font-black px-3 py-2 rounded-xl leading-tight text-center z-10">
                  {discount}%<br />OFF
                </span>
              )}
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-200">
                  <PawPrint size={96} />
                </div>
              )}
            </div>

            {/* Thumbnails (same image for now, extend when multi-image) */}
            <div className="flex gap-2 mt-3">
              {[product.image_url].filter(Boolean).map((img, i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-xl border-2 border-brand-500 overflow-hidden bg-white flex items-center justify-center p-1 cursor-pointer"
                >
                  <img src={img!} alt="" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col gap-4">
            {/* Code + Brand */}
            <div className="text-xs text-gray-400 space-x-4">
              {product.brand && (
                <span>
                  <span className="font-semibold">Marca:</span>{' '}
                  <span className="text-brand-600 font-bold uppercase">{product.brand}</span>
                </span>
              )}
            </div>

            {/* Product name */}
            <h1 className="text-2xl font-black text-gray-900 uppercase leading-tight">
              {product.name}
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={i < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.rating.toFixed(1)} ({product.reviews_count} reseñas)</span>
            </div>

            {/* Promo banner */}
            {discount && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-3">
                <Megaphone size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-amber-800">¡Producto con promoción!</p>
                  <p className="text-xs text-amber-700 mt-0.5">• {discount}% off en todo · Exclusivo en la web</p>
                </div>
              </div>
            )}

            {/* Price */}
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">Precio en un pago</p>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-gray-900">{formatPrice(product.price)}</span>
                {product.original_price && (
                  <span className="text-lg text-gray-400 line-through mb-1">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>
              <p className="text-sm text-brand-600 font-semibold mt-1">
                3 cuotas de {formatPrice(installments)} sin interés
              </p>
            </div>

            {/* Quantity + Add to cart */}
            {product.stock > 0 ? (
              <div className="flex items-center gap-3">
                {/* Qty selector */}
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={16} className="text-gray-600" />
                  </button>
                  <span className="px-5 py-2.5 text-base font-bold border-x-2 border-gray-200 min-w-14 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="px-3 py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={16} className="text-gray-600" />
                  </button>
                </div>

                {/* Buy button */}
                <button
                  onClick={handleAdd}
                  disabled={adding || added}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-base transition-all ${
                    cartError
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : added
                      ? 'bg-green-500 text-white'
                      : 'bg-brand-600 hover:bg-brand-700 text-white active:scale-95'
                  }`}
                >
                  <ShoppingCart size={18} />
                  {cartError ? 'Error al agregar' : added ? '¡Agregado!' : adding ? 'Agregando...' : 'Comprar'}
                </button>
              </div>
            ) : (
              <div className="bg-red-50 text-red-600 font-bold text-center py-3 rounded-xl border border-red-200">
                Sin stock disponible
              </div>
            )}

            {cartError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{cartError}</p>
            )}

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-3">
                <MapPin size={20} className="text-brand-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Retiro en local</p>
                  <p className="text-xs text-gray-500 mt-0.5">Bartolomé Mitre 360, San Nicolás</p>
                  <a
                    href={BUSINESS.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-600 font-semibold mt-1 hover:underline inline-block"
                  >
                    Ver cómo llegar →
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-3">
                <CreditCard size={20} className="text-brand-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Beneficios bancarios</p>
                  <button className="text-xs text-brand-600 font-semibold mt-0.5 hover:underline">Ver más beneficios</button>
                </div>
              </div>
            </div>

            {/* Payment options panel */}
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <p className="text-xs font-bold text-gray-700 mb-3">¡Aprovechá estas promociones de pago!</p>
              <div className="space-y-2">
                {[
                  { card: 'Visa Crédito', color: 'text-blue-600' },
                  { card: 'Master Crédito', color: 'text-red-600' },
                  { card: 'Naranja Crédito', color: 'text-orange-500' },
                  { card: 'Cabal', color: 'text-green-600' },
                ].map(({ card, color }) => (
                  <div key={card} className="flex items-center gap-2 text-xs">
                    <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
                    <span className="text-gray-600">3 cuotas de</span>
                    <span className={`font-bold ${color}`}>{formatPrice(installments)}</span>
                    <span className={`font-semibold ${color}`}>con {card}</span>
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-1 text-xs text-brand-600 font-semibold mt-3 hover:underline">
                <Shield size={13} />Ver más planes de financiación
              </button>
            </div>
          </div>
        </div>

        {/* ── Description / Características tabs ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 mb-8">
          <div className="flex border-b border-gray-100">
            {(['descripcion', 'caracteristicas'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-brand-600 text-brand-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'descripcion' ? 'Descripción' : 'Características'}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === 'descripcion' ? (
              product.description ? (
                <div>
                  <p className="text-sm font-bold text-gray-900 uppercase mb-2">{product.name}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Sin descripción disponible.</p>
              )
            ) : (
              <div className="text-sm text-gray-600 space-y-2">
                {product.brand && <div className="flex gap-4"><span className="font-semibold w-32 text-gray-700">Marca</span><span>{product.brand}</span></div>}
                {product.category && <div className="flex gap-4"><span className="font-semibold w-32 text-gray-700">Categoría</span><span className="capitalize">{product.category}</span></div>}
                <div className="flex gap-4"><span className="font-semibold w-32 text-gray-700">Stock</span><span>{product.stock} unidades</span></div>
              </div>
            )}
          </div>
        </div>

        {/* ── Related products ────────────────────────────────────────────────── */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-brand-700 uppercase text-center mb-6">
              Sugeridos
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {related.slice(0, 5).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            {catData && (
              <div className="text-center mt-6">
                <Link
                  to={`/${catData.id}`}
                  className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-3 rounded-full transition-colors text-sm"
                >
                  Ver categoría
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
