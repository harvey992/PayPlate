import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { CartItem, MenuItem } from "@/types/payplate";

type CartState = {
  items: CartItem[];
  itemCount: number;
  subtotalCents: number;
  studentDiscountCents: number;
  deliveryFeeCents: number;
  totalCents: number;
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clear: () => void;
  hasItem: (itemId: string) => boolean;
  getQuantity: (itemId: string) => number;
};

const DELIVERY_FEE_CENTS = 1500;
const STUDENT_DISCOUNT_RATE = 0.15;

const CartContext = createContext<CartState | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const value = useMemo<CartState>(() => {
    const itemCount = items.reduce((s, i) => s + i.quantity, 0);
    const subtotalCents = items.reduce((s, i) => s + i.item.priceCents * i.quantity, 0);
    const studentDiscountCents = Math.round(subtotalCents * STUDENT_DISCOUNT_RATE);
    const deliveryFeeCents = items.length > 0 ? DELIVERY_FEE_CENTS : 0;
    const totalCents = subtotalCents - studentDiscountCents + deliveryFeeCents;
    return {
      items, itemCount, subtotalCents, studentDiscountCents, deliveryFeeCents, totalCents,
      addItem(item, quantity = 1) {
        setItems((prev) => {
          const existing = prev.find((i) => i.item.id === item.id);
          if (existing) return prev.map((i) => i.item.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
          return [...prev, { item, quantity }];
        });
      },
      removeItem(itemId) { setItems((prev) => prev.filter((i) => i.item.id !== itemId)); },
      updateQuantity(itemId, quantity) {
        if (quantity <= 0) { setItems((prev) => prev.filter((i) => i.item.id !== itemId)); return; }
        setItems((prev) => prev.map((i) => (i.item.id === itemId ? { ...i, quantity } : i)));
      },
      clear() { setItems([]); },
      hasItem(itemId) { return items.some((i) => i.item.id === itemId); },
      getQuantity(itemId) { return items.find((i) => i.item.id === itemId)?.quantity ?? 0; },
    };
  }, [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
