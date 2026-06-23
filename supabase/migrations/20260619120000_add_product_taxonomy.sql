/*
# Taxonomía de productos: subcategory + type
Alinea el schema con la navegación jerárquica del catálogo.
*/

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS subcategory text,
  ADD COLUMN IF NOT EXISTS type text;

CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_badge ON products(badge);

-- Corregir productos seed existentes
UPDATE products SET category = 'perros', subcategory = 'alimentos', type = 'secos'
WHERE name ILIKE '%Royal Canin%';

UPDATE products SET category = 'perros', subcategory = 'alimentos', type = 'secos'
WHERE name ILIKE '%Eukanuba%';

UPDATE products SET category = 'gatos', subcategory = 'alimentos', type = 'secos'
WHERE name ILIKE '%Whiskas%';

UPDATE products SET category = 'perros', subcategory = 'higiene', type = 'shampoo'
WHERE name ILIKE '%Shampoo%';

UPDATE products SET category = 'perros', subcategory = 'accesorios', type = 'correas'
WHERE name ILIKE '%Correa%';

UPDATE products SET category = 'gatos', subcategory = 'higiene', type = 'arena'
WHERE name ILIKE '%Arenero%';

UPDATE products SET category = 'aves', subcategory = 'jaulas', type = 'jaulas'
WHERE name ILIKE '%Jaula canarios%';

UPDATE products SET category = 'peces', subcategory = 'acuarios', type = 'tanques'
WHERE name ILIKE '%Acuario%';

UPDATE products SET category = 'perros', subcategory = 'alimentos', type = 'secos'
WHERE name ILIKE '%Pro Plan%';

UPDATE products SET category = 'gatos', subcategory = 'alimentos', type = 'secos'
WHERE name ILIKE '%Felix%';

UPDATE products SET category = 'perros', subcategory = 'accesorios', type = 'comederos'
WHERE name ILIKE '%Comedero%';

UPDATE products SET category = 'otras-especies', subcategory = 'roedores', type = 'jaulas'
WHERE name ILIKE '%Trampa%' OR category = 'roedores';

UPDATE products SET category = 'perros', subcategory = 'higiene', type = 'shampoo'
WHERE category = 'higiene';
