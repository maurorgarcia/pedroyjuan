import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart, User, Search, Menu, X, ChevronDown,
  LogOut, Package, Settings, Dog, Cat, Bird, Fish, Rabbit, Tag, Award, Shield,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { CATALOG } from '../data/catalog';
import { BUSINESS } from '../lib/business';

// ─── Mega-menu panel ────────────────────────────────────────────────────────────
interface MegaMenuProps {
  categoriaId: string;
  onClose: () => void;
}

function MegaMenu({ categoriaId, onClose }: MegaMenuProps) {
  const cat = CATALOG.find(c => c.id === categoriaId);
  if (!cat) return null;

  return (
    <div
      className="w-full bg-white shadow-2xl border-t-2 border-brand-500"
      style={{ animation: 'megaIn 0.16s ease-out forwards' }}
    >
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: `repeat(${cat.subcategorias.length}, minmax(0,1fr))` }}
        >
          {cat.subcategorias.map(sub => (
            <div key={sub.id}>
              {/* Subcategory header — clickable */}
              <Link
                to={`/${cat.id}/${sub.id}`}
                onClick={onClose}
                className="block text-xs font-bold uppercase tracking-widest text-brand-700 mb-3 pb-2 border-b border-brand-100 hover:text-brand-900 transition-colors"
              >
                {sub.label}
              </Link>

              {/* Types */}
              <ul className="space-y-2">
                {sub.tipos.map(tipo => (
                  <li key={tipo.id}>
                    <Link
                      to={`/${cat.id}/${sub.id}/${tipo.id}`}
                      onClick={onClose}
                      className="text-sm text-gray-600 hover:text-brand-700 hover:pl-1 transition-all duration-150 block"
                    >
                      {tipo.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer link */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link
            to={`/${cat.id}`}
            onClick={onClose}
            className="text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors"
          >
            Ver todos los productos de {cat.label} →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Nav items ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'perros', label: 'Perros', href: '/perros', icon: Dog },
  { id: 'gatos', label: 'Gatos', href: '/gatos', icon: Cat },
  { id: 'peces', label: 'Peces', href: '/peces', icon: Fish },
  { id: 'aves', label: 'Aves', href: '/aves', icon: Bird },
  { id: 'otras-especies', label: 'Otras especies', href: '/otras-especies', icon: Rabbit },
  { id: 'ofertas', label: 'Ofertas', href: '/productos?badge=oferta', icon: Tag, special: 'red' as const },
  { id: 'marcas', label: 'Marcas', href: '/marcas', icon: Award, special: 'brand' as const },
];

// ─── Mobile category accordion ─────────────────────────────────────────────────
function MobileCategoryLinks({ categoriaId, onClose }: { categoriaId: string; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const cat = CATALOG.find(c => c.id === categoriaId);
  if (!cat) return null;

  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold text-gray-800 bg-gray-50"
      >
        {cat.label}
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-3 py-2 space-y-1 bg-white">
          <Link to={`/${cat.id}`} onClick={onClose} className="block text-sm text-brand-700 font-medium py-1">
            Ver todo en {cat.label}
          </Link>
          {cat.subcategorias.map(sub => (
            <Link
              key={sub.id}
              to={`/${cat.id}/${sub.id}`}
              onClick={onClose}
              className="block text-sm text-gray-600 py-1 hover:text-brand-700"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMenu(null);
  }, [location]);

  const hasMega = (id: string) => CATALOG.some(c => c.id === id);

  const openMenu = (id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (hasMega(id)) setActiveMenu(id);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 130);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut();
    navigate('/', { replace: true });
  };

  return (
    <>
      <header className={`relative sticky top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        {/* Announcement bar */}
        <div className="bg-brand-700 text-white text-center text-xs sm:text-sm py-2.5 px-4">
          <Link to="/productos?badge=oferta" className="hover:opacity-90 transition-opacity inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
            <span className="font-semibold">{BUSINESS.tagline}</span>
            <span className="hidden sm:inline text-white/70">·</span>
            <span className="font-bold underline underline-offset-2">Ver ofertas →</span>
          </Link>
        </div>

        {/* Main nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img src="/logo_sinfondo.png" alt="Pedro y Juan Petshop" className="h-10 w-auto object-contain" />
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-600">
                <Search size={18} />
              </button>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-1 ml-auto">
              {/* User menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-xs">
                      {profile?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="hidden sm:block max-w-24 truncate">{profile?.full_name || 'Mi cuenta'}</span>
                    <ChevronDown size={14} />
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                        <Link to="/cuenta" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                          <Settings size={15} />Mi perfil
                        </Link>
                        <Link to="/cuenta/pedidos" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                          <Package size={15} />Mis pedidos
                        </Link>
                        {profile?.is_admin && (
                          <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-700 hover:bg-brand-50" onClick={() => setUserMenuOpen(false)}>
                            <Shield size={15} />Panel admin
                          </Link>
                        )}
                        <hr className="my-1" />
                        <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                          <LogOut size={15} />Cerrar sesión
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-600 hover:text-gray-900">
                  <User size={18} />
                  <span className="hidden sm:block">Ingresar</span>
                </Link>
              )}

              {/* Cart */}
              <Link to="/carrito" className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors text-gray-700">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
                <span className="hidden sm:block text-sm">Carrito</span>
              </Link>

              {/* Mobile toggle */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-xl hover:bg-gray-50 transition-colors ml-1">
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* ── Category nav (desktop) ──────────────────────────────────────── */}
          <div
            className="relative hidden md:block"
            onMouseLeave={scheduleClose}
          >
            <nav className="flex items-center gap-0.5 pb-2">
              {NAV_ITEMS.map(item => {
                const isActive = activeMenu === item.id;
                const labelClass =
                  item.special === 'red'
                    ? 'text-red-600 hover:bg-red-50 font-semibold'
                    : item.special === 'brand'
                    ? 'text-brand-700 hover:bg-brand-50 font-semibold'
                    : `text-gray-700 hover:text-brand-700 hover:bg-brand-50 font-medium ${isActive ? 'bg-brand-50 text-brand-700' : ''}`;

                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => openMenu(item.id)}
                  >
                    <Link
                      to={item.href}
                      className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-all duration-150 ${labelClass}`}
                    >
                      {item.label}
                      {hasMega(item.id) && (
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-200 ${isActive ? 'rotate-180 text-brand-600' : 'text-gray-400'}`}
                        />
                      )}
                    </Link>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* ── Mega-menu panel — direct child of header so it spans full width ── */}
        {activeMenu && hasMega(activeMenu) && (
          <div
            className="absolute left-0 right-0 top-full z-50"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <MegaMenu categoriaId={activeMenu} onClose={() => setActiveMenu(null)} />
          </div>
        )}

        {/* ── Mobile menu ─────────────────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in max-h-[70vh] overflow-y-auto">
            <div className="px-4 py-3">
              <form onSubmit={handleSearch} className="flex relative mb-4">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 outline-none text-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={18} />
                </button>
              </form>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {NAV_ITEMS.map(item => {
                  const IconComponent = item.icon;
                  const bgClass = item.special === 'red' ? 'bg-red-50 hover:bg-red-100'
                    : item.special === 'brand' ? 'bg-brand-50 hover:bg-brand-100'
                    : 'bg-gray-50 hover:bg-brand-50';
                  const iconClass = item.special === 'red' ? 'text-red-500'
                    : item.special === 'brand' ? 'text-brand-600'
                    : 'text-brand-600';
                  const textClass = item.special === 'red' ? 'text-red-600'
                    : item.special === 'brand' ? 'text-brand-700'
                    : 'text-gray-700';

                  return (
                    <Link
                      key={item.id}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-colors text-center ${bgClass}`}
                    >
                      <IconComponent size={20} className={iconClass} />
                      <span className={`text-xs font-medium ${textClass}`}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Explorar categorías</p>
                {CATALOG.map(cat => (
                  <MobileCategoryLinks key={cat.id} categoriaId={cat.id} onClose={() => setMobileOpen(false)} />
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <style>{`
        @keyframes megaIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
