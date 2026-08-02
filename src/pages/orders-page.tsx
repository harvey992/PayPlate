import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Receipt, Clock, CircleCheck as CheckCircle2, Package, Circle as XCircle, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useOrders } from "@/contexts/orders-context";
import { useToast } from "@/contexts/toast-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatRand, formatDate } from "@/services/payplate-data";
import type { Order } from "@/types/payplate";
import { cn } from "@/lib/utils";

const statusConfig = {
  preparing: { icon: Clock, label: "Preparing", color: "text-warning", bg: "bg-warning/10" },
  ready: { icon: Package, label: "Ready for pickup", color: "text-primary", bg: "bg-primary/10" },
  picked_up: { icon: CheckCircle2, label: "Picked up", color: "text-success", bg: "bg-success/10" },
  cancelled: { icon: XCircle, label: "Cancelled", color: "text-danger", bg: "bg-danger/10" },
};

export function OrdersPage() {
  const { orders, isLoading, reorder } = useOrders();
  const { showToast } = useToast();
  const reduced = usePrefersReducedMotion();

  function handleReorder(orderId: string, restaurantName: string) {
    const items = reorder(orderId);
    if (items) {
      showToast(`Reordering from ${restaurantName}`, "success");
    }
  }

  if (!isLoading && orders.length === 0) {
    return (
      <AppShell>
        <EmptyState icon={<Receipt size={28} />} title="No orders yet" description="Your order history will appear here once you place your first order." action={<Link to="/restaurants"><Button>Browse restaurants</Button></Link>} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="font-heading text-2xl font-black">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">{orders.length} total orders</p>
        </div>

        <div className="space-y-3">
          {orders.map((order, i) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            return (
              <motion.div key={order.id} initial={reduced ? undefined : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate font-heading font-black">{order.restaurantName}</h3>
                      <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black", status.bg, status.color)}>
                      <StatusIcon size={12} /> {status.label}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1">
                    {order.items.map((oi, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{oi.quantity}× {oi.item.name}</span>
                        <span className="font-bold">{formatRand(oi.item.priceCents * oi.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Total · +{order.rewardPointsEarned} pts</p>
                      <p className="font-heading font-black">{formatRand(order.totalCents)}</p>
                    </div>
                    <Button variant="secondary" className="text-sm" onClick={() => handleReorder(order.id, order.restaurantName)}>
                      <RotateCcw size={14} /> Reorder
                    </Button>
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
