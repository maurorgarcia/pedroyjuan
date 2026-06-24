import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart, User, Search, Menu, X, ChevronDown,
  LogOut, Package, Settings, Dog, Cat, Bird, Fish, Rabbit, Tag, Award, Shield, Heart, Truck,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { CATALOG } from '../data/catalog';

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
  const { totalItems, setCartOpen } = useCart();
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

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

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
        <div className="bg-[#5c3e98] text-white text-[11px] sm:text-xs py-2.5 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 md:gap-10">
            <span className="flex items-center gap-1.5 font-medium">
              <Dog size={12} /> Petshop • Veterinaria • Peluquería en San Nicolás
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Truck size={12} /> Pedí online, retirá en el local y ahorrá tiempo
            </span>
            <Link to="/productos?badge=oferta" className="flex items-center gap-1.5 font-semibold underline hover:text-brand-200 transition-colors">
              <Heart size={12} className="fill-none" /> Ver ofertas especiales →
            </Link>
          </div>
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
                className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm bg-gray-50/50"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-600">
                <Search size={18} />
              </button>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 ml-auto">
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
                  <span className="hidden sm:block font-medium">Ingresar</span>
                </Link>
              )}

              {/* Favoritos */}
              <Link to="/productos?badge=favorito" className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-600 hover:text-gray-900">
                <Heart size={18} />
                <span className="hidden sm:block font-medium">Favoritos</span>
              </Link>

              {/* Cart */}
              <button 
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
              >
                <ShoppingCart size={18} />
                <span className="hidden sm:block text-sm font-medium">Carrito</span>
                <span className="inline-block bg-[#5c3e98] text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              </button>

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
          <div className="fixed inset-0 z-50 md:hidden flex justify-end">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity duration-300"
              onClick={() => setMobileOpen(false)}
            />
            
            {/* Drawer Body */}
            <div className="relative w-full max-w-[280px] bg-white h-full shadow-2xl flex flex-col z-10 p-5 overflow-y-auto animate-slide-in">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
                <img src="/logo_sinfondo.png" alt="Logo" className="h-9 w-auto object-contain" />
                <button 
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSearch} className="flex relative mb-6">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm bg-gray-50/50"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={18} />
                </button>
              </form>

              {/* Main Links */}
              <div className="space-y-1 mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 mb-2">Menú</p>
                {NAV_ITEMS.map(item => {
                  const IconComponent = item.icon;
                  const textClass = item.special === 'red' ? 'text-red-600 hover:bg-red-50'
                    : item.special === 'brand' ? 'text-brand-700 hover:bg-brand-50'
                    : 'text-gray-700 hover:bg-gray-50';

                  return (
                    <Link
                      key={item.id}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${textClass}`}
                    >
                      <IconComponent size={18} className="text-[#5c3e98] flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* CategoriesAccordion */}
              <div className="border-t border-gray-100 pt-5 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 mb-2">Categorías</p>
                <div className="space-y-1.5">
                  {CATALOG.map(cat => (
                    <MobileCategoryLinks key={cat.id} categoriaId={cat.id} onClose={() => setMobileOpen(false)} />
                  ))}
                </div>
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
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  );
}
