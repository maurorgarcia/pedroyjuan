import { MapPin, Clock } from 'lucide-react';
import { BUSINESS } from '../lib/business';

export default function Contact() {
  return (
    <section id="contacto" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title">Visítanos</h2>
          <p className="section-subtitle">Te esperamos en nuestro local en San Nicolás de los Arroyos</p>
        </div>
        
        <div className="max-w-4xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Dirección Column */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-base">Dirección</p>
                <a
                  href={BUSINESS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 text-sm mt-1.5 hover:text-brand-700 transition-colors underline-offset-2 hover:underline block leading-relaxed"
                >
                  {BUSINESS.address}
                </a>
              </div>
            </div>

            {/* Horarios Column */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-base">Horarios</p>
                <p className="text-gray-600 text-sm mt-1.5 leading-relaxed">{BUSINESS.hours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps iFrame */}
        <div className="max-w-6xl mx-auto">
          <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <iframe
              src="https://maps.google.com/maps?q=Bartolom%C3%A9%20Mitre%20360%2C%20San%20Nicol%C3%A1s%20de%20Los%20Arroyos&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Pedro y Juan Petshop"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
