import { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, PawPrint } from 'lucide-react';
import { formatPrice } from '../lib/constants';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { user } = useAuth();
  const { isCartOpen, setCartOpen, items, localItems, totalItems, totalPrice, removeFromCart, updateQuantity } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      const t = setTimeout(() => setMounted(true), 10);
      return () => clearTimeout(t);
    } else {
      document.body.style.overflow = 'unset';
      setMounted(false);
    }
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const displayItems = user
    ? items.map(i => ({ id: i.product_id, product: i.product, quantity: i.quantity }))
    : localItems.map(i => ({ id: i.product.id, product: i.product, quantity: i.quantity }));

  const handleClose = () => {
    setMounted(false);
    setTimeout(() => {
      setCartOpen(false);
      document.body.style.overflow = 'unset';
    }, 280);
  };

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={handleClose} />

      {/* Drawer */}
      <div 
        className={`absolute right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          mounted ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-brand-600" />
            <h2 className="font-bold text-gray-900 text-lg">Tu Carrito</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-bold">
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </span>
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {displayItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <ShoppingBag size={48} className="text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium text-sm">Tu carrito está vacío</p>
              <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Agregá productos para comenzar tu pedido</p>
              <button 
                onClick={handleClose}
                className="btn-primary mt-5 text-xs py-2 px-6"
              >
                Explorar tienda
              </button>
            </div>
          ) : (
            displayItems.map(({ id, product, quantity }) => (
              <div key={id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0 items-start">
                <Link to={`/producto/${product.id}`} onClick={handleClose} className="flex-shrink-0">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-14 h-14 object-cover rounded-lg border border-gray-100" />
                  ) : (
                    <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 border border-gray-100">
                      <PawPrint size={18} />
                    </div>
                  )}
                </Link>

                <div className="flex-1 min-w-0">
                  <Link to={`/producto/${product.id}`} onClick={handleClose}>
                    {product.brand && <p className="text-[9px] text-brand-600 font-black uppercase tracking-wider">{product.brand}</p>}
                    <h3 className="font-semibold text-gray-900 text-xs leading-tight truncate mb-1">{product.name}</h3>
                  </Link>
                  <p className="font-bold text-gray-900 text-sm mb-2">{formatPrice(product.price)}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(id, quantity - 1)} 
                        className="p-1 px-2 hover:bg-gray-100 text-gray-500 transition-colors"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="px-2 text-xs font-bold text-gray-700 min-w-6 text-center">{quantity}</span>
                      <button 
                        onClick={() => updateQuantity(id, quantity + 1)} 
                        className="p-1 px-2 hover:bg-gray-100 text-gray-500 transition-colors"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(id)} 
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      aria-label="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {displayItems.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-4">
            <div className="flex justify-between font-bold text-gray-900 text-base">
              <span>Total estimado</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            
            {user ? (
              <Link 
                to="/checkout" 
                onClick={handleClose}
                className="btn-primary w-full text-center py-3 text-sm flex items-center justify-center gap-1.5"
              >
                Continuar Compra <ArrowRight size={16} />
              </Link>
            ) : (
              <div className="space-y-2">
                <Link 
                  to="/login" 
                  state={{ from: '/checkout' }}
                  onClick={handleClose}
                  className="btn-primary w-full text-center block py-3 text-sm"
                >
                  Iniciar sesión para comprar
                </Link>
                <Link 
                  to="/registro" 
                  onClick={handleClose}
                  className="btn-secondary w-full text-center block py-2 text-xs"
                >
                  Crear una cuenta nueva
                </Link>
              </div>
            )}
            
            <p className="text-[10px] text-gray-400 text-center">
              Podrás seleccionar retiro en local o envío a domicilio en el siguiente paso.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
