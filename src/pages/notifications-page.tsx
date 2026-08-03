import { useEffect, useMemo } from "react";
import { Bell, ShoppingBag, Gift, Tag, RotateCcw, CircleCheck as CheckCircle2, XCircle } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/services/payplate-data";
import { useWallet } from "@/contexts/wallet-context";
import { useOrders } from "@/contexts/orders-context";
import { buildNotifications, markNotificationsSeen, type AppNotification } from "@/lib/notifications";

const ICONS: Record<AppNotification["kind"], { icon: React.ReactNode; color: string }> = {
  topup: { icon: <Gift size={20} />, color: "bg-rewards/10 text-rewards" },
  reward: { icon: <Gift size={20} />, color: "bg-rewards/10 text-rewards" },
  payment: { icon: <ShoppingBag size={20} />, color: "bg-primary/10 text-primary" },
  refund: { icon: <RotateCcw size={20} />, color: "bg-blue-500/10 text-blue-500" },
  order_ready: { icon: <Tag size={20} />, color: "bg-primary/10 text-primary" },
  order_delivered: { icon: <CheckCircle2 size={20} />, color: "bg-success/10 text-success" },
  order_cancelled: { icon: <XCircle size={20} />, color: "bg-danger/10 text-danger" },
};

export function NotificationsPage() {
  const { transactions } = useWallet();
  const { orders } = useOrders();

  const notifications = useMemo(() => buildNotifications(transactions, orders), [transactions, orders]);

  // Visiting this page marks everything as read (clears the bell badge).
  useEffect(() => {
    markNotificationsSeen();
  }, []);

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-black lg:text-3xl">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">Stay up to date with your orders and rewards</p>
        </div>

        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell size={32} />}
            title="No notifications yet"
            description="Order updates, rewards, and offers will appear here."
          />
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => {
              const { icon, color } = ICONS[n.kind];
              return (
                <Card key={n.id} className="flex items-start gap-3">
                  <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${color}`}>
                    {icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold">{n.title}</h3>
                      <Badge variant="default" className="shrink-0">{timeAgo(n.date)}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{n.desc}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
