import { Link, useNavigate } from 'react-router-dom';
import { User, Package, LogOut, ChevronRight, Shield, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePageMeta } from '../../hooks/usePageMeta';

type NavKey = 'profile' | 'orders';

type Props = {
  title: string;
  subtitle?: string;
  active: NavKey;
  children: React.ReactNode;
};

const NAV: { key: NavKey; icon: typeof User; label: string; href: string; desc: string }[] = [
  { key: 'profile', icon: User, label: 'Mi perfil', href: '/cuenta', desc: 'Datos personales' },
  { key: 'orders', icon: Package, label: 'Mis pedidos', href: '/cuenta/pedidos', desc: 'Historial de compras' },
];

export default function AccountLayout({ title, subtitle, active, children }: Props) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  usePageMeta({ title });

  const initials = profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?';

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de cuenta */}
      <div className="bg-gradient-to-r from-brand-700 to-brand-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-brand-200 text-xs font-semibold uppercase tracking-widest mb-2">Mi cuenta</p>
              <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
              {subtitle && <p className="text-brand-100/80 text-sm mt-1.5">{subtitle}</p>}
            </div>
            <Link
              to="/productos"
              className="inline-flex items-center gap-1.5 text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/15 px-4 py-2 rounded-xl transition-colors w-fit"
            >
              <Home size={15} />
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden lg:sticky lg:top-24">
              {/* Perfil resumido */}
              <div className="p-5 border-b border-gray-100 bg-gradient-to-br from-brand-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-brand-600/20">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">{profile?.full_name || 'Usuario'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Nav desktop */}
              <nav className="p-2 hidden lg:block">
                {NAV.map(item => (
                  <Link
                    key={item.key}
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all mb-0.5 ${
                      active === item.key
                        ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon size={18} className={active === item.key ? 'text-white' : 'text-brand-600'} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{item.label}</p>
                      <p className={`text-xs truncate ${active === item.key ? 'text-brand-100' : 'text-gray-400'}`}>
                        {item.desc}
                      </p>
                    </div>
                    {active !== item.key && <ChevronRight size={14} className="text-gray-300" />}
                  </Link>
                ))}

                {profile?.is_admin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-brand-700 hover:bg-brand-50 transition-colors mt-1"
                  >
                    <Shield size={18} />
                    <span className="font-semibold">Panel admin</span>
                  </Link>
                )}

                <hr className="my-2 border-gray-100" />

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Cerrar sesión</span>
                </button>
              </nav>

              {/* Nav mobile — tabs */}
              <div className="flex lg:hidden border-b border-gray-100">
                {NAV.map(item => (
                  <Link
                    key={item.key}
                    to={item.href}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors ${
                      active === item.key
                        ? 'text-brand-700 border-b-2 border-brand-600 bg-brand-50/50'
                        : 'text-gray-500'
                    }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Logout mobile */}
            <button
              type="button"
              onClick={handleSignOut}
              className="lg:hidden mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-red-100 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </aside>

          {/* Contenido principal */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
