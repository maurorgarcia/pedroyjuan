import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminShell from '../../components/admin/AdminShell';
import { supabase, Order } from '../../lib/supabase';
import { formatPrice, ORDER_STATUS } from '../../lib/constants';
import { usePageMeta } from '../../hooks/usePageMeta';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  usePageMeta({ title: 'Admin — Pedidos' });

  useEffect(() => {
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <AdminShell title="Pedidos">
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No hay pedidos todavía.</p>
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const status = ORDER_STATUS[order.status] ?? { label: order.status, className: 'bg-gray-100 text-gray-600' };
            return (
              <Link
                key={order.id}
                to={`/admin/pedidos/${order.id}`}
                className="block bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-gray-900 text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <span className={`badge ${status.className}`}>{status.label}</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleString('es-AR')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.order_items?.length ?? 0} productos · Retiro en local · {order.shipping_phone}
                    </p>
                  </div>
                  <p className="font-bold text-gray-900">{formatPrice(order.total)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
