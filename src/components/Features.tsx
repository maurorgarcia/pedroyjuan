import { Store, Clock, Shield, HeartHandshake } from 'lucide-react';
import { BUSINESS } from '../lib/business';

const features = [
  { icon: Store, title: 'Retiro en local', desc: 'Pedí online y retirá en Bartolomé Mitre 360', color: 'text-brand-600 bg-brand-50' },
  { icon: Clock, title: 'Horarios de atención', desc: BUSINESS.hoursShort, color: 'text-blue-600 bg-blue-50' },
  { icon: Shield, title: 'Productos originales', desc: 'Solo marcas certificadas y garantizadas', color: 'text-amber-600 bg-amber-50' },
  { icon: HeartHandshake, title: 'Asesoramiento gratis', desc: 'Te ayudamos a elegir lo mejor para tu mascota', color: 'text-rose-600 bg-rose-50' },
];

export default function Features() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="flex items-start gap-3 p-3 sm:p-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
