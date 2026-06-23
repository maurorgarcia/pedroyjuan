import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, CheckCircle, Package, PawPrint, Store } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/constants';
import { Product } from '../lib/supabase';
import { BUSINESS } from '../lib/business';

export default function CheckoutPage() {
  const { user, profile } = useAuth();
  const { items, localItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<'contact' | 'confirm' | 'success'>('contact');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    phone: profile?.phone || '',
    notes: '',
  });

  type DisplayItem = { id: string; product: Product; quantity: number };
  const displayItems: DisplayItem[] = user
    ? items.map(i => ({ id: i.product_id, product: i.product, quantity: i.quantity }))
    : localItems.map(i => ({ id: i.product.id, product: i.product, quantity: i.quantity }));

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Necesitás iniciar sesión</h2>
          <Link to="/login" state={{ from: '/checkout' }} className="btn-primary mt-4">Iniciar sesión</Link>
        </div>
      </div>
    );
  }

  if (displayItems.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
          <Link to="/productos" className="btn-primary mt-4">Ver productos</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'contact') { setStep('confirm'); return; }
    setLoading(true);
    setError('');

    const { data: orderId, error: orderErr } = await supabase.rpc('place_order', {
      p_total: totalPrice,
      p_shipping_address: BUSINESS.address,
      p_shipping_city: 'San Nicolás de Los Arroyos',
      p_shipping_province: 'Buenos Aires',
      p_shipping_phone: form.phone,
      p_notes: form.notes ? `Retiro en local. ${form.notes}` : 'Retiro en local',
      p_items: displayItems.map(({ product, quantity }) => ({
        product_id: product.id,
        product_name: product.name,
        product_brand: product.brand ?? '',
        product_image_url: product.image_url ?? '',
        quantity,
        unit_price: product.price,
      })),
    });

    if (orderErr || !orderId) {
      setError(orderErr?.message?.includes('Stock') ? 'Uno o más productos no tienen stock suficiente.' : 'Error al crear el pedido. Por favor intentá de nuevo.');
      setLoading(false);
      return;
    }

    await clearCart();
    setOrderId(orderId as string);
    setStep('success');
    setLoading(false);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-brand-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedido confirmado</h2>
          <p className="text-gray-500 text-sm mb-2">Tu pedido fue recibido con éxito.</p>
          <p className="text-xs text-gray-400 font-mono mb-6">ID: {orderId.slice(0, 8).toUpperCase()}</p>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 mb-4">
            Te avisaremos al <strong>{form.phone}</strong> cuando esté listo para retirar en el local.
          </p>
          <a
            href={BUSINESS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-600 hover:underline mb-6 inline-block"
          >
            Ver ubicación en Google Maps →
          </a>
          <div className="flex flex-col gap-2">
            <Link to="/cuenta/pedidos" className="btn-primary"><Package size={16} />Ver mis pedidos</Link>
            <Link to="/" className="btn-secondary">Volver al inicio</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => step === 'confirm' ? setStep('contact') : navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft size={16} />{step === 'confirm' ? 'Editar datos' : 'Volver al carrito'}
        </button>

        <div className="flex items-center gap-2 mb-8">
          {['Datos de contacto', 'Confirmar pedido'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                (step === 'contact' && i === 0) || (step === 'confirm' && i === 1) ? 'bg-brand-600 text-white' : (step === 'confirm' && i === 0) ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-400'
              }`}>{i + 1}</div>
              <span className={`text-sm font-medium ${(step === 'contact' && i === 0) || (step === 'confirm' && i === 1) ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
              {i < 1 && <div className={`flex-1 h-0.5 w-8 ${step === 'confirm' ? 'bg-brand-200' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6">
              {step === 'contact' ? (
                <>
                  <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
                    <Store size={18} className="text-brand-600" />
                    Retiro en local
                  </h2>

                  <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-5">
                    <p className="text-sm font-semibold text-brand-800 mb-1">Lugar de retiro</p>
                    <p className="text-sm text-gray-700">{BUSINESS.address}</p>
                    <p className="text-xs text-gray-500 mt-1">{BUSINESS.hours}</p>
                    <a
                      href={BUSINESS.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-600 font-medium hover:underline mt-2 inline-flex items-center gap-1"
                    >
                      <MapPin size={12} />
                      Cómo llegar en Google Maps
                    </a>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de contacto *</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input required type="tel" className="input-field pl-10" placeholder="+54 9 ..." value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales</label>
                      <textarea rows={3} className="input-field resize-none" placeholder="Horario preferido para retirar, consultas, etc." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                    </div>
                    <button type="submit" className="btn-primary w-full">Continuar</button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="font-bold text-gray-900 text-lg mb-5">Confirmar pedido</h2>
                  <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-1.5 text-sm">
                    <p className="font-semibold text-gray-900">Retiro en local:</p>
                    <p className="text-gray-600">{BUSINESS.address}</p>
                    <p className="text-gray-600">Tel: {form.phone}</p>
                    {form.notes && <p className="text-gray-500 italic">"{form.notes}"</p>}
                  </div>
                  {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? 'Procesando...' : 'Confirmar pedido'}
                  </button>
                </>
              )}
            </form>
          </div>

          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Tu pedido</h3>
              <div className="space-y-3 mb-4">
                {displayItems.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3">
                    {product.image_url ? (
                      <img src={product.image_url} alt="" className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 flex-shrink-0">
                        <PawPrint size={20} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 leading-tight line-clamp-2">{product.name}</p>
                      <p className="text-xs text-gray-400">x{quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 flex-shrink-0">{formatPrice(product.price * quantity)}</p>
                  </div>
                ))}
              </div>
              <hr className="mb-3" />
              <div className="flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Pago al retirar en el local</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
