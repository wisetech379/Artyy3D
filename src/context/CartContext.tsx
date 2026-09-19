import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Product } from '@/types';

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  open: () => void;
  close: () => void;
  add: (product: Product, quantity?: number, size?: string, color?: string) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = '3print_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = useCallback((product: Product, quantity = 1, size?: string, color?: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color);
      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [...prev, { ...product, quantity, selectedSize: size, selectedColor: color }];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((id: string) => setItems((prev) => prev.filter((item) => item.id !== id)), []);
  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)),
    );
  }, []);
  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? (subtotal > 75 ? 0 : 6.5) : 0;
    return { items, isOpen, count, subtotal, shipping, total: subtotal + shipping, open, close, add, remove, setQuantity, clear };
  }, [items, isOpen, add, remove, setQuantity, clear, open, close]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
