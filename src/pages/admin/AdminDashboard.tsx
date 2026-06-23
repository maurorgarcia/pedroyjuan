import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Mail, AlertTriangle } from 'lucide-react';
import AdminShell from '../../components/admin/AdminShell';
import { supabase } from '../../lib/supabase';
import { usePageMeta } from '../../hooks/usePageMeta';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, pending: 0, messages: 0, lowStock: 0 });

  usePageMeta({ title: 'Admin', description: 'Panel de administración' });

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('id, stock', { count: 'exact' }),
      supabase.from('orders').select('id, status', { count: 'exact' }),
      supabase.from('contact_messages').select('id', { count: 'exact' }),
    ]).then(([productsRes, ordersRes, messagesRes]) => {
      const products = productsRes.data ?? [];
      setStats({
        products: productsRes.count ?? products.length,
        orders: ordersRes.count ?? 0,
        pending: (ordersRes.data ?? []).filter(o => o.status === 'pending').length,
        messages: messagesRes.count ?? 0,
        lowStock: products.filter(p => p.stock <= 3).length,
      });
    });
  }, []);

  const cards = [
    { label: 'Productos', value: stats.products, icon: Package, href: '/admin/productos', color: 'bg-brand-50 text-brand-700' },
    { label: 'Pedidos', value: stats.orders, icon: ShoppingBag, href: '/admin/pedidos', color: 'bg-blue-50 text-blue-700' },
    { label: 'Pendientes', value: stats.pending, icon: AlertTriangle, href: '/admin/pedidos', color: 'bg-amber-50 text-amber-700' },
    { label: 'Mensajes', value: stats.messages, icon: Mail, href: '/admin/mensajes', color: 'bg-green-50 text-green-700' },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <Link key={c.label} to={c.href} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
              <c.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{c.value}</p>
            <p className="text-sm text-gray-500">{c.label}</p>
          </Link>
        ))}
      </div>

      {stats.lowStock > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          {stats.lowStock} producto{stats.lowStock !== 1 ? 's' : ''} con stock bajo (≤ 3 unidades).{' '}
          <Link to="/admin/productos" className="font-semibold underline">Revisar →</Link>
        </div>
      )}
    </AdminShell>
  );
}
