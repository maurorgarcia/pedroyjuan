import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Store, PawPrint } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice } from '../lib/constants';
import { Product } from '../lib/supabase';
import { BUSINESS } from '../lib/business';

export default function CartPage() {
  const { user } = useAuth();
  const { items, localItems, totalItems, totalPrice, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  type DisplayItem = { id: string; product: Product; quantity: number };
  const displayItems: DisplayItem[] = user
    ? items.map(i => ({ id: i.product_id, product: i.product, quantity: i.quantity }))
    : localItems.map(i => ({ id: i.product.id, product: i.product, quantity: i.quantity }));

  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Tu carrito esta vacio</h2>
          <p className="text-gray-500 text-sm mb-6">Agrega productos para comenzar tu pedido</p>
          <Link to="/productos" className="btn-primary">Ver productos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft size={16} />Seguir comprando
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Mi carrito <span className="text-gray-400 font-normal text-lg">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
        </h1>

        <div className="bg-brand-50 border border-brand-200 rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
          <Store size={18} className="text-brand-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-brand-800 font-medium">{BUSINESS.pickupNote}</p>
            <a
              href={BUSINESS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-600 hover:underline mt-1 inline-block"
            >
              Ver ubicación en Google Maps
            </a>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {displayItems.map(({ id, product, quantity }) => (
              <div key={id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4">
                <Link to={`/producto/${product.id}`} className="flex-shrink-0">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-20 h-20 object-cover rounded-xl" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-gray-300">
                      <PawPrint size={32} />
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/producto/${product.id}`}>
                    {product.brand && <p className="text-xs text-brand-600 font-semibold">{product.brand}</p>}
                    <p className="font-semibold text-gray-900 text-sm leading-tight truncate">{product.name}</p>
                  </Link>
                  <p className="font-bold text-gray-900 mt-1">{formatPrice(product.price)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(id, quantity - 1)} className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="px-3 py-1.5 text-sm font-semibold border-x border-gray-200 min-w-10 text-center">{quantity}</span>
                      <button onClick={() => updateQuantity(id, quantity + 1)} className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(id)} className="text-gray-400 hover:text-red-500 transition-colors p-1.5">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <h2 className="font-bold text-gray-900 text-lg mb-4">Resumen del pedido</h2>
              <div className="space-y-2 mb-4">
                {displayItems.map(({ id, product, quantity }) => (
                  <div key={id} className="flex justify-between text-sm text-gray-600">
                    <span className="truncate mr-2">{product.name} x{quantity}</span>
                    <span className="flex-shrink-0 font-medium">{formatPrice(product.price * quantity)}</span>
                  </div>
                ))}
              </div>
              <hr className="my-3" />
              <div className="flex justify-between font-bold text-gray-900 text-lg border-t pt-3">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              {user ? (
                <Link to="/checkout" className="btn-primary w-full mt-4 text-center">
                  Confirmar pedido
                </Link>
              ) : (
                <div className="mt-4 space-y-2">
                  <Link to="/login" state={{ from: '/checkout' }} className="btn-primary w-full text-center block">
                    Iniciar sesion para comprar
                  </Link>
                  <Link to="/registro" className="btn-secondary w-full text-center block text-sm">
                    Crear cuenta nueva
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
