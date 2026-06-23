import { Link } from 'react-router-dom';

const homeCategories = [
  {
    label: 'Perros',
    link: '/perros',
    image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    label: 'Gatos',
    link: '/gatos',
    image: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    label: 'Alimentos',
    link: '/perros/alimentos',
    image: 'https://images.pexels.com/photos/1395360/pexels-photo-1395360.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    label: 'Farmacia',
    link: '/perros/salud',
    image: 'https://images.pexels.com/photos/159211/headache-pain-pills-medication-159211.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    label: 'Juguetes',
    link: '/perros/accesorios/juguetes',
    image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    label: 'Accesorios',
    link: '/perros/accesorios',
    image: 'https://images.pexels.com/photos/5732458/pexels-photo-5732458.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

const promos = [
  {
    badge: 'SOLO POR HOY',
    title: '20% OFF en Alimentos premium',
    cta: 'Ver catálogo',
    link: '/perros/alimentos',
    bg: 'from-brand-600 to-brand-700',
    image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    badge: 'NOVEDADES',
    title: 'Juguetes para gatos felices',
    cta: 'Comprar ahora',
    link: '/gatos/accesorios/juguetes',
    bg: 'from-brand-700 to-secondary-600',
    image: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function Categories() {
  return (
    <section className="py-10 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          Nuestras categorías
        </h2>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-x-10 sm:gap-y-6 mb-8 sm:mb-10">
          {homeCategories.map(cat => (
            <Link
              key={cat.label}
              to={cat.link}
              className="group flex flex-col items-center gap-3 w-[100px] sm:w-[116px]"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm sm:text-base font-semibold text-gray-700 group-hover:text-brand-700 transition-colors text-center">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {promos.map(promo => (
            <Link
              key={promo.title}
              to={promo.link}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${promo.bg} p-6 sm:p-8 flex items-center min-h-[160px] sm:min-h-[180px] group hover:shadow-lg transition-shadow duration-200`}
            >
              <div className="relative z-10 max-w-[55%]">
                <p className="text-white/80 text-xs font-semibold tracking-wider uppercase mb-2">
                  {promo.badge}
                </p>
                <h3 className="text-white text-xl sm:text-2xl font-bold leading-tight mb-4">
                  {promo.title}
                </h3>
                <span className="inline-block bg-white text-gray-900 font-semibold text-sm px-5 py-2.5 rounded-xl group-hover:bg-gray-100 transition-colors">
                  {promo.cta}
                </span>
              </div>
              <img
                src={promo.image}
                alt=""
                className="absolute right-0 bottom-0 h-full w-1/2 object-cover object-center opacity-90"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
