import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthPageLayout from '../components/auth/AuthPageLayout';
import { usePageMeta } from '../hooks/usePageMeta';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  usePageMeta({ title: 'Crear cuenta' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Las contraseñas no coinciden.'); return; }
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
    setLoading(true);
    const { error: err } = await signUp(form.email, form.password, form.fullName);
    setLoading(false);
    if (err) {
      if (err.message?.includes('already registered')) {
        setError('Ya existe una cuenta con ese email.');
      } else {
        setError('Error al crear la cuenta. Por favor intentá de nuevo.');
      }
      return;
    }
    navigate('/', { replace: true });
  };

  const passwordStrength = (pw: string) => {
    if (!pw) return null;
    if (pw.length < 6) return { level: 'weak', label: 'Muy corta', color: 'bg-red-400', width: 'w-1/4' };
    if (pw.length < 8) return { level: 'medium', label: 'Aceptable', color: 'bg-amber-400', width: 'w-1/2' };
    if (pw.match(/[A-Z]/) && pw.match(/[0-9]/)) return { level: 'strong', label: 'Fuerte', color: 'bg-brand-500', width: 'w-full' };
    return { level: 'medium', label: 'Aceptable', color: 'bg-amber-400', width: 'w-2/3' };
  };

  const strength = passwordStrength(form.password);

  return (
    <AuthPageLayout
      title="Crear tu cuenta"
      subtitle="Registrate en un minuto y empezá a pedir con retiro en nuestro local."
      backTo={{ href: '/login', label: 'Ya tengo cuenta' }}
      footer={
        <>
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700">
            Iniciar sesión
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre completo</label>
          <div className="relative">
            <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              required
              className="input-field pl-11"
              placeholder="Tu nombre y apellido"
              value={form.fullName}
              onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
              autoComplete="name"
            />
          </div>
        </div>

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
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              required
              type={showPass ? 'text' : 'password'}
              className="input-field pl-11 pr-12"
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {strength && (
            <div className="mt-2">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
              </div>
              <p className="text-xs text-gray-500 mt-1">Seguridad: {strength.label}</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirmar contraseña</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              required
              type={showPass ? 'text' : 'password'}
              className="input-field pl-11 pr-12"
              placeholder="Repetir contraseña"
              value={form.confirmPassword}
              onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
              autoComplete="new-password"
            />
            {form.confirmPassword && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {form.password === form.confirmPassword
                  ? <CheckCircle size={18} className="text-brand-500" />
                  : <AlertCircle size={18} className="text-red-400" />}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-1">
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <p className="text-xs text-gray-400 text-center leading-relaxed">
          Al registrarte aceptás usar tu cuenta para gestionar pedidos con retiro en local.
        </p>
      </form>
    </AuthPageLayout>
  );
}
