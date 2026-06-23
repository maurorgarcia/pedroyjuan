import { Link } from 'react-router-dom';
import { ShoppingCart, Star, PawPrint } from 'lucide-react';
import { Product } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { formatPrice, discountPercent, BADGE_LABELS } from '../lib/constants';
import { useState } from 'react';

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [cartError, setCartError] = useState('');

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    setCartError('');
    const result = await addToCart(product);
    setAdding(false);
    if (!result.ok) {
      setCartError(result.error);
      return;
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const discount = product.original_price
    ? discountPercent(product.original_price, product.price)
    : null;

  const badge = product.badge ? BADGE_LABELS[product.badge] : null;

  return (
    <article className="group bg-white border border-gray-100 hover:border-brand-200 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md">
      <Link to={`/producto/${product.id}`} className="block">
        <div className="relative bg-gray-50 aspect-square overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200">
              <PawPrint size={48} />
            </div>
          )}

          {badge && (
            <span className={`absolute top-2 right-2 badge ${badge.className}`}>
              {badge.label}
            </span>
          )}

          {discount && (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg leading-tight text-center">
              {discount}%<br />OFF
            </span>
          )}
        </div>
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <Link to={`/producto/${product.id}`} className="flex flex-col flex-1">
          {product.brand && (
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              {product.brand}
            </p>
          )}

          <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 flex-1">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
              />
            ))}
            <span className="text-xs text-gray-400 ml-1">({product.reviews_count})</span>
          </div>

          <div className="mb-3">
            <p className="font-bold text-gray-900 text-lg leading-none">
              {formatPrice(product.price)}
            </p>
            {product.original_price && (
              <p className="text-xs text-gray-400 line-through mt-0.5">
                {formatPrice(product.original_price)}
              </p>
            )}
          </div>
        </Link>

        <button
          onClick={handleAdd}
          disabled={adding || product.stock === 0}
          aria-label={product.stock === 0 ? 'Sin stock' : `Agregar ${product.name} al carrito`}
          className={`w-full py-2 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 ${
            product.stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : cartError
              ? 'bg-red-50 text-red-600 border border-red-200'
              : added
              ? 'bg-green-600 text-white'
              : adding
              ? 'bg-brand-600 text-white scale-95'
              : 'bg-brand-600 hover:bg-brand-700 text-white'
          }`}
        >
          <ShoppingCart size={14} />
          {product.stock === 0 ? 'Sin stock' : cartError ? 'Error' : added ? '¡Agregado!' : adding ? 'Agregando...' : 'Comprar'}
        </button>
        {cartError && (
          <p className="text-xs text-red-500 mt-1.5 text-center">{cartError}</p>
        )}
      </div>
    </article>
  );
}
