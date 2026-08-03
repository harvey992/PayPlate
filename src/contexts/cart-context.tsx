import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { ShoppingBag } from "lucide-react";
import type { CartItem, MenuItem } from "@/types/payplate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  // A user adding an item from a different restaurant than what's already in
  // the cart is asked to confirm first, rather than silently mixing items
  // from two restaurants into one order (which checkout can only attribute
  // to a single restaurant).
  const [pendingConflict, setPendingConflict] = useState<{ item: MenuItem; quantity: number } | null>(null);

  const value = useMemo<CartState>(() => {
    const itemCount = items.reduce((s, i) => s + i.quantity, 0);
    const subtotalCents = items.reduce((s, i) => s + i.item.priceCents * i.quantity, 0);
    const studentDiscountCents = Math.round(subtotalCents * STUDENT_DISCOUNT_RATE);
    const deliveryFeeCents = items.length > 0 ? DELIVERY_FEE_CENTS : 0;
    const totalCents = subtotalCents - studentDiscountCents + deliveryFeeCents;
    return {
      items, itemCount, subtotalCents, studentDiscountCents, deliveryFeeCents, totalCents,
      addItem(item, quantity = 1) {
        const currentRestaurantId = items[0]?.item.restaurantId;
        if (currentRestaurantId && currentRestaurantId !== item.restaurantId) {
          setPendingConflict({ item, quantity });
          return;
        }
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

  return (
    <CartContext.Provider value={value}>
      {children}
      {pendingConflict && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 p-4 sm:items-center" role="dialog" aria-modal="true">
          <Card className="w-full max-w-sm">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-warning/10">
              <ShoppingBag size={22} className="text-warning" />
            </div>
            <h3 className="mt-3 text-center font-heading font-black">Start a new cart?</h3>
            <p className="mt-1.5 text-center text-sm text-muted-foreground">
              Your cart has items from another restaurant. Adding this will clear your current cart.
            </p>
            <div className="mt-5 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setPendingConflict(null)}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setItems([{ item: pendingConflict.item, quantity: pendingConflict.quantity }]);
                  setPendingConflict(null);
                }}
              >
                Start new cart
              </Button>
            </div>
          </Card>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
