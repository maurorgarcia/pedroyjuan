/*
  Pedro y Juan — Schema completo para Supabase
  =============================================
  Ejecutá este archivo UNA SOLA VEZ en:
  Supabase Dashboard → SQL Editor → New query → Run

  Requiere: proyecto Supabase con Auth habilitado (email/password).
*/

-- ─── PROFILES ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
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

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON public.profiles;
CREATE POLICY "select_own_profile" ON public.profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON public.profiles;
CREATE POLICY "insert_own_profile" ON public.profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
CREATE POLICY "update_own_profile" ON public.profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON public.profiles;
CREATE POLICY "delete_own_profile" ON public.profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- ─── PRODUCTS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text,
  description text,
  price numeric(10,2) NOT NULL,
  original_price numeric(10,2),
  category text NOT NULL,
  subcategory text,
  type text,
  image_url text,
  stock integer NOT NULL DEFAULT 0,
  badge text CHECK (badge IN ('oferta', 'nuevo', 'mas-vendido') OR badge IS NULL),
  rating numeric(3,2) DEFAULT 4.5,
  reviews_count integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_products_public" ON public.products;
CREATE POLICY "select_products_public" ON public.products FOR SELECT
  TO anon, authenticated USING (active = true);

-- ─── CART ITEMS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_cart" ON public.cart_items;
CREATE POLICY "select_own_cart" ON public.cart_items FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_cart" ON public.cart_items;
CREATE POLICY "insert_own_cart" ON public.cart_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_cart" ON public.cart_items;
CREATE POLICY "update_own_cart" ON public.cart_items FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_cart" ON public.cart_items;
CREATE POLICY "delete_own_cart" ON public.cart_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ─── ORDERS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total numeric(10,2) NOT NULL,
  shipping_address text,
  shipping_city text,
  shipping_province text,
  shipping_phone text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON public.orders;
CREATE POLICY "select_own_orders" ON public.orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON public.orders;
CREATE POLICY "insert_own_orders" ON public.orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_orders" ON public.orders;
CREATE POLICY "update_own_orders" ON public.orders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_orders" ON public.orders;
CREATE POLICY "delete_own_orders" ON public.orders FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ─── ORDER ITEMS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id),
  product_name text NOT NULL,
  product_brand text,
  product_image_url text,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_order_items" ON public.order_items;
CREATE POLICY "select_own_order_items" ON public.order_items FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "insert_own_order_items" ON public.order_items;
CREATE POLICY "insert_own_order_items" ON public.order_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- ─── CONTACT MESSAGES ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "insert_contact_message" ON public.contact_messages;
CREATE POLICY "insert_contact_message" ON public.contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- ─── INDEXES ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON public.products(subcategory);
CREATE INDEX IF NOT EXISTS idx_products_type ON public.products(type);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_badge ON public.products(badge);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ─── AUTO-CREATE PROFILE ON SIGN UP ───────────────────────────────────────────
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

