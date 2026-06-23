import { Calendar, Star } from 'lucide-react';

export default function About() {
  return (
    <section id="nosotros" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-brand-100 text-brand-700 text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
              <Calendar size={15} /> 10+ años en el barrio
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pedro y Juan — Cosa de Perros</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Somos un espacio integral en San Nicolás de Los Arroyos pensado para cubrir todas las necesidades de tus mascotas. Funcionamos como un Petshop completo, Veterinaria y Peluquería Canina, buscando darte siempre el cuidado y la atención que tu compañero merece.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              En nuestra tienda vas a encontrar una inmensa variedad de alimentos (desde marcas premium hasta opciones económicas), accesorios de higiene, juguetes y un sector especializado de acuarismo con asesoramiento experto. Además, para tu comodidad, contamos con envíos a domicilio para bolsas pesadas y un amplio horario de lunes a sábado de 8:30 a 13:00 hs y de 17:30 a 21:00 hs.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[['10+', 'Años de trayectoria'], ['2000+', 'Productos'], ['190+', 'Opiniones Google']].map(([num, label]) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-bold text-brand-700">{num}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Mascotas felices"
              className="w-full h-80 object-cover rounded-2xl shadow-xl"
            />
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center gap-1.5">
                <p className="text-2xl font-bold text-brand-700">4.9</p>
                <Star size={20} className="text-amber-400 fill-amber-400" />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Calificacion promedio</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
