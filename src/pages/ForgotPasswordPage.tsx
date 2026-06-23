import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Mail, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AuthPageLayout from '../components/auth/AuthPageLayout';
import { usePageMeta } from '../hooks/usePageMeta';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  usePageMeta({ title: 'Recuperar contraseña' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/restablecer-contrasena`,
    });
    setLoading(false);
    if (err) {
      setError('No pudimos enviar el email. Verificá la dirección e intentá de nuevo.');
      return;
    }
    setSent(true);
  };

  return (
    <AuthPageLayout
      title="Recuperar contraseña"
      subtitle="Te enviaremos un enlace seguro a tu email para elegir una contraseña nueva."
      backTo={{ href: '/login', label: 'Volver al login' }}
    >
      {sent ? (
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} />
          </div>
          <h2 className="font-bold text-gray-900 mb-2">Email enviado</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Revisá tu casilla (y la carpeta de spam). El enlace expira en 1 hora.
          </p>
          <Link to="/login" className="btn-secondary w-full">Volver al login</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email de tu cuenta</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                required
                type="email"
                className="input-field pl-11"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </button>
        </form>
      )}
    </AuthPageLayout>
  );
}
