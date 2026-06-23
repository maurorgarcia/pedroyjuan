import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthPageLayout from '../components/auth/AuthPageLayout';
import { usePageMeta } from '../hooks/usePageMeta';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  usePageMeta({ title: 'Ingresar' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(form.email, form.password);
    setLoading(false);
    if (err) {
      setError('Email o contraseña incorrectos. Verificá tus datos e intentá de nuevo.');
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <AuthPageLayout
      title="Bienvenido de vuelta"
      subtitle="Ingresá a tu cuenta para ver tus pedidos y completar compras con retiro en local."
      footer={
        <>
          ¿No tenés cuenta?{' '}
          <Link to="/registro" className="text-brand-600 font-semibold hover:text-brand-700">
            Crear cuenta gratis
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              required
              type="email"
              className="input-field pl-11"
              placeholder="tu@email.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-gray-700">Contraseña</label>
            <Link to="/recuperar-contrasena" className="text-xs text-brand-600 font-semibold hover:text-brand-700">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              required
              type={showPass ? 'text' : 'password'}
              className="input-field pl-11 pr-12"
              placeholder="Tu contraseña"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
          {loading ? 'Ingresando...' : 'Ingresar a mi cuenta'}
        </button>
      </form>
    </AuthPageLayout>
  );
}
