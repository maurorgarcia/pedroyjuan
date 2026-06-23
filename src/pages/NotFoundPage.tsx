import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFoundPage() {
  usePageMeta({
    title: 'Página no encontrada',
    description: 'La página que buscás no existe.',
  });

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Search size={56} className="mx-auto text-gray-300 mb-6" />
        <h1 className="page-title mb-3">Página no encontrada</h1>
        <p className="text-gray-500 mb-8">
          La sección que buscás no existe o fue movida.
        </p>
        <Link to="/" className="btn-primary inline-flex">
          <Home size={18} />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
