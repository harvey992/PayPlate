import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getSupabase, isSupabaseConfigured } from "@/services/supabase-client";
import { useAuth } from "./auth-context";
import type { Order, CartItem } from "@/types/payplate";
import { useWallet } from "./wallet-context";

type OrdersState = {
  orders: Order[];
  isLoading: boolean;
  createOrder: (params: {
    items: CartItem[]; subtotalCents: number; studentDiscountCents: number;
    promoDiscountCents: number; deliveryFeeCents: number; totalCents: number;
    orderType: "delivery" | "pickup"; paymentMethod: "wallet" | "card";
    restaurantId: string; restaurantName: string;
  }) => Order;
  getOrderById: (id: string) => Order | undefined;
  recentOrders: Order[];
};

const OrdersContext = createContext<OrdersState | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const wallet = useWallet();

  useEffect(() => {
    if (!user || !isSupabaseConfigured) { setIsLoading(false); return; }
    const sb = getSupabase();
    if (!sb) { setIsLoading(false); return; }
    setIsLoading(true);
    async function loadOrders() {
      const { data: dbOrders } = await sb!.from("orders").select("*, order_items(*)").eq("user_id", user!.id).order("created_at", { ascending: false });
      if (dbOrders && dbOrders.length > 0) {
        const mapped: Order[] = dbOrders.map((o: Record<string, unknown>) => ({
          id: o.id as string,
          items: ((o.order_items as Record<string, unknown>[]) ?? []).map((oi) => ({
            item: { id: oi.menu_item_id as string, restaurantId: o.restaurant_id as string, name: oi.name as string, description: "", priceCents: oi.price_cents as number, image: (oi.image as string) ?? "", prepTimeMinutes: 0, dietaryTags: [], category: "" },
            quantity: oi.quantity as number,
          })),
          subtotalCents: o.subtotal_cents as number, studentDiscountCents: o.student_discount_cents as number,
          promoDiscountCents: o.promo_discount_cents as number, deliveryFeeCents: o.delivery_fee_cents as number,
          totalCents: o.total_cents as number, status: o.status as Order["status"],
          orderType: o.order_type as Order["orderType"], paymentMethod: o.payment_method as Order["paymentMethod"],
          restaurantId: o.restaurant_id as string, restaurantName: o.restaurant_name as string,
          createdAt: o.created_at as string, estimatedReadyAt: o.estimated_ready_at as string,
        }));
        setOrders(mapped);
      }
      setIsLoading(false);
    }
    loadOrders();
  }, [user]);

  const value = useMemo<OrdersState>(() => ({
    orders, isLoading,
    createOrder(params) {
      const now = new Date();
      const estimatedReady = new Date(now.getTime() + 25 * 60000);
      const order: Order = { id: `order-${Date.now()}`, ...params, status: "preparing", createdAt: now.toISOString(), estimatedReadyAt: estimatedReady.toISOString() };
      setOrders((prev) => [order, ...prev]);
      if (user && isSupabaseConfigured) {
        const sb = getSupabase();
        if (sb) {
          const orderId = crypto.randomUUID();
          sb.from("orders").insert({ id: orderId, user_id: user.id, restaurant_name: params.restaurantName, status: "preparing", order_type: params.orderType, payment_method: params.paymentMethod, subtotal_cents: params.subtotalCents, student_discount_cents: params.studentDiscountCents, promo_discount_cents: params.promoDiscountCents, delivery_fee_cents: params.deliveryFeeCents, total_cents: params.totalCents, estimated_ready_at: estimatedReady.toISOString() }).then(({ data, error }) => {
            if (!error && data) {
              const items = params.items.map((ci) => ({ order_id: orderId, menu_item_id: ci.item.id, name: ci.item.name, quantity: ci.quantity, price_cents: ci.item.priceCents, image: ci.item.image }));
              sb.from("order_items").insert(items).then(() => { setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, id: orderId } : o)); });
            }
          });
        }
      }
      wallet.deduct(params.totalCents, `${params.restaurantName} — Order`, params.restaurantName);
      return order;
    },
    getOrderById(id) { return orders.find((o) => o.id === id); },
    get recentOrders() { return orders.slice(0, 5); },
  }), [orders, isLoading, wallet, user]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
