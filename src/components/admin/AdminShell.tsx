import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Mail, ArrowLeft, LogOut, Home,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { href: '/admin/mensajes', label: 'Mensajes', icon: Mail },
];

export default function AdminShell({ children, title }: { children: React.ReactNode; title?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const isActive = (href: string, exact?: boolean) =>
    exact ? location.pathname === href : location.pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-56 bg-gray-900 text-gray-300 flex flex-col flex-shrink-0 hidden md:flex">
        <div className="p-4 border-b border-gray-800">
          <p className="text-white font-bold text-sm">Panel Admin</p>
          <p className="text-xs text-gray-500">Pedro y Juan</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              to={href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive(href, exact) ? 'bg-brand-600 text-white' : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800 space-y-1">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm hover:text-white transition-colors">
            <Home size={16} /> Ver tienda
          </Link>
          <button
            onClick={async () => { await signOut(); navigate('/', { replace: true }); }}
            className="flex items-center gap-2 px-3 py-2 text-sm hover:text-white transition-colors w-full text-left"
          >
            <LogOut size={16} /> Salir
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link to="/admin" className="md:hidden text-gray-500 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">{title ?? 'Administración'}</h1>
          <div className="ml-auto md:hidden flex gap-2 overflow-x-auto">
            {NAV.map(({ href, label }) => (
              <Link key={href} to={href} className="text-xs font-medium text-brand-600 whitespace-nowrap px-2 py-1 bg-brand-50 rounded-lg">
                {label}
              </Link>
            ))}
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
