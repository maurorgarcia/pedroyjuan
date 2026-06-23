# Configuración — Pedro y Juan Petshop

Guía de lo que tenés que configurar para que la tienda funcione al 100%.

---

## 1. Supabase (obligatorio)

### Variables de entorno

Creá o editá el archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

Las encontrás en **Supabase Dashboard → Project Settings → API**.

### Ejecutar migraciones

En el panel de Supabase, andá a **SQL Editor** y ejecutá **un solo archivo**:

**`supabase/full_schema.sql`** — incluye tablas, políticas RLS, índices, trigger de registro, productos de ejemplo, panel admin y función `place_order`.

> Si ya ejecutaste `full_schema.sql` antes, corré solo **`supabase/migrations/20260620120000_admin_features.sql`** en el SQL Editor.

### Activar tu usuario como admin

Después de registrarte en la tienda, ejecutá en SQL Editor (cambiá el email):

```sql
UPDATE public.profiles SET is_admin = true
WHERE id = (SELECT id FROM auth.users WHERE email = 'tu@email.com');
```

### Recuperar contraseña

En Supabase Dashboard → **Authentication → URL Configuration**, agregá:

- **Site URL**: `http://localhost:5173` (o tu dominio en producción)
- **Redirect URLs**: `http://localhost:5173/restablecer-contrasena`

---

## 2. Archivos en `public/` (obligatorio)

Subí estos archivos a la carpeta `public/`:

| Archivo | Uso |
|---------|-----|
| `logo.png` | Logo del navbar y footer |
| `banner1.jpg` | Hero slide 1 |
| `banner2.jpg` | Hero slide 2 |
| `banner3.jpg` | Hero slide 3 |

Opcional: reemplazá las imágenes de categorías en home (hoy usan Pexels como placeholder).

---

## 3. Datos del negocio (recomendado)

Editá estos valores con la info real de la tienda:

| Qué | Dónde |
|-----|-------|
| Teléfono / WhatsApp | `Navbar.tsx`, `Footer.tsx`, `WhatsAppButton.tsx`, `business.ts` |
| Dirección y Google Maps | `business.ts` → `mapsUrl` |
| Horarios | `business.ts`, `Features.tsx` |

---

## 4. Productos en Supabase

Cada producto debe tener:

```text
category     → ej: perros, gatos, aves, peces, otras-especies
subcategory  → ej: alimentos, higiene, accesorios, salud
type         → ej: secos, correas, shampoo (según catalog.ts)
brand        → ej: Royal Canin
badge        → oferta | nuevo | mas-vendido | null
stock        → número entero
active       → true
```

Los IDs válidos están en `src/data/catalog.ts`.

---

## 5. Arrancar el proyecto

```bash
npm install
npm run dev
```

Abrí `http://localhost:5173` y probá:

- Home carga con banners y categorías
- `/perros/alimentos` muestra productos
- `/productos` y `/marcas` funcionan
- Agregar al carrito y checkout (requiere login)
- Scroll va al inicio al cambiar de página
- `/recuperar-contrasena` envía email de reset
- `/admin` panel de administración (requiere `is_admin = true`)

---

## 6. Deploy (cuando publiques)

1. Configurá las mismas variables `VITE_SUPABASE_*` en tu hosting (Vercel, Netlify, etc.)
2. Subí los archivos de `public/`
3. Build: `npm run build`
