export const BUSINESS = {
  name: 'Pedro y Juan',
  address: 'Bartolomé Mitre 360, B2900 San Nicolás de Los Arroyos, Provincia de Buenos Aires',
  mapsUrl: 'https://maps.app.goo.gl/uYqifwpKArGiT5AT6',
  pickupNote: 'Retiro en local — no realizamos envíos a domicilio.',
  tagline: 'Petshop · Veterinaria · Peluquería en San Nicolás — Pedí online, retirá en el local y ahorrá tiempo',
  hours: 'Lunes a Sábado: 08:30 a 13:00 | 17:30 a 21:00 hs',
  hoursShort: 'Lun–Sáb 08:30–13 y 17:30–21 hs',
  instagram: 'https://www.instagram.com/pedroyjuan',
  phones: [
    {
      id: 'petshop',
      label: 'Petshop',
      display: '+54 9 3364 62-9388',
      tel: '+5493364629388',
      whatsapp: '5493364629388',
    },
    {
      id: 'veterinaria',
      label: 'Veterinaria',
      display: '+54 9 336 467-5190',
      tel: '+5493364675190',
      whatsapp: '5493364675190',
    },
    {
      id: 'peluqueria',
      label: 'Peluquería',
      display: '+54 9 336 466-6741',
      tel: '+5493364666741',
      whatsapp: '5493364666741',
    },
  ] as const,
};

export const PRIMARY_PHONE = BUSINESS.phones[0];

export function whatsAppUrl(
  phone = PRIMARY_PHONE,
  message = 'Hola! Quiero consultar.',
) {
  return `https://wa.me/${phone.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function getPhoneById(id: string) {
  return BUSINESS.phones.find(p => p.id === id) ?? PRIMARY_PHONE;
}
