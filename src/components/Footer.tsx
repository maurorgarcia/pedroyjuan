import { Link } from 'react-router-dom';
import { MapPin, Clock, Instagram, MessageCircle, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../lib/constants';
import { BUSINESS, whatsAppUrl, PRIMARY_PHONE } from '../lib/business';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      
      {/* WhatsApp Help Banner */}
      <div className="bg-[#5c3e98] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-white">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.733-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.528 1.97 14.07 1.048 11.998 1.048 6.561 1.048 2.138 5.42 2.134 10.849c-.002 1.714.463 3.39 1.347 4.886l-.991 3.616 3.697-.97zM15.75 13.56c-.285-.143-1.688-.832-1.948-.927-.261-.095-.45-.143-.64.143-.19.285-.736.927-.902 1.116-.167.19-.333.214-.618.071-.285-.143-1.202-.443-2.29-1.411-.847-.756-1.42-1.689-1.586-1.975-.166-.285-.018-.44.124-.581.129-.126.285-.333.428-.5.143-.166.19-.285.285-.475.095-.19.048-.356-.024-.5-.071-.143-.64-1.543-.877-2.112-.23-.556-.464-.48-.64-.488-.166-.008-.356-.01-.546-.01-.19 0-.5.071-.76.356-.261.285-.998.975-.998 2.378 0 1.402 1.02 2.756 1.163 2.946.143.19 2.01 3.06 4.869 4.29.68.292 1.21.467 1.624.598.684.217 1.307.186 1.8.113.55-.082 1.687-.688 1.925-1.353.237-.665.237-1.235.166-1.353-.071-.118-.261-.19-.546-.333z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm sm:text-base leading-snug">¿Tenés dudas o necesitás ayuda?</p>
              <p className="text-white/80 text-xs sm:text-sm mt-0.5">Escribinos por WhatsApp y te asesoramos.</p>
            </div>
          </div>
          <a
            href={whatsAppUrl(PRIMARY_PHONE, 'Hola! Necesito ayuda con mi compra.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[#5c3e98] text-xs sm:text-sm font-extrabold py-3 px-6 rounded-xl transition-all shadow-sm"
          >
            Chatear por WhatsApp
            <ArrowRight size={15} />
          </a>
        </div>
      </div>

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
              <li><Link to="/#servicios" className="text-sm hover:text-white transition-colors">Servicios</Link></li>
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
              <li className="flex items-start gap-2 text-sm">
                <Clock size={15} className="mt-0.5 flex-shrink-0 text-brand-400" />
                <span>{BUSINESS.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Pedro y Juan. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-400">
            <Link to="/terminos" className="hover:text-white transition-colors">Términos y condiciones</Link>
            <Link to="/privacidad" className="hover:text-white transition-colors">Política de privacidad</Link>
            <Link to="/#contacto" className="hover:text-white transition-colors">Contacto</Link>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
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
