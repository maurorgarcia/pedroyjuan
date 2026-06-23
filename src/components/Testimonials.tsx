import { Star } from 'lucide-react';

const testimonials = [
  { name: 'Facundo G.', pet: 'Reseña de Google', text: 'El mejor petshop de San Nicolás. Tienen una variedad increíble de productos y alimentos de todas las marcas. La sección de acuarismo está muy bien equipada y te atienden de diez.', rating: 5 },
  { name: 'Mariela B.', pet: 'Reseña de Google', text: 'Super recomendable. Llevo a mi perrito a la peluquería y siempre queda hermoso. Además aprovecho a comprarle el alimento porque tienen excelentes precios.', rating: 5 },
  { name: 'Carlos D.', pet: 'Reseña de Google', text: 'Muy buena atención y predisposición. El asesoramiento para armar mi pecera fue excelente, te explican todo con mucha paciencia. El servicio de entrega a domicilio ayuda un montón.', rating: 5 },
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
