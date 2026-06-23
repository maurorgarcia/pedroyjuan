import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminShell from '../../components/admin/AdminShell';
import { supabase, Order } from '../../lib/supabase';
import { formatPrice, ORDER_STATUS } from '../../lib/constants';
import { usePageMeta } from '../../hooks/usePageMeta';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  usePageMeta({ title: 'Detalle de pedido' });

  const load = () => {
    if (!id) return;
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setOrder(data);
        setLoading(false);
      });
  };

  useEffect(load, [id]);

  const updateStatus = async (status: string) => {
    if (!id) return;
    setSaving(true);
    await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    setSaving(false);
    load();
  };

  if (loading || !order) {
    return (
      <AdminShell title="Pedido">
        <div className="animate-pulse h-48 bg-white rounded-2xl" />
      </AdminShell>
    );
  }

  const status = ORDER_STATUS[order.status] ?? { label: order.status, className: '' };

  return (
    <AdminShell title={`Pedido #${order.id.slice(0, 8).toUpperCase()}`}>
      <Link to="/admin/pedidos" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft size={16} /> Volver a pedidos
      </Link>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Estado</p>
            <span className={`badge ${status.className}`}>{status.label}</span>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Cambiar estado</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(s => (
                <button
                  key={s}
                  disabled={saving || order.status === s}
                  onClick={() => updateStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    order.status === s ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 hover:border-brand-300'
                  }`}
                >
                  {ORDER_STATUS[s]?.label ?? s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Retiro en local</p>
            <p className="text-sm text-gray-700">{order.shipping_address}</p>
            <p className="text-sm text-gray-500">{order.shipping_phone}</p>
          </div>
          {order.notes && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Notas</p>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
          <p className="text-xl font-bold text-gray-900">Total: {formatPrice(order.total)}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="font-semibold text-gray-900 mb-4">Productos</p>
          <div className="space-y-3">
            {order.order_items?.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-900">{item.product_name}</p>
                  <p className="text-gray-400">x{item.quantity}</p>
                </div>
                <p className="font-medium">{formatPrice(item.unit_price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
