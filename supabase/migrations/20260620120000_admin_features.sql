/*
  Admin, storage, stock y pedidos — ejecutar en Supabase SQL Editor
  después de full_schema.sql
*/

-- ─── Admin flag en perfiles ───────────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- Ponete admin (reemplazá el email):
-- UPDATE public.profiles SET is_admin = true
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'tu@email.com');

-- ─── Políticas admin: productos ───────────────────────────────────────────────
DROP POLICY IF EXISTS "admin_manage_products" ON public.products;
CREATE POLICY "admin_manage_products" ON public.products FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- ─── Políticas admin: pedidos ─────────────────────────────────────────────────
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

-- ─── Políticas admin: mensajes de contacto ────────────────────────────────────
DROP POLICY IF EXISTS "admin_read_contact_messages" ON public.contact_messages;
CREATE POLICY "admin_read_contact_messages" ON public.contact_messages FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- ─── Storage: imágenes de productos ───────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
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

-- ─── RPC: crear pedido + descontar stock + vaciar carrito (transacción) ───────
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
