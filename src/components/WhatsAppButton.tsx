import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { BUSINESS, whatsAppUrl } from '../lib/business';

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 bg-green-500 text-white">
            <p className="font-semibold text-sm">Escribinos por WhatsApp</p>
            <button onClick={() => setOpen(false)} aria-label="Cerrar">
              <X size={18} />
            </button>
          </div>
          <ul className="py-2">
            {BUSINESS.phones.map(phone => (
              <li key={phone.id}>
                <a
                  href={whatsAppUrl(phone, `Hola! Quiero consultar por ${phone.label.toLowerCase()}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <MessageCircle size={18} className="text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{phone.label}</p>
                    <p className="text-xs text-gray-500">{phone.display}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={26} fill="white" />
      </button>
    </>
  );
}
