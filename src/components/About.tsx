import { Store, HeartPulse, Scissors, ArrowRight, MessageCircle } from 'lucide-react';
import { whatsAppUrl, getPhoneById } from '../lib/business';

const SERVICES = [
  {
    id: 'petshop',
    title: 'PETSHOP',
    description: 'Alimentos balanceados premium y económicos, accesorios de paseo, higiene, juguetes y un sector especializado de acuarismo.',
    icon: Store,
    actionText: 'Ver productos',
    actionUrl: '#categorias',
    whatsappMessage: null,
  },
  {
    id: 'veterinaria',
    title: 'VETERINARIA',
    description: 'Consultas clínicas, vacunación, desparasitaciones y atención médica profesional. Cuidamos a tu mascota con calidez y dedicación.',
    icon: HeartPulse,
    actionText: 'Consultar veterinaria',
    actionUrl: null,
    whatsappMessage: 'Hola! Quiero realizar una consulta veterinaria.',
  },
  {
    id: 'peluqueria',
    title: 'PELUQUERÍA',
    description: 'Estética canina y felina integral. Baños higiénicos, corte de raza, despejado de almohadillas y corte de uñas con amor y paciencia.',
    icon: Scissors,
    actionText: 'Pedir turno',
    actionUrl: null,
    whatsappMessage: 'Hola! Quisiera pedir un turno para la peluquería canina.',
  },
];

export default function About() {
  return (
    <section id="servicios" className="py-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Nuestros Servicios</h2>
          <p className="text-gray-505 text-sm mt-2 max-w-xl mx-auto">
            Todo lo que tu mascota necesita en un solo lugar, con la atención y el cuidado familiar de siempre.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map(service => {
            const Icon = service.icon;
            const phoneInfo = getPhoneById(service.id);
            const linkUrl = service.actionUrl || whatsAppUrl(phoneInfo, service.whatsappMessage || undefined);
            const isExternal = !service.actionUrl?.startsWith('#');

            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-wide">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{service.description}</p>
                </div>
                <div>
                  <a
                    href={linkUrl}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800 transition-colors w-full"
                  >
                    {isExternal && <MessageCircle size={16} />}
                    {service.actionText}
                    <ArrowRight size={16} className="ml-auto group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
