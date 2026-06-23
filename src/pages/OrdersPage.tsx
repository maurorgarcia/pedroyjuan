import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ArrowRight, ShoppingBag, ChevronRight, Store } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Order } from '../lib/supabase';
import { formatPrice, ORDER_STATUS } from '../lib/constants';
import AccountLayout from '../components/account/AccountLayout';

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data || []);
        setLoading(false);
      });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <AccountLayout
      title="Mis pedidos"
      subtitle="Seguí el estado de tus compras y retirá en el local cuando estén listas."
      active="orders"
    >
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-28" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 sm:p-14 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-400 flex items-center justify-center mx-auto mb-5">
            <ShoppingBag size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Todavía no hiciste ningún pedido</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Explorá nuestro catálogo, agregá productos al carrito y retirá en Bartolomé Mitre 360.
          </p>
          <Link to="/productos" className="btn-primary inline-flex">
            Ver productos <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 mb-1">{orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'} en total</p>
          {orders.map(order => {
            const status = ORDER_STATUS[order.status] || { label: order.status, className: 'bg-gray-100 text-gray-600' };
            const itemCount = order.order_items?.length || 0;
            return (
              <Link
                key={order.id}
                to={`/cuenta/pedidos/${order.id}`}
                className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-brand-200 hover:shadow-md transition-all"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="hidden sm:flex w-11 h-11 rounded-xl bg-brand-50 text-brand-600 items-center justify-center flex-shrink-0">
                        <Package size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="font-bold text-gray-900">
                            Pedido #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <span className={`badge ${status.className}`}>{status.label}</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          {new Date(order.created_at).toLocaleDateString('es-AR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Store size={12} />
                          {itemCount} {itemCount === 1 ? 'producto' : 'productos'} · Retiro en local
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className="font-bold text-lg text-gray-900">{formatPrice(order.total)}</p>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-500 transition-colors" />
                    </div>
                  </div>

                  {order.order_items && order.order_items.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-50">
                      <div className="flex gap-2 flex-wrap">
                        {order.order_items.slice(0, 4).map(item => (
                          <div
                            key={item.id}
                            className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-1.5"
                          >
                            {item.product_image_url && (
                              <img
                                src={item.product_image_url}
                                alt=""
                                className="w-6 h-6 rounded object-cover"
                                loading="lazy"
                              />
                            )}
                            <span className="text-xs text-gray-700">{item.product_name} ×{item.quantity}</span>
                          </div>
                        ))}
                        {order.order_items.length > 4 && (
                          <span className="text-xs text-gray-400 self-center px-1">
                            +{order.order_items.length - 4} más
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </AccountLayout>
  );
}
