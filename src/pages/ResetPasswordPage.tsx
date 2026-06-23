import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Lock, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AuthPageLayout from '../components/auth/AuthPageLayout';
import { usePageMeta } from '../hooks/usePageMeta';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  usePageMeta({ title: 'Nueva contraseña' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setReady(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setReady(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError('No se pudo actualizar la contraseña. Pedí un nuevo enlace.');
      return;
    }
    await supabase.auth.signOut({ scope: 'local' });
    navigate('/login', { replace: true, state: { message: 'password_updated' } });
  };

  if (!ready) {
    return (
      <AuthPageLayout
        title="Enlace no válido"
        subtitle="El enlace expiró o ya fue usado. Pedí uno nuevo para restablecer tu contraseña."
        backTo={{ href: '/recuperar-contrasena', label: 'Pedir nuevo enlace' }}
      >
        <div className="text-center py-4">
          <Link to="/recuperar-contrasena" className="btn-primary w-full">Recuperar contraseña</Link>
          <Link to="/login" className="block mt-3 text-sm text-brand-600 font-medium hover:text-brand-700">
            Volver al login
          </Link>
        </div>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout
      title="Nueva contraseña"
      subtitle="Elegí una contraseña segura. Después vas a poder ingresar con ella."
      backTo={{ href: '/login', label: 'Volver al login' }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña nueva</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              required
              type="password"
              minLength={6}
              className="input-field pl-11"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirmar contraseña</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              required
              type="password"
              minLength={6}
              className="input-field pl-11"
              placeholder="Repetir contraseña"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl">
            <AlertCircle size={16} className="mt-0.5" />
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
          {loading ? 'Guardando...' : 'Guardar contraseña'}
        </button>

        <p className="flex items-center gap-2 text-xs text-gray-400 justify-center">
          <CheckCircle2 size={14} className="text-brand-500" />
          Usá letras y números para mayor seguridad
        </p>
      </form>
    </AuthPageLayout>
  );
}
