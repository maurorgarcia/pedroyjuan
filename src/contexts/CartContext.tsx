import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, CartItem, Product } from '../lib/supabase';
import { useAuth } from './AuthContext';

type CartItemWithProduct = CartItem & { product: Product };

type LocalCartItem = {
  product: Product;
  quantity: number;
};

type CartResult = { ok: true } | { ok: false; error: string };

type CartContextType = {
  items: CartItemWithProduct[];
  localItems: LocalCartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<CartResult>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

function clampQuantity(product: Product, quantity: number) {
  return Math.max(0, Math.min(quantity, product.stock));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [localItems, setLocalItems] = useState<LocalCartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [mergedGuestCart, setMergedGuestCart] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', user.id);
    if (error) {
      console.error('Error al cargar carrito:', error.message);
    }
    setItems((data as CartItemWithProduct[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setItems([]);
      setMergedGuestCart(false);
    }
  }, [user, fetchCart]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(localItems));
  }, [localItems]);

  useEffect(() => {
    if (!user || mergedGuestCart) return;

    const guestItems = [...localItems];
    if (guestItems.length === 0) {
      setMergedGuestCart(true);
      return;
    }

    const mergeGuestCart = async () => {
      for (const item of guestItems) {
        const qty = clampQuantity(item.product, item.quantity);
        if (qty <= 0) continue;

        const { data: existing } = await supabase
          .from('cart_items')
          .select('id, quantity')
          .eq('user_id', user.id)
          .eq('product_id', item.product.id)
          .maybeSingle();

        if (existing) {
          const newQty = clampQuantity(item.product, existing.quantity + qty);
          await supabase.from('cart_items').update({ quantity: newQty }).eq('id', existing.id);
        } else {
          await supabase.from('cart_items').insert({
            user_id: user.id,
            product_id: item.product.id,
            quantity: qty,
          });
        }
      }

      setLocalItems([]);
      setMergedGuestCart(true);
      await fetchCart();
    };

    mergeGuestCart();
  }, [user, mergedGuestCart, fetchCart, localItems]);

  const addToCart = async (product: Product, quantity = 1): Promise<CartResult> => {
    const safeQty = clampQuantity(product, quantity);
    if (safeQty <= 0) {
      return { ok: false, error: 'Sin stock disponible.' };
    }

    if (!user) {
      setLocalItems(prev => {
        const existing = prev.find(i => i.product.id === product.id);
        if (existing) {
          return prev.map(i =>
            i.product.id === product.id
              ? { ...i, quantity: clampQuantity(product, i.quantity + safeQty) }
              : i
          );
        }
        return [...prev, { product, quantity: safeQty }];
      });
      return { ok: true };
    }

    const existing = items.find(i => i.product_id === product.id);
    let error;

    if (existing) {
      const newQty = clampQuantity(product, existing.quantity + safeQty);
      ({ error } = await supabase
        .from('cart_items')
        .update({ quantity: newQty })
        .eq('id', existing.id)
        .eq('user_id', user.id));
    } else {
      ({ error } = await supabase.from('cart_items').insert({
        user_id: user.id,
        product_id: product.id,
        quantity: safeQty,
      }));
    }

    if (error) {
      console.error('Error al agregar al carrito:', error.message);
      return { ok: false, error: 'No se pudo agregar al carrito. Intentá de nuevo.' };
    }

    await fetchCart();
    return { ok: true };
  };

  const removeFromCart = async (productId: string) => {
    if (!user) {
      setLocalItems(prev => prev.filter(i => i.product.id !== productId));
      return;
    }
    await supabase.from('cart_items').delete().eq('user_id', user.id).eq('product_id', productId);
    await fetchCart();
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const productSource = user
      ? items.find(i => i.product_id === productId)?.product
      : localItems.find(i => i.product.id === productId)?.product;

    if (!productSource) return;

    const safeQty = clampQuantity(productSource, quantity);
    if (safeQty <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (!user) {
      setLocalItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: safeQty } : i));
      return;
    }

    await supabase
      .from('cart_items')
      .update({ quantity: safeQty })
      .eq('user_id', user.id)
      .eq('product_id', productId);
    await fetchCart();
  };

  const clearCart = async () => {
    if (!user) { setLocalItems([]); return; }
    await supabase.from('cart_items').delete().eq('user_id', user.id);
    setItems([]);
  };

  const activeItems = user ? items : [];
  const activelocalItems = user ? [] : localItems;

  const totalItems = user
    ? items.reduce((s, i) => s + i.quantity, 0)
    : localItems.reduce((s, i) => s + i.quantity, 0);

  const totalPrice = user
    ? items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0)
    : localItems.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items: activeItems,
      localItems: activelocalItems,
      totalItems,
      totalPrice,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
