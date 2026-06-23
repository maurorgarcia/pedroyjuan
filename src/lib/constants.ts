export { CATALOG_CATEGORIES as CATEGORIES } from '../data/catalog';

export const BADGE_LABELS: Record<string, { label: string; className: string }> = {
  'oferta': { label: 'Oferta', className: 'bg-red-100 text-red-700' },
  'nuevo': { label: 'Nuevo', className: 'bg-blue-100 text-blue-700' },
  'mas-vendido': { label: 'Más vendido', className: 'bg-amber-100 text-amber-700' },
};

export const PROVINCES = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
  'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
  'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
  'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
  'Tierra del Fuego', 'Tucumán',
];

export const ORDER_STATUS: Record<string, { label: string; className: string }> = {
  'pending': { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-700' },
  'confirmed': { label: 'Confirmado', className: 'bg-blue-100 text-blue-700' },
  'shipped': { label: 'Enviado', className: 'bg-purple-100 text-purple-700' },
  'delivered': { label: 'Entregado', className: 'bg-green-100 text-green-700' },
  'cancelled': { label: 'Cancelado', className: 'bg-red-100 text-red-700' },
};

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);

export const discountPercent = (original: number, current: number) =>
  Math.round(((original - current) / original) * 100);
