import { Link } from 'react-router-dom';
import { ShoppingCart, Star, PawPrint, Heart } from 'lucide-react';
import { Product } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { formatPrice, discountPercent, BADGE_LABELS } from '../lib/constants';
import { useState } from 'react';

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const { addToCart, setCartOpen } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [cartError, setCartError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

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
    setCartOpen(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const discount = product.original_price
    ? discountPercent(product.original_price, product.price)
    : null;

  const badge = product.badge ? BADGE_LABELS[product.badge] : null;

  return (
    <article className="group bg-white border border-gray-100/80 hover:border-brand-200 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg">
      <div className="relative bg-gray-50 aspect-square overflow-hidden">
        <Link to={`/producto/${product.id}`} className="block w-full h-full">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-contain p-4 group-hover:scale-103 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200">
              <PawPrint size={48} />
            </div>
          )}
        </Link>

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-400 hover:text-red-500 shadow-sm border border-gray-100 transition-colors z-10"
        >
          <Heart size={15} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
        </button>

        {/* Badge left side */}
        {discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md leading-none">
            -{discount}%
          </span>
        )}

        {badge && !discount && (
          <span className={`absolute top-3 left-3 text-[10px] font-extrabold px-2 py-0.5 rounded-md leading-none ${badge.className}`}>
            {badge.label}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/producto/${product.id}`} className="flex flex-col flex-1">
          {product.brand && (
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              {product.brand}
            </p>
          )}

          <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 flex-1 group-hover:text-[#5c3e98] transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
              />
            ))}
            <span className="text-[10px] text-gray-400 ml-1">({product.reviews_count})</span>
          </div>

          <div className="mb-4 flex items-baseline gap-2">
            <span className="font-extrabold text-gray-900 text-base">
              {formatPrice(product.price)}
            </span>
            {product.original_price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
        </Link>

        <button
          onClick={handleAdd}
          disabled={adding || product.stock === 0}
          className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 ${
            product.stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : cartError
              ? 'bg-red-50 text-red-600 border border-red-200'
              : added
              ? 'bg-green-600 text-white'
              : adding
              ? 'bg-[#5c3e98] text-white scale-95'
              : 'bg-[#5c3e98] hover:bg-[#4b3180] text-white'
          }`}
        >
          {product.stock === 0 ? 'Sin stock' : cartError ? 'Error' : added ? '¡Agregado!' : adding ? 'Agregando...' : 'Agregar al carrito'}
          <ShoppingCart size={13} />
        </button>
        {cartError && (
          <p className="text-[10px] text-red-500 mt-1.5 text-center">{cartError}</p>
        )}
      </div>
    </article>
  );
}
