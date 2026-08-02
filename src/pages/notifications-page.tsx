import { Bell, Gift, Wallet, Store } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { motion } from "framer-motion";

const notifications = [
  { id: 1, icon: Gift, title: "Reward earned!", description: "You earned 55 reward points from Burger Lab.", time: "2h ago", color: "text-rewards", bg: "bg-rewards/10" },
  { id: 2, icon: Wallet, title: "Wallet topped up", description: "R500.00 has been added to your wallet.", time: "5h ago", color: "text-primary", bg: "bg-primary/10" },
  { id: 3, icon: Store, title: "New restaurant", description: "Sushi Sensei is now available on campus!", time: "1d ago", color: "text-accent", bg: "bg-accent/10" },
];

export function NotificationsPage() {
  const reduced = usePrefersReducedMotion();

  if (notifications.length === 0) {
    return <AppShell><EmptyState icon={<Bell size={28} />} title="No notifications" description="Your alerts and updates will appear here." /></AppShell>;
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="font-heading text-2xl font-black">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">{notifications.length} unread</p>
        </div>

        <div className="space-y-3">
          {notifications.map((n, i) => {
            const Icon = n.icon;
            return (
              <motion.div key={n.id} initial={reduced ? undefined : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card className="flex items-start gap-3 p-4">
                  <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${n.bg} ${n.color}`}><Icon size={18} /></div>
                  <div className="flex-1">
                    <h3 className="font-heading text-sm font-black">{n.title}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{n.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
