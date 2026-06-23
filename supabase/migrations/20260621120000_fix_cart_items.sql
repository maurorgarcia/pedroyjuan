/*
  Fix carrito — ejecutar en Supabase SQL Editor si cart_items da 403
*/

-- Default automático de user_id al insertar
ALTER TABLE public.cart_items
  ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Trigger por si el cliente no manda user_id
CREATE OR REPLACE FUNCTION public.set_cart_item_user_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS cart_items_set_user_id ON public.cart_items;
CREATE TRIGGER cart_items_set_user_id
  BEFORE INSERT ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.set_cart_item_user_id();

-- Permisos y políticas RLS
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;

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
