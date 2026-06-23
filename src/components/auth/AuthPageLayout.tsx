import { Link } from 'react-router-dom';
import { ArrowLeft, PawPrint, ShieldCheck, Store } from 'lucide-react';
import { BUSINESS } from '../../lib/business';

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  backTo?: { href: string; label: string };
};

const HIGHLIGHTS = [
  { icon: Store, text: 'Pedí online y retirá en el local' },
  { icon: ShieldCheck, text: 'Tu cuenta segura y tus pedidos guardados' },
  { icon: PawPrint, text: 'Todo para el cuidado de tu mascota' },
];

export default function AuthPageLayout({ title, subtitle, children, footer, backTo }: Props) {
  return (
    <div className="min-h-screen flex">
      {/* Panel decorativo — desktop */}
      <aside className="hidden lg:flex lg:w-[44%] xl:w-[42%] relative bg-gradient-to-br from-brand-800 via-brand-700 to-secondary-700 text-white flex-col justify-between p-10 xl:p-14 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white" />
          <div className="absolute bottom-10 -left-16 w-64 h-64 rounded-full bg-white" />
        </div>

        <div className="relative">
          <Link to="/" className="inline-block mb-12 hover:opacity-90 transition-opacity">
            <img src="/logo_sinfondo.png" alt="Pedro y Juan Petshop" className="h-14 w-auto object-contain" />
          </Link>
          <h2 className="text-3xl xl:text-4xl font-bold leading-tight mb-4">
            Tu petshop de confianza en San Nicolás
          </h2>
          <p className="text-white/75 text-base leading-relaxed max-w-md">
            {BUSINESS.tagline}
          </p>
        </div>

        <ul className="relative space-y-4">
          {HIGHLIGHTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-white/90">
              <span className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <Icon size={18} />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </aside>

      {/* Formulario */}
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-10">
          <div className="w-full max-w-md animate-slide-up">
            {/* Header mobile */}
            <div className="lg:hidden text-center mb-8">
              <Link to="/" className="inline-block mb-5">
                <img src="/logo_sinfondo.png" alt="Pedro y Juan Petshop" className="h-12 w-auto object-contain mx-auto" />
              </Link>
            </div>

            {backTo && (
              <Link
                to={backTo.href}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-700 font-medium mb-6 transition-colors"
              >
                <ArrowLeft size={16} />
                {backTo.label}
              </Link>
            )}

            <div className="mb-7">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
              <p className="text-gray-500 text-sm sm:text-base mt-2 leading-relaxed">{subtitle}</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/50 p-6 sm:p-8">
              {children}
            </div>

            {footer && (
              <div className="mt-6 text-center text-sm text-gray-500">{footer}</div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 pb-6 px-4">
          © {new Date().getFullYear()} {BUSINESS.name} · San Nicolás de los Arroyos
        </p>
      </div>
    </div>
  );
}