-- ─── SEED: PRODUCTOS DE EJEMPLO ───────────────────────────────────────────────
-- Solo inserta si la tabla está vacía
INSERT INTO public.products (name, brand, description, price, original_price, category, subcategory, type, image_url, stock, badge, rating, reviews_count)
SELECT * FROM (VALUES
  ('Royal Canin Medium Adult 15kg', 'Royal Canin', 'Alimento completo para perros adultos de razas medianas.', 28500, 33000::numeric, 'perros', 'alimentos', 'secos', 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400', 15, 'oferta', 4.8, 124),
  ('Eukanuba Adult Large Breed 15kg', 'Eukanuba', 'Nutrición premium para perros grandes.', 31200, NULL::numeric, 'perros', 'alimentos', 'secos', 'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=400', 8, 'nuevo', 4.7, 89),
  ('Whiskas Selección Natural 1.5kg', 'Whiskas', 'Comida seca para gatos adultos.', 4800, 5500::numeric, 'gatos', 'alimentos', 'secos', 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400', 30, 'oferta', 4.5, 67),
  ('Shampoo Antipulgas BioVet 500ml', 'BioVet', 'Shampoo antipulgas y garrapatas.', 3200, NULL::numeric, 'perros', 'higiene', 'shampoo', 'https://images.pexels.com/photos/6816851/pexels-photo-6816851.jpeg?auto=compress&cs=tinysrgb&w=400', 25, 'mas-vendido', 4.6, 203),
  ('Correa retráctil 5m LED', 'PetStar', 'Correa retráctil con luz LED.', 6200, 7800::numeric, 'perros', 'accesorios', 'correas', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400', 20, 'oferta', 4.4, 45),
  ('Arenero cubierto con filtro', 'CatHome', 'Arenero cerrado con filtro de carbón.', 9900, 12500::numeric, 'gatos', 'higiene', 'arena', 'https://images.pexels.com/photos/1543793/pexels-photo-1543793.jpeg?auto=compress&cs=tinysrgb&w=400', 12, 'oferta', 4.3, 38),
  ('Jaula canarios 45cm', 'BirdLife', 'Jaula con bandejas extraíbles.', 14500, NULL::numeric, 'aves', 'jaulas', 'jaulas', 'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=400', 7, NULL, 4.2, 29),
  ('Acuario 60L completo', 'AquaLife', 'Kit completo de 60 litros.', 38000, 46000::numeric, 'peces', 'acuarios', 'tanques', 'https://images.pexels.com/photos/3854016/pexels-photo-3854016.jpeg?auto=compress&cs=tinysrgb&w=400', 5, 'oferta', 4.9, 17),
  ('Pro Plan Adult Chicken 7.5kg', 'Purina Pro Plan', 'Alimento con pollo real.', 18900, NULL::numeric, 'perros', 'alimentos', 'secos', 'https://images.pexels.com/photos/733416/pexels-photo-733416.jpeg?auto=compress&cs=tinysrgb&w=400', 18, 'nuevo', 4.8, 156),
  ('Felix Doubly Delicious 1kg', 'Felix', 'Alimento seco para gatos.', 3600, 4200::numeric, 'gatos', 'alimentos', 'secos', 'https://images.pexels.com/photos/2361/nature-animal-wildlife-reptile.jpg?auto=compress&cs=tinysrgb&w=400', 40, 'oferta', 4.4, 91),
  ('Comedero automático 1.5L', 'SmartPet', 'Comedero programable.', 12500, 15000::numeric, 'perros', 'accesorios', 'comederos', 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=400', 10, 'oferta', 4.6, 73),
  ('Jaula para roedores 30x20cm', 'RodentCare', 'Jaula de acero inoxidable.', 5800, NULL::numeric, 'otras-especies', 'roedores', 'jaulas', 'https://images.pexels.com/photos/4001296/pexels-photo-4001296.jpeg?auto=compress&cs=tinysrgb&w=400', 15, NULL, 4.1, 22)
) AS seed(name, brand, description, price, original_price, category, subcategory, type, image_url, stock, badge, rating, reviews_count)
WHERE NOT EXISTS (SELECT 1 FROM public.products LIMIT 1);

-- ─── ADMIN, STORAGE Y PEDIDOS (place_order) ───────────────────────────────────
-- Ver también: supabase/migrations/20260620120000_admin_features.sql

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

DROP POLICY IF EXISTS "admin_manage_products" ON public.products;
CREATE POLICY "admin_manage_products" ON public.products FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "admin_select_orders" ON public.orders;
CREATE POLICY "admin_select_orders" ON public.orders FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "admin_update_orders" ON public.orders;
CREATE POLICY "admin_update_orders" ON public.orders FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "admin_select_all_order_items" ON public.order_items;
CREATE POLICY "admin_select_all_order_items" ON public.order_items FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "admin_read_contact_messages" ON public.contact_messages;
CREATE POLICY "admin_read_contact_messages" ON public.contact_messages FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "product_images_public_read" ON storage.objects;
CREATE POLICY "product_images_public_read" ON storage.objects FOR SELECT
  TO public USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "product_images_admin_insert" ON storage.objects;
CREATE POLICY "product_images_admin_insert" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (
    bucket_id = 'product-images'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

DROP POLICY IF EXISTS "product_images_admin_update" ON storage.objects;
CREATE POLICY "product_images_admin_update" ON storage.objects FOR UPDATE
  TO authenticated USING (
    bucket_id = 'product-images'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

DROP POLICY IF EXISTS "product_images_admin_delete" ON storage.objects;
CREATE POLICY "product_images_admin_delete" ON storage.objects FOR DELETE
  TO authenticated USING (
    bucket_id = 'product-images'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE OR REPLACE FUNCTION public.place_order(
  p_total numeric,
  p_shipping_address text,
  p_shipping_city text,
  p_shipping_province text,
  p_shipping_phone text,
  p_notes text,
  p_items jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id uuid;
  item jsonb;
  v_product_id uuid;
  v_qty integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'No autenticado';
  END IF;

  INSERT INTO orders (user_id, total, shipping_address, shipping_city, shipping_province, shipping_phone, notes)
  VALUES (auth.uid(), p_total, p_shipping_address, p_shipping_city, p_shipping_province, p_shipping_phone, p_notes)
  RETURNING id INTO v_order_id;

  FOR item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (item->>'product_id')::uuid;
    v_qty := (item->>'quantity')::integer;

    UPDATE products
    SET stock = stock - v_qty
    WHERE id = v_product_id AND active = true AND stock >= v_qty;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Stock insuficiente para el producto %', item->>'product_name';
    END IF;

    INSERT INTO order_items (order_id, product_id, product_name, product_brand, product_image_url, quantity, unit_price)
    VALUES (
      v_order_id,
      v_product_id,
      item->>'product_name',
      NULLIF(item->>'product_brand', ''),
      NULLIF(item->>'product_image_url', ''),
      v_qty,
      (item->>'unit_price')::numeric
    );
  END LOOP;

  DELETE FROM cart_items WHERE user_id = auth.uid();

  RETURN v_order_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.place_order TO authenticated;
