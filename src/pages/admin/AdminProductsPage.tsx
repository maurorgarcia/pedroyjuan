import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AdminShell from '../../components/admin/AdminShell';
import { supabase, Product } from '../../lib/supabase';
import { formatPrice } from '../../lib/constants';
import { usePageMeta } from '../../hooks/usePageMeta';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  usePageMeta({ title: 'Admin — Productos' });

  const load = () => {
    setLoading(true);
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProducts(data ?? []);
        setLoading(false);
      });
  };

  useEffect(load, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    await supabase.from('products').update({ active: false }).eq('id', id);
    load();
  };

  return (
    <AdminShell title="Productos">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">{products.length} productos</p>
        <Link to="/admin/productos/nuevo" className="btn-primary text-sm py-2">
          <Plus size={16} /> Nuevo producto
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3">Producto</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Categoría</th>
                  <th className="text-right px-4 py-3">Precio</th>
                  <th className="text-right px-4 py-3">Stock</th>
                  <th className="text-right px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => (
                  <tr key={p.id} className={!p.active ? 'opacity-50' : ''}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image_url ? (
                          <img src={p.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" loading="lazy" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{p.name}</p>
                          {p.brand && <p className="text-xs text-gray-400">{p.brand}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                      {p.category}{p.subcategory ? ` / ${p.subcategory}` : ''}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatPrice(p.price)}</td>
                    <td className={`px-4 py-3 text-right font-medium ${p.stock <= 3 ? 'text-red-600' : ''}`}>
                      {p.stock}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link to={`/admin/productos/${p.id}`} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                          <Pencil size={15} />
                        </Link>
                        <button onClick={() => handleDelete(p.id, p.name)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
