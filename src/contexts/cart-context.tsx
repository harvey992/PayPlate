import { createContext, useContext, useState, type ReactNode } from "react";
import type { MenuItem } from "@/types/payplate";

type CartContextValue = {
  items: { item: MenuItem; quantity: number }[];
  itemCount: number;
  totalCents: number;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  getQuantity: (id: string) => number;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ item: MenuItem; quantity: number }[]>([]);

  function addItem(item: MenuItem) {
    setItems((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.item.id !== id));
  }

  function updateQuantity(id: string, qty: number) {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.item.id === id ? { ...i, quantity: qty } : i)),
    );
  }

  function getQuantity(id: string) {
    return items.find((i) => i.item.id === id)?.quantity ?? 0;
  }

  function clear() {
    setItems([]);
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalCents = items.reduce((sum, i) => sum + i.item.priceCents * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, itemCount, totalCents, addItem, removeItem, updateQuantity, getQuantity, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
