import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: '¿Cómo coordino el pago de mi pedido?',
    a: 'Todos los pagos se realizan de forma offline para tu mayor comodidad. Aceptamos efectivo en mano, transferencia bancaria, Mercado Pago o tarjeta de débito/crédito al momento de retirar en el local o recibir la entrega a domicilio.'
  },
  {
    q: '¿Hacen envíos a domicilio y en qué zonas?',
    a: 'Sí, hacemos envíos a domicilio en la ciudad de San Nicolás de Los Arroyos. Podés elegir esta opción al finalizar tu compra. La entrega de bolsas pesadas de alimento o accesorios voluminosos es coordinada directamente con vos para tu comodidad.'
  },
  {
    q: '¿Cuánto demora en estar listo mi pedido?',
    a: 'Los pedidos de retiro en local suelen prepararse en un plazo de 2 a 4 horas hábiles. Para envíos a domicilio, despachamos en el día o al día siguiente. En ambos casos, te notificamos de inmediato a tu teléfono de contacto.'
  },
  {
    q: '¿Qué necesito presentar para retirar en el local?',
    a: 'No hace falta imprimir nada. Solo con acercarte al local (Bartolomé Mitre 360) y mencionar tu nombre o el código del pedido que te figura en pantalla (o que te enviamos por correo/WhatsApp) es suficiente.'
  }
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1 bg-brand-100 text-brand-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
            <HelpCircle size={13} /> Centro de Ayuda
          </span>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
            Preguntas Frecuentes
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Todo lo que necesitas saber sobre las compras y nuestros servicios
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-800 hover:text-brand-700 transition-colors gap-4"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown 
                    size={18} 
                    className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-brand-600' : ''
                    }`}
                  />
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-48 border-t border-gray-50' : 'max-h-0'
                  } overflow-hidden`}
                >
                  <p className="p-5 text-sm text-gray-600 leading-relaxed bg-gray-50/50">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
