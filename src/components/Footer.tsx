import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, Instagram, MessageCircle } from 'lucide-react';
import { CATEGORIES } from '../lib/constants';
import { BUSINESS, whatsAppUrl, PRIMARY_PHONE } from '../lib/business';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo_sinfondo.png" alt="Pedro y Juan Petshop" className="h-12 w-auto object-contain" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Tu petshop de confianza en San Nicolás. Petshop, veterinaria y peluquería para tu mascota.
            </p>
            <div className="flex gap-3">
              <a href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-brand-600 flex items-center justify-center transition-colors">
                <Instagram size={16} />
              </a>
              <a href={whatsAppUrl(PRIMARY_PHONE)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Petshop" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-green-600 flex items-center justify-center transition-colors">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Categorías</h3>
            <ul className="space-y-2">
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <Link to={`/${cat.id}`} className="text-sm hover:text-white transition-colors">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Mi cuenta</h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-sm hover:text-white transition-colors">Iniciar sesión</Link></li>
              <li><Link to="/registro" className="text-sm hover:text-white transition-colors">Crear cuenta</Link></li>
              <li><Link to="/carrito" className="text-sm hover:text-white transition-colors">Mi carrito</Link></li>
              <li><Link to="/cuenta/pedidos" className="text-sm hover:text-white transition-colors">Mis pedidos</Link></li>
              <li><Link to="/#nosotros" className="text-sm hover:text-white transition-colors">Nosotros</Link></li>
              <li><Link to="/#contacto" className="text-sm hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Información</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin size={15} className="mt-0.5 flex-shrink-0 text-brand-400" />
                <a
                  href={BUSINESS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors underline-offset-2 hover:underline"
                >
                  {BUSINESS.address}
                </a>
              </li>
              {BUSINESS.phones.map(phone => (
                <li key={phone.id} className="flex items-start gap-2 text-sm">
                  <Phone size={15} className="mt-0.5 flex-shrink-0 text-brand-400" />
                  <div>
                    <p className="text-gray-400 text-xs">{phone.label}</p>
                    <a href={`tel:${phone.tel}`} className="hover:text-white transition-colors">{phone.display}</a>
                  </div>
                </li>
              ))}
              <li className="flex items-start gap-2 text-sm">
                <Clock size={15} className="mt-0.5 flex-shrink-0 text-brand-400" />
                <span>{BUSINESS.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Pedro y Juan. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Desarrollado por</span>
            <a href="https://mrgarciadev.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity flex items-center">
              <img src="/logoMrgDeve.png" alt="MrgDeve Logo" className="h-5 w-auto object-contain" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
