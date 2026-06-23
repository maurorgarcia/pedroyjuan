import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import AdminShell from '../../components/admin/AdminShell';
import { supabase, Product } from '../../lib/supabase';
import { CATALOG } from '../../data/catalog';
import { uploadProductImage } from '../../lib/storage';
import { usePageMeta } from '../../hooks/usePageMeta';

const BADGES = ['', 'oferta', 'nuevo', 'mas-vendido'];

type FormData = {
  name: string;
  brand: string;
  description: string;
  price: string;
  original_price: string;
  category: string;
  subcategory: string;
  type: string;
  image_url: string;
  stock: string;
  badge: string;
  active: boolean;
};

const empty: FormData = {
  name: '', brand: '', description: '', price: '', original_price: '',
  category: 'perros', subcategory: '', type: '', image_url: '',
  stock: '0', badge: '', active: true,
};

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isNew = !id || id === 'nuevo';
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  usePageMeta({ title: isNew ? 'Nuevo producto' : 'Editar producto' });

  const catData = CATALOG.find(c => c.id === form.category);
  const subData = catData?.subcategorias.find(s => s.id === form.subcategory);

  useEffect(() => {
    if (isNew) return;
    supabase.from('products').select('*').eq('id', id!).single().then(({ data }) => {
      if (data) {
        const p = data as Product;
        setForm({
          name: p.name,
          brand: p.brand ?? '',
          description: p.description ?? '',
          price: String(p.price),
          original_price: p.original_price ? String(p.original_price) : '',
          category: p.category,
          subcategory: p.subcategory ?? '',
          type: p.type ?? '',
          image_url: p.image_url ?? '',
          stock: String(p.stock),
          badge: p.badge ?? '',
          active: p.active,
        });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadProductImage(file);
      setForm(f => ({ ...f, image_url: url }));
    } catch {
      setError('Error al subir la imagen. Verificá que ejecutaste la migración de storage.');
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim() || null,
      description: form.description.trim() || null,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      category: form.category,
      subcategory: form.subcategory || null,
      type: form.type || null,
      image_url: form.image_url || null,
      stock: parseInt(form.stock, 10),
      badge: form.badge || null,
      active: form.active,
    };

    const { error: err } = isNew
      ? await supabase.from('products').insert(payload)
      : await supabase.from('products').update(payload).eq('id', id!);

    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    navigate('/admin/productos');
  };

  if (loading) {
    return (
      <AdminShell title="Cargando...">
        <div className="animate-pulse h-64 bg-white rounded-2xl" />
      </AdminShell>
    );
  }

  return (
    <AdminShell title={isNew ? 'Nuevo producto' : 'Editar producto'}>
      <Link to="/admin/productos" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft size={16} /> Volver a productos
      </Link>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input required className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
            <input className="input-field" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
            <select className="input-field" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}>
              <option value="">Ninguno</option>
              {BADGES.filter(Boolean).map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea rows={3} className="input-field resize-none" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
            <input required type="number" min="0" step="0.01" className="input-field" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio original</label>
            <input type="number" min="0" step="0.01" className="input-field" value={form.original_price} onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
            <input required type="number" min="0" className="input-field" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
            <select required className="input-field" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value, subcategory: '', type: '' }))}>
              {CATALOG.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategoría</label>
            <select className="input-field" value={form.subcategory} onChange={e => setForm(f => ({ ...f, subcategory: e.target.value, type: '' }))}>
              <option value="">—</option>
              {catData?.subcategorias.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select className="input-field" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="">—</option>
              {subData?.tipos.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
          <div className="flex items-start gap-4">
            {form.image_url && (
              <img src={form.image_url} alt="" className="w-20 h-20 rounded-xl object-cover border" />
            )}
            <label className="btn-secondary cursor-pointer text-sm py-2">
              <Upload size={16} />
              {uploading ? 'Subiendo...' : 'Subir imagen'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
          <input className="input-field mt-2 text-sm" placeholder="O pegá una URL" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
          Producto activo (visible en la tienda)
        </label>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Guardando...' : isNew ? 'Crear producto' : 'Guardar cambios'}
          </button>
          <Link to="/admin/productos" className="btn-secondary">Cancelar</Link>
        </div>
      </form>
    </AdminShell>
  );
}
