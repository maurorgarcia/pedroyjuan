import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Truck, PawPrint } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice } from '../lib/constants';
import { Product } from '../lib/supabase';

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
      <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <ShoppingBag size={36} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1.5">Tu carrito está vacío</h2>
          <p className="text-gray-500 text-sm mb-5">Agregá productos para comenzar tu pedido</p>
          <Link to="/productos" className="btn-primary">Ver productos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft size={14} />Seguir comprando
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-5">
          Mi carrito <span className="text-gray-400 font-normal text-base">({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</span>
        </h1>

        {/* Compact Shipping Info Banner */}
        <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-2.5 mb-5 flex items-center gap-3">
          <Truck size={16} className="text-brand-600 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-brand-800 font-medium">
            ¡Hacemos envíos a domicilio en San Nicolás o podés retirar gratis en nuestro local!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-3">
            {displayItems.map(({ id, product, quantity }) => (
              <div key={id} className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                {/* Product Image */}
                <Link to={`/producto/${product.id}`} className="flex-shrink-0">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg" />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                      <PawPrint size={24} />
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0 pr-2">
                    <Link to={`/producto/${product.id}`}>
                      {product.brand && <p className="text-[10px] text-brand-600 font-bold uppercase tracking-wider">{product.brand}</p>}
                      <h2 className="font-semibold text-gray-900 text-sm leading-snug truncate">{product.name}</h2>
                    </Link>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{formatPrice(product.price)}</p>
                  </div>

                  {/* Actions & Quantity */}
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(id, quantity - 1)} 
                        className="p-1 px-2 hover:bg-gray-100 text-gray-500 transition-colors"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold min-w-8 text-center text-gray-700">{quantity}</span>
                      <button 
                        onClick={() => updateQuantity(id, quantity + 1)} 
                        className="p-1 px-2 hover:bg-gray-100 text-gray-500 transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(id)} 
                      className="text-gray-400 hover:text-red-500 transition-colors p-1.5"
                      aria-label="Eliminar del carrito"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24 shadow-sm">
              <h2 className="font-bold text-gray-900 text-base mb-4 pb-2 border-b border-gray-100">Resumen del pedido</h2>
              
              <div className="space-y-2.5 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Productos ({totalItems})</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Entrega</span>
                  <span className="text-green-600 font-medium">A coordinar</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-gray-900 text-base pt-3 border-t border-gray-100">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              {user ? (
                <Link to="/checkout" className="btn-primary w-full mt-5 text-center py-2.5 text-sm">
                  Continuar compra
                </Link>
              ) : (
                <div className="mt-5 space-y-2">
                  <Link to="/login" state={{ from: '/checkout' }} className="btn-primary w-full text-center block py-2.5 text-sm">
                    Iniciar sesión para comprar
                  </Link>
                  <Link to="/registro" className="btn-secondary w-full text-center block py-2 text-xs">
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
