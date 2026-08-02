import { createContext, useContext, useState, type ReactNode } from "react";
import type { Order, OrderItem } from "@/types/payplate";

type OrdersContextValue = {
  orders: Order[];
  isLoading: boolean;
  createOrder: (order: Omit<Order, "id" | "createdAt" | "status" | "rewardPointsEarned">) => Order;
  reorder: (orderId: string) => OrderItem[] | null;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
};

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

const seedOrders: Order[] = [
  {
    id: "ord-1",
    restaurantId: "burger-lab",
    restaurantName: "Burger Lab",
    items: [
      { item: { id: "classic-cheeseburger", restaurantId: "burger-lab", name: "Classic Cheeseburger", description: "", priceCents: 7200, image: "", prepTimeMinutes: 12, dietaryTags: [], isPopular: true, category: "Burgers" }, quantity: 1 },
      { item: { id: "truffle-fries", restaurantId: "burger-lab", name: "Truffle Parmesan Fries", description: "", priceCents: 3800, image: "", prepTimeMinutes: 8, dietaryTags: [], isPopular: false, category: "Sides" }, quantity: 1 },
    ],
    totalCents: 11000,
    status: "picked_up",
    createdAt: "2026-07-28T14:30:00Z",
    rewardPointsEarned: 55,
  },
  {
    id: "ord-2",
    restaurantId: "brew-lab",
    restaurantName: "Brew Lab Coffee",
    items: [
      { item: { id: "flat-white", restaurantId: "brew-lab", name: "Flat White", description: "", priceCents: 2800, image: "", prepTimeMinutes: 4, dietaryTags: [], isPopular: true, category: "Coffee" }, quantity: 2 },
    ],
    totalCents: 5600,
    status: "picked_up",
    createdAt: "2026-07-28T08:00:00Z",
    rewardPointsEarned: 28,
  },
];

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(seedOrders);

  function createOrder(input: Omit<Order, "id" | "createdAt" | "status" | "rewardPointsEarned">): Order {
    const rewardPointsEarned = Math.floor(input.totalCents / 200);
    const order: Order = {
      ...input,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "preparing",
      rewardPointsEarned,
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  }

  function reorder(orderId: string): OrderItem[] | null {
    const order = orders.find((o) => o.id === orderId);
    return order ? order.items : null;
  }

  function updateOrderStatus(orderId: string, status: Order["status"]) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
  }

  return (
    <OrdersContext.Provider value={{ orders, isLoading: false, createOrder, reorder, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
