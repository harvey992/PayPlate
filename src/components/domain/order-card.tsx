import { motion } from "framer-motion";
import { Clock, CheckCircle2, ChefHat, XCircle } from "lucide-react";
import type { Order, OrderStatus } from "@/types/payplate";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

const statusConfig: Record<OrderStatus, { icon: typeof Clock; label: string; color: string; bg: string }> = {
  pending: { icon: Clock, label: "Pending", color: "text-amber-500", bg: "bg-amber-500/10" },
  preparing: { icon: ChefHat, label: "Preparing", color: "text-blue-500", bg: "bg-blue-500/10" },
  ready: { icon: CheckCircle2, label: "Ready", color: "text-green-500", bg: "bg-green-500/10" },
  delivered: { icon: CheckCircle2, label: "Delivered", color: "text-slate-400", bg: "bg-slate-400/10" },
  cancelled: { icon: XCircle, label: "Cancelled", color: "text-red-500", bg: "bg-red-500/10" },
};

export function OrderCard({ order }: { order: Order }) {
  const reduced = usePrefersReducedMotion();
  const config = statusConfig[order.status];
  const StatusIcon = config.icon;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", config.bg)}>
            <StatusIcon className={cn("h-5 w-5", config.color)} />
          </div>
          <div>
            <p className="font-semibold">Order #{order.id}</p>
            <p className="text-sm text-muted-foreground">{order.restaurantName}</p>
          </div>
        </div>
        <Badge className={cn(config.color)}>{config.label}</Badge>
      </div>
      <div className="mt-4 space-y-1">
        {order.items.map((cartItem, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span>{cartItem.quantity}× {cartItem.item.name}</span>
            <span className="text-muted-foreground">${((cartItem.item.priceCents * cartItem.quantity) / 100).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="font-bold">${(order.totalCents / 100).toFixed(2)}</span>
      </div>
      {!reduced && order.status === "preparing" && (
        <motion.div
          className="mt-3 h-1 rounded-full bg-blue-500/20"
          initial={{ width: "0%" }}
          animate={{ width: ["0%", "100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-full rounded-full bg-blue-500" style={{ width: "60%" }} />
        </motion.div>
      )}
    </Card>
  );
}
