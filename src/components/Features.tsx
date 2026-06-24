import { Truck, Store, CreditCard, Headphones } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Envíos rápidos',
    desc: 'En San Nicolás y zonas aledañas',
  },
  {
    icon: Store,
    title: 'Retiro en local',
    desc: 'Comprá online y retirá gratis',
  },
  {
    icon: CreditCard,
    title: 'Medios de pago',
    desc: 'Tarjetas, transferencias y más',
  },
  {
    icon: Headphones,
    title: 'Soporte y asesoramiento',
    desc: 'Estamos para ayudarte',
  },
];

export default function Features() {
  return (
    <section className="bg-white pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F8F7FD] rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white text-[#5c3e98] flex items-center justify-center flex-shrink-0 shadow-sm border border-brand-100/10">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-bold text-[#2a174d] text-sm md:text-base">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
