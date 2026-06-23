
/*
# Pedro y Juan Petshop - Schema inicial

1. Nuevas tablas
- `profiles` - Datos del perfil de usuario (nombre, telefono, direccion)
- `products` - Catalogo de productos con categoria, precio, stock
- `cart_items` - Items en el carrito del usuario (por sesion o autenticado)
- `orders` - Ordenes de compra
- `order_items` - Items de cada orden
- `contact_messages` - Mensajes del formulario de contacto

2. Seguridad
- RLS habilitado en todas las tablas
- Usuarios autenticados pueden ver/editar su propio perfil
- Productos visibles para todos (anonimos y autenticados)
- Carrito solo accesible por el dueno
- Ordenes solo accesibles por el dueno
- Mensajes de contacto: insertar para todos, leer solo autenticados

3. Notas
- Los productos son publicos (lectura anonima permitida)
- El carrito usa user_id para usuarios autenticados
- Las ordenes tienen estados: pending, confirmed, shipped, delivered, cancelled
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  address text,
  city text,
  province text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
TO authenticated USING (auth.uid() = id);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text,
  description text,
  price numeric(10,2) NOT NULL,
  original_price numeric(10,2),
  category text NOT NULL,
  image_url text,
  stock integer NOT NULL DEFAULT 0,
  badge text,
  rating numeric(3,2) DEFAULT 4.5,
  reviews_count integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_products_public" ON products;
CREATE POLICY "select_products_public" ON products FOR SELECT
TO anon, authenticated USING (active = true);

-- CART ITEMS
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_cart" ON cart_items;
CREATE POLICY "select_own_cart" ON cart_items FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_cart" ON cart_items;
CREATE POLICY "insert_own_cart" ON cart_items FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_cart" ON cart_items;
CREATE POLICY "update_own_cart" ON cart_items FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_cart" ON cart_items;
CREATE POLICY "delete_own_cart" ON cart_items FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  total numeric(10,2) NOT NULL,
  shipping_address text,
  shipping_city text,
  shipping_province text,
  shipping_phone text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_orders" ON orders;
CREATE POLICY "update_own_orders" ON orders FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_orders" ON orders;
CREATE POLICY "delete_own_orders" ON orders FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  product_name text NOT NULL,
  product_brand text,
  product_image_url text,
  quantity integer NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
CREATE POLICY "select_own_order_items" ON order_items FOR SELECT
TO authenticated USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

DROP POLICY IF EXISTS "insert_own_order_items" ON order_items;
CREATE POLICY "insert_own_order_items" ON order_items FOR INSERT
TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "insert_contact_message" ON contact_messages;
CREATE POLICY "insert_contact_message" ON contact_messages FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- SEED PRODUCTS
INSERT INTO products (name, brand, description, price, original_price, category, image_url, stock, badge, rating, reviews_count) VALUES
('Royal Canin Medium Adult 15kg', 'Royal Canin', 'Alimento completo para perros adultos de razas medianas. Formula balanceada con proteinas de alta calidad.', 28500, 33000, 'perros', 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400', 15, 'oferta', 4.8, 124),
('Eukanuba Adult Large Breed 15kg', 'Eukanuba', 'Nutricion premium para perros grandes. Con pollo como primer ingrediente y antioxidantes naturales.', 31200, NULL, 'perros', 'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=400', 8, 'nuevo', 4.7, 89),
('Whiskas Seleccion Natural 1.5kg', 'Whiskas', 'Comida seca para gatos adultos con sabor a pollo y verduras. Sin colorantes artificiales.', 4800, 5500, 'gatos', 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400', 30, 'oferta', 4.5, 67),
('Shampoo Antipulgas BioVet 500ml', 'BioVet', 'Shampoo con activos naturales antipulgas y garrapatas. Apto para perros y gatos mayores de 3 meses.', 3200, NULL, 'higiene', 'https://images.pexels.com/photos/6816851/pexels-photo-6816851.jpeg?auto=compress&cs=tinysrgb&w=400', 25, 'mas-vendido', 4.6, 203),
('Correa retractil 5m LED', 'PetStar', 'Correa retractil de 5 metros con luz LED incorporada. Ideal para paseos nocturnos. Hasta 25kg.', 6200, 7800, 'perros', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400', 20, 'oferta', 4.4, 45),
('Arenero cubierto con filtro', 'CatHome', 'Arenero cerrado con filtro de carbon activo que elimina olores. Con puerta de entrada batiente.', 9900, 12500, 'gatos', 'https://images.pexels.com/photos/1543793/pexels-photo-1543793.jpeg?auto=compress&cs=tinysrgb&w=400', 12, 'oferta', 4.3, 38),
('Jaula canarios 45cm', 'BirdLife', 'Jaula de alambre niquelado con bandejas extraibles. Incluye comedero, bebedero y perchas de madera.', 14500, NULL, 'aves', 'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=400', 7, NULL, 4.2, 29),
('Acuario 60L completo', 'AquaLife', 'Kit completo con pecera de 60 litros, filtro, luz LED, termometro y sustrato de fondo.', 38000, 46000, 'peces', 'https://images.pexels.com/photos/3854016/pexels-photo-3854016.jpeg?auto=compress&cs=tinysrgb&w=400', 5, 'oferta', 4.9, 17),
('Pro Plan Adult Chicken 7.5kg', 'Purina Pro Plan', 'Alimento con pollo real como primer ingrediente. Enriquecido con probioticos para la salud digestiva.', 18900, NULL, 'perros', 'https://images.pexels.com/photos/733416/pexels-photo-733416.jpeg?auto=compress&cs=tinysrgb&w=400', 18, 'nuevo', 4.8, 156),
('Felix Doubly Delicious 1kg', 'Felix', 'Alimento seco para gatos con sabores variados. Con trozos en salsa irresistibles.', 3600, 4200, 'gatos', 'https://images.pexels.com/photos/2361/nature-animal-wildlife-reptile.jpg?auto=compress&cs=tinysrgb&w=400', 40, 'oferta', 4.4, 91),
('Comedero automatico 1.5L', 'SmartPet', 'Comedero automatico programable con pantalla digital. Hasta 4 comidas diarias. Capacidad 1.5 litros.', 12500, 15000, 'perros', 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=400', 10, 'oferta', 4.6, 73),
('Trampa para roedores 30x20cm', 'RodentCare', 'Jaula trampa de acero inoxidable. Sin veneno, humana y reutilizable. Para ratas y hamsters.', 5800, NULL, 'roedores', 'https://images.pexels.com/photos/4001296/pexels-photo-4001296.jpeg?auto=compress&cs=tinysrgb&w=400', 15, NULL, 4.1, 22)
ON CONFLICT DO NOTHING;

-- Auto-create profile on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
