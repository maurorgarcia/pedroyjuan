import { Store, Clock, Shield, HeartHandshake, MapPin, CheckCircle, MessageCircle } from 'lucide-react';
import { BUSINESS, whatsAppUrl, PRIMARY_PHONE } from '../lib/business';

export default function Features() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 divide-y md:divide-y-0 lg:divide-x divide-gray-200/80">
            
            {/* Feature 1 */}
            <div className="flex flex-col items-start pb-6 md:pb-0 md:pr-4 lg:px-6 first:pl-0">
              <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-4 flex-shrink-0">
                <Store size={22} />
              </div>
              <h4 className="font-bold text-gray-900 text-base">Retiro en local</h4>
              <p className="text-gray-500 text-xs mt-1.5 leading-relaxed min-h-[32px]">
                Pedí online y retirá en Bartolomé Mitre 360
              </p>
              <a
                href={BUSINESS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800 transition-colors mt-4"
              >
                <MapPin size={13} />
                Ver en el mapa
              </a>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-start pt-6 md:pt-0 md:pr-4 lg:px-6">
              <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-4 flex-shrink-0">
                <Clock size={22} />
              </div>
              <h4 className="font-bold text-gray-900 text-base">Horarios de atención</h4>
              <p className="text-gray-500 text-xs mt-1.5 leading-relaxed min-h-[32px]">
                {BUSINESS.hoursShort}
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-brand-100 text-brand-700 px-2.5 py-0.5 rounded-full mt-4">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse"></span>
                Abierto ahora
              </span>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-start pt-6 md:pt-0 md:pr-4 lg:px-6">
              <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-4 flex-shrink-0">
                <Shield size={22} />
              </div>
              <h4 className="font-bold text-gray-900 text-base">Productos originales</h4>
              <p className="text-gray-500 text-xs mt-1.5 leading-relaxed min-h-[32px]">
                Solo marcas certificadas y garantizadas
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 mt-4">
                <CheckCircle size={13} className="text-brand-600" />
                Conocé más
              </span>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-start pt-6 md:pt-0 lg:pl-6 last:pr-0">
              <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-4 flex-shrink-0">
                <HeartHandshake size={22} />
              </div>
              <h4 className="font-bold text-gray-900 text-base">Asesoramiento gratis</h4>
              <p className="text-gray-500 text-xs mt-1.5 leading-relaxed min-h-[32px]">
                Te ayudamos a elegir lo mejor para tu mascota
              </p>
              <a
                href={whatsAppUrl(PRIMARY_PHONE, 'Hola! Quisiera recibir asesoramiento sobre un producto.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800 transition-colors mt-4"
              >
                <MessageCircle size={13} />
                Escríbenos
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
