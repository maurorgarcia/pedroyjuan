import { useState } from 'react';
import { MapPin, Phone, Clock, Send, CheckCircle, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BUSINESS, whatsAppUrl } from '../lib/business';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSending(true);
    const { error: err } = await supabase.from('contact_messages').insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      message: form.message,
    });
    setSending(false);
    if (err) { setError('Hubo un error al enviar el mensaje. Por favor intentá de nuevo.'); return; }
    setSent(true);
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section id="contacto" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title">Contactanos</h2>
          <p className="section-subtitle">Estamos para ayudarte con cualquier consulta</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Dirección</p>
                <a
                  href={BUSINESS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 text-sm mt-0.5 hover:text-brand-700 transition-colors underline-offset-2 hover:underline block"
                >
                  {BUSINESS.address}
                </a>
                <p className="text-xs text-brand-600 mt-1 font-medium">Ver cómo llegar en Google Maps →</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Teléfono / WhatsApp</p>
                <ul className="mt-1 space-y-1.5">
                  {BUSINESS.phones.map(phone => (
                    <li key={phone.id} className="text-sm text-gray-600 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="font-medium text-gray-700">{phone.label}:</span>
                      <a href={`tel:${phone.tel}`} className="hover:text-brand-700 transition-colors">
                        {phone.display}
                      </a>
                      <a
                        href={whatsAppUrl(phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 text-xs font-medium"
                      >
                        <MessageCircle size={12} />
                        WhatsApp
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Horarios</p>
                <p className="text-gray-600 text-sm mt-0.5">{BUSINESS.hours}</p>
              </div>
            </div>
          </div>

          {sent ? (
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm border border-gray-100">
              <CheckCircle size={48} className="text-brand-600 mb-4" />
              <h3 className="font-bold text-gray-900 text-lg mb-2">Mensaje enviado</h3>
              <p className="text-gray-500 text-sm mb-4">Nos comunicaremos contigo a la brevedad.</p>
              <button onClick={() => setSent(false)} className="btn-secondary text-sm px-4 py-2">
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input required className="input-field" placeholder="Tu nombre" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input required type="email" className="input-field" placeholder="tu@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input className="input-field" placeholder="(opcional)" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje *</label>
                <textarea required rows={4} className="input-field resize-none" placeholder="¿En qué podemos ayudarte?" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button type="submit" disabled={sending} className="btn-primary w-full">
                {sending ? 'Enviando...' : (<><Send size={16} />Enviar mensaje</>)}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
