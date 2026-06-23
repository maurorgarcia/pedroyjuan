import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, User, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { PROVINCES } from '../lib/constants';
import AccountLayout from '../components/account/AccountLayout';

export default function AccountPage() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', phone: '', address: '', city: '', province: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        province: profile.province || '',
      });
    }
  }, [profile, user, navigate]);

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const { error: err } = await supabase.from('profiles').upsert({
      id: user.id,
      ...form,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (err) {
      setError('No pudimos guardar los datos. Intentá de nuevo.');
      return;
    }
    await refreshProfile();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AccountLayout
      title="Mi perfil"
      subtitle="Actualizá tus datos para agilizar el retiro de pedidos en el local."
      active="profile"
    >
      <form onSubmit={handleSave} className="space-y-6">
        {/* Datos personales */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/80">
            <div className="flex items-center gap-2">
              <User size={18} className="text-brand-600" />
              <h2 className="font-bold text-gray-900">Datos personales</h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Nombre y teléfono de contacto</p>
          </div>
          <div className="p-5 sm:p-6 grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre completo</label>
              <input
                className="input-field"
                placeholder="Tu nombre y apellido"
                value={form.full_name}
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="input-field pl-10"
                  placeholder="3364 XX-XXXX"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Ubicación */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/80">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-brand-600" />
              <h2 className="font-bold text-gray-900">Ubicación</h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Opcional — nos ayuda a identificarte en el local</p>
          </div>
          <div className="p-5 sm:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Dirección</label>
              <input
                className="input-field"
                placeholder="Calle y número"
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ciudad</label>
                <input
                  className="input-field"
                  placeholder="San Nicolás de los Arroyos"
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Provincia</label>
                <select
                  className="input-field"
                  value={form.province}
                  onChange={e => setForm(f => ({ ...f, province: e.target.value }))}
                >
                  <option value="">Seleccionar...</option>
                  {PROVINCES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className={`btn-primary py-3 px-8 ${saved ? '!bg-green-600 hover:!bg-green-600' : ''}`}
          >
            {saved ? (
              <>
                <CheckCircle2 size={18} />
                ¡Guardado!
              </>
            ) : (
              <>
                <Save size={18} />
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </>
            )}
          </button>
          {saved && (
            <p className="text-sm text-green-600 font-medium">Tus datos se actualizaron correctamente.</p>
          )}
        </div>
      </form>
    </AccountLayout>
  );
}
