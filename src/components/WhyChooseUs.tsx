import { PawPrint, Store, Award, Heart } from 'lucide-react';

const reasons = [
  {
    icon: PawPrint,
    title: '+10 años de experiencia',
    desc: 'Acompañando a miles de mascotas y sus familias.',
  },
  {
    icon: Store,
    title: 'Todo en un solo lugar',
    desc: 'Petshop, veterinaria y peluquería.',
  },
  {
    icon: Award,
    title: 'Calidad garantizada',
    desc: 'Trabajamos con las mejores marcas.',
  },
  {
    icon: Heart,
    title: 'Compromiso y amor',
    desc: 'Nos apasionan los animales y lo que hacemos.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8 tracking-tight">
          ¿Por qué elegirnos?
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {reasons.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-center gap-4 bg-gray-50/60 hover:bg-[#F4EFFF]/40 border border-gray-100 rounded-2xl p-5 transition-all duration-200 hover:shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-white text-[#5c3e98] flex items-center justify-center flex-shrink-0 shadow-sm border border-brand-100/10">
                <Icon size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{title}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
