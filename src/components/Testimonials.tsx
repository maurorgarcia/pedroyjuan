import { Star } from 'lucide-react';

const testimonials = [
  { name: 'Laura M.', pet: 'Copito (perro)', text: 'Excelente atencion y productos de primera calidad. Copito esta feliz con su nueva comida y siempre encuentro todo lo que necesito.', rating: 5 },
  { name: 'Marcos R.', pet: 'Michi y Luna (gatos)', text: 'El mejor petshop del barrio sin dudas. Me ayudaron a elegir la mejor arenera y los precios son muy convenientes.', rating: 5 },
  { name: 'Sofia G.', pet: 'Pipa (canario)', text: 'Muy buen servicio y variedad. Pedro y Juan siempre me aconsejan bien y tienen todo lo que necesito para mi canario.', rating: 5 },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title">Lo que dicen nuestros clientes</h2>
          <p className="section-subtitle">La felicidad de sus mascotas, nuestra mayor satisfaccion</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="card p-6">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed mb-4 text-sm">"{t.text}"</p>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <p className="text-xs text-gray-400">{t.pet}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
