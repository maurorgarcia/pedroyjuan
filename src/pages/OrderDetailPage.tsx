import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Package, MapPin, Phone, FileText, ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Order } from '../lib/supabase';
import { formatPrice, ORDER_STATUS } from '../lib/constants';
import AccountLayout from '../components/account/AccountLayout';
import { BUSINESS } from '../lib/business';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (!id) return;
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) setNotFound(true);
        else setOrder(data);
        setLoading(false);
      });
  }, [user, id, navigate]);

  if (!user) return null;

  if (loading) {
    return (
      <AccountLayout title="Detalle del pedido" active="orders">
        <div className="bg-white rounded-2xl border border-gray-100 p-12 animate-pulse">
          <div className="h-6 bg-gray-100 rounded w-48 mb-4" />
          <div className="h-4 bg-gray-100 rounded w-32" />
        </div>
      </AccountLayout>
    );
  }

  if (notFound || !order) {
    return (
      <AccountLayout title="Pedido no encontrado" active="orders">
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-gray-500 mb-4">No encontramos este pedido en tu cuenta.</p>
          <Link to="/cuenta/pedidos" className="btn-primary inline-flex">Ver mis pedidos</Link>
        </div>
      </AccountLayout>
    );
  }

  const status = ORDER_STATUS[order.status] ?? { label: order.status, className: 'bg-gray-100 text-gray-600' };

  return (
    <AccountLayout title="Detalle del pedido" active="orders">
      <Link
        to="/cuenta/pedidos"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-700 font-medium mb-4 transition-colors"
      >
        <ChevronLeft size={16} />
        Volver a mis pedidos
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Encabezado */}
        <div className="px-5 sm:px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-brand-50/80 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-600 text-white flex items-center justify-center">
                <Package size={20} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">
                  Pedido #{order.id.slice(0, 8).toUpperCase()}
                </h2>
                <p className="text-xs text-gray-400">
                  {new Date(order.created_at).toLocaleString('es-AR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <span className={`badge text-sm px-3 py-1 ${status.className}`}>{status.label}</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Retiro */}
          <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={18} className="text-brand-600" />
              <h3 className="font-bold text-gray-900 text-sm">Retiro en local</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{BUSINESS.address}</p>
            {order.shipping_phone && (
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-1.5">
                <Phone size={14} className="text-gray-400" />
                {order.shipping_phone}
              </p>
            )}
            <a
              href={BUSINESS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-brand-600 font-semibold hover:text-brand-700 mt-3"
            >
              Ver cómo llegar →
            </a>
          </div>

          {/* Productos */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-3">Productos</h3>
            <div className="divide-y divide-gray-50 rounded-xl border border-gray-100 overflow-hidden">
              {order.order_items?.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-4 px-4 py-3 bg-white">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.product_image_url ? (
                      <img
                        src={item.product_image_url}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Package size={18} className="text-gray-300" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{item.product_name}</p>
                      {item.product_brand && (
                        <p className="text-xs text-gray-400">{item.product_brand}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-0.5">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm flex-shrink-0">
                    {formatPrice(item.unit_price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {order.notes && (
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <FileText size={16} className="text-gray-400" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notas</p>
              </div>
              <p className="text-sm text-gray-700">{order.notes}</p>
            </div>
          )}

          {/* Total */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="font-bold text-gray-900">Total del pedido</span>
            <span className="font-bold text-2xl text-brand-700">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
