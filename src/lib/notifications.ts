import type { Order, Transaction } from "@/types/payplate";

export type AppNotification = {
  id: string;
  kind: "topup" | "reward" | "payment" | "refund" | "order_ready" | "order_delivered" | "order_cancelled";
  title: string;
  desc: string;
  date: string;
};

const LAST_SEEN_KEY = "payplate_notifications_last_seen";

/** Turn real wallet transactions + order status into a unified, time-sorted notification feed. */
export function buildNotifications(transactions: Transaction[], orders: Order[]): AppNotification[] {
  const fromTransactions: AppNotification[] = transactions.map((t) => {
    switch (t.type) {
      case "topup":
        return { id: `txn-${t.id}`, kind: "topup", title: "Wallet topped up", desc: t.description, date: t.date };
      case "reward":
        return { id: `txn-${t.id}`, kind: "reward", title: "You earned reward points", desc: t.description, date: t.date };
      case "refund":
        return { id: `txn-${t.id}`, kind: "refund", title: "Refund processed", desc: t.description, date: t.date };
      case "payment":
      default:
        return {
          id: `txn-${t.id}`,
          kind: "payment",
          title: "Payment made",
          desc: t.merchantName ? `${t.description} — ${t.merchantName}` : t.description,
          date: t.date,
        };
    }
  });

  const fromOrders: AppNotification[] = orders
    .filter((o) => o.status === "ready" || o.status === "delivered" || o.status === "cancelled")
    .map((o) => {
      if (o.status === "cancelled") {
        return { id: `order-${o.id}`, kind: "order_cancelled" as const, title: "Order cancelled", desc: o.restaurantName, date: o.createdAt };
      }
      if (o.status === "ready") {
        return { id: `order-${o.id}`, kind: "order_ready" as const, title: "Your order is ready", desc: o.restaurantName, date: o.estimatedReadyAt };
      }
      return { id: `order-${o.id}`, kind: "order_delivered" as const, title: "Order delivered", desc: o.restaurantName, date: o.estimatedReadyAt };
    });

  return [...fromTransactions, ...fromOrders].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getLastSeenNotifications(): number {
  if (typeof window === "undefined") return 0;
  const stored = window.localStorage.getItem(LAST_SEEN_KEY);
  return stored ? Number(stored) : 0;
}

export function markNotificationsSeen(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LAST_SEEN_KEY, String(Date.now()));
}

export function countUnread(notifications: AppNotification[]): number {
  const lastSeen = getLastSeenNotifications();
  return notifications.filter((n) => new Date(n.date).getTime() > lastSeen).length;
}
