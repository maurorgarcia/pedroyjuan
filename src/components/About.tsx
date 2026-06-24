import { ArrowRight, MessageCircle } from 'lucide-react';
import { whatsAppUrl, getPhoneById } from '../lib/business';

const SERVICES = [
  {
    id: 'petshop',
    title: 'PETSHOP',
    description: 'Alimentos, juguetes, accesorios y más para todas las mascotas.',
    actionText: 'Ver productos',
    actionUrl: '#categorias',
    whatsappMessage: null,
    bgColor: 'bg-[#F4EFFF]',
    btnColor: 'bg-[#5c3e98] hover:bg-[#4b3180]',
    textColor: 'text-[#2a174d]',
    descColor: 'text-[#4a3a6b]',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'veterinaria',
    title: 'VETERINARIA',
    description: 'Consultas, vacunación, controles y todo el cuidado que tu mascota necesita.',
    actionText: 'Solicitar turno',
    actionUrl: null,
    whatsappMessage: 'Hola! Quiero solicitar un turno de veterinaria.',
    bgColor: 'bg-[#E6F7F5]',
    btnColor: 'bg-[#148270] hover:bg-[#0f6254]',
    textColor: 'text-[#0a3a32]',
    descColor: 'text-[#1c5c50]',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'peluqueria',
    title: 'PELUQUERÍA',
    description: 'Baño, corte, limpieza dental y estética para que se vea y se sienta mejor.',
    actionText: 'Reservar turno',
    actionUrl: null,
    whatsappMessage: 'Hola! Quisiera reservar un turno para la peluquería canina.',
    bgColor: 'bg-[#FFF0F5]',
    btnColor: 'bg-[#C23B68] hover:bg-[#9c2f53]',
    textColor: 'text-[#470f23]',
    descColor: 'text-[#732543]',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=compress&cs=tinysrgb&w=300',
  },
];

export default function About() {
  return (
    <section id="servicios" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8 tracking-tight">
          Nuestros servicios
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map(service => {
            const phoneInfo = getPhoneById(service.id);
            const linkUrl = service.actionUrl || whatsAppUrl(phoneInfo, service.whatsappMessage || undefined);
            const isExternal = !service.actionUrl?.startsWith('#');

            return (
              <div
                key={service.id}
                className={`${service.bgColor} rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[200px] group transition-all duration-300 hover:shadow-md`}
              >
                {/* Left side info */}
                <div className="w-[58%] z-10 flex flex-col justify-between h-full">
                  <div>
                    <h3 className={`text-lg font-extrabold tracking-wider ${service.textColor} mb-2`}>
                      {service.title}
                    </h3>
                    <p className={`text-xs leading-relaxed mb-6 font-medium ${service.descColor}`}>
                      {service.description}
                    </p>
                  </div>

                  <a
                    href={linkUrl}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className={`inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white ${service.btnColor} py-2.5 px-4 rounded-xl transition-colors w-fit`}
                  >
                    {isExternal && <MessageCircle size={13} />}
                    {service.actionText}
                    <ArrowRight size={13} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>

                {/* Right side absolute image overlay */}
                <div className="absolute right-0 bottom-0 w-[42%] h-[90%] flex items-end justify-end pointer-events-none">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-contain object-bottom mix-blend-multiply group-hover:scale-102 transition-transform duration-300"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
