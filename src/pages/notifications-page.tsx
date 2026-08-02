import { Bell, ShoppingBag, Gift, Tag } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/services/payplate-data";

const mockNotifications = [
  { id: "n1", icon: <Gift size={20} />, title: "You earned 50 reward points!", desc: "From your order at Burger Lab", time: "2026-07-29T14:35:00Z", color: "bg-rewards/10 text-rewards" },
  { id: "n2", icon: <Tag size={20} />, title: "New student offer available", desc: "20% off all pizzas at Pizza Studio", time: "2026-07-29T10:00:00Z", color: "bg-primary/10 text-primary" },
  { id: "n3", icon: <ShoppingBag size={20} />, title: "Your order is being prepared", desc: "Burger Lab — Classic Cheeseburger", time: "2026-07-28T14:31:00Z", color: "bg-primary/10 text-primary" },
  { id: "n4", icon: <Bell size={20} />, title: "Welcome to PayPlate!", desc: "Complete your student verification to unlock discounts.", time: "2026-07-28T09:00:00Z", color: "bg-muted text-muted-foreground" },
];

export function NotificationsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-black lg:text-3xl">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">Stay up to date with your orders and rewards</p>
        </div>

        {mockNotifications.length === 0 ? (
          <EmptyState
            icon={<Bell size={32} />}
            title="No notifications yet"
            description="Order updates, rewards, and offers will appear here."
          />
        ) : (
          <div className="space-y-3">
            {mockNotifications.map((n) => (
              <Card key={n.id} className="flex items-start gap-3">
                <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${n.color}`}>
                  {n.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold">{n.title}</h3>
                    <Badge variant="default" className="shrink-0">{timeAgo(n.time)}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{n.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
