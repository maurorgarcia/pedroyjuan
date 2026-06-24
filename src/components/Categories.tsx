import { Link } from 'react-router-dom';

const homeCategories = [
  {
    label: 'Perros',
    subtext: 'Alimentos, juguetes y más',
    link: '/perros',
    image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    label: 'Gatos',
    subtext: 'Alimentos, higiene y accesorios',
    link: '/gatos',
    image: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    label: 'Peces',
    subtext: 'Acuarios, alimentos y filtros',
    link: '/peces',
    image: 'https://images.pexels.com/photos/325044/pexels-photo-325044.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    label: 'Aves',
    subtext: 'Jaulas, alimentos y accesorios',
    link: '/aves',
    image: 'https://images.pexels.com/photos/56733/pexels-photo-56733.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    label: 'Pequeños',
    subtext: 'Hámster, conejos y más',
    link: '/otras-especies',
    image: 'https://images.pexels.com/photos/3354347/pexels-photo-3354347.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    label: 'Otras especies',
    subtext: 'Reptiles, exóticos y más',
    link: '/otras-especies',
    image: 'https://images.pexels.com/photos/751686/pexels-photo-751686.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

export default function Categories() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title & Link */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Explorá nuestras categorías
          </h2>
          <Link
            to="/productos"
            className="text-xs sm:text-sm font-semibold text-[#5c3e98] hover:text-[#4b3180] transition-colors"
          >
            Ver todas las categorías →
          </Link>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {homeCategories.map(cat => (
            <Link
              key={cat.label}
              to={cat.link}
              className="flex items-center gap-4 bg-gray-50/60 hover:bg-[#F4EFFF]/40 border border-gray-100/80 rounded-2xl p-4 transition-all duration-200 group hover:shadow-sm"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 group-hover:text-[#5c3e98] transition-colors">
                  {cat.label}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                  {cat.subtext}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
