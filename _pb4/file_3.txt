import { useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import { motion } from "framer-motion";
import { Receipt, ShoppingBag, Clock, CircleCheck as CheckCircle2, Circle as XCircle, ChefHat, Package, Truck } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/contexts/orders-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatRand, formatDate } from "@/services/payplate-data";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/payplate";

type Tab = "active" | "completed" | "cancelled";

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "text-warning bg-warning/10" },
  preparing: { label: "Preparing", color: "text-primary bg-primary/10" },
  ready: { label: "Ready", color: "text-success bg-success/10" },
  delivered: { label: "Delivered", color: "text-muted-foreground bg-muted" },
  cancelled: { label: "Cancelled", color: "text-danger bg-danger/10" },
};

const timelineSteps: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: "pending", label: "Order placed", icon: <Receipt size={14} /> },
  { status: "preparing", label: "Preparing", icon: <ChefHat size={14} /> },
  { status: "ready", label: "Ready for pickup", icon: <Package size={14} /> },
  { status: "delivered", label: "Delivered", icon: <CheckCircle2 size={14} /> },
];

function getTimelineProgress(status: OrderStatus): number {
  const idx = timelineSteps.findIndex((s) => s.status === status);
  if (status === "cancelled") return -1;
  return idx;
}

export function OrdersPage() {
  const { orders, isLoading } = useOrders();
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();
  const [activeTab, setActiveTab] = useState<Tab>("active");

  const activeOrders = orders.filter((o) => o.status === "pending" || o.status === "preparing" || o.status === "ready");
  const completedOrders = orders.filter((o) => o.status === "delivered");
  const cancelledOrders = orders.filter((o) => o.status === "cancelled");

  const tabOrders = activeTab === "active" ? activeOrders : activeTab === "completed" ? completedOrders : cancelledOrders;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "active", label: "Active", count: activeOrders.length },
    { key: "completed", label: "Completed", count: completedOrders.length },
    { key: "cancelled", label: "Cancelled", count: cancelledOrders.length },
  ];

  if (!isLoading && orders.length === 0) {
    return (
      <AppShell>
        <EmptyState
          icon={<ShoppingBag size={32} />}
          title="No orders yet"
          description="Your order history will appear here once you place your first order."
          action={<Button onClick={() => navigate("/restaurants")}>Browse restaurants</Button>}
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-black lg:text-3xl">Your orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track and manage your food orders</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all",
                activeTab === tab.key
                  ? "bg-primary text-white shadow-lift"
                  : "bg-card text-muted-foreground ring-1 ring-border hover:text-text",
              )}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={cn(
                  "grid min-w-5 place-items-center rounded-full px-1 text-xs",
                  activeTab === tab.key ? "bg-white/20" : "bg-muted",
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40" />)}
          </div>
        ) : tabOrders.length === 0 ? (
          <Card className="py-12 text-center">
            <ShoppingBag size={32} className="mx-auto text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No {activeTab} orders</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {tabOrders.map((order, i) => {
              const status = statusConfig[order.status];
              const timelineProgress = getTimelineProgress(order.status);
              return (
                <motion.div
                  key={order.id}
                  initial={reduced ? undefined : { opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-black">{order.restaurantName}</h3>
                          <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", status.color)}>
                            {status.label}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {formatDate(order.createdAt)} · {order.items.length} item{order.items.length > 1 ? "s" : ""}
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock size={12} /> Ready by {formatDate(order.estimatedReadyAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-heading text-lg font-black tabular-nums">{formatRand(order.totalCents)}</p>
                        <p className="text-xs capitalize text-muted-foreground">{order.orderType} · {order.paymentMethod}</p>
                      </div>
                    </div>

                    {/* Timeline for active orders */}
                    {activeTab === "active" && order.status !== "cancelled" && timelineProgress >= 0 && (
                      <div className="mt-4 border-t border-border pt-4">
                        <div className="flex items-center justify-between">
                          {timelineSteps.map((step, idx) => {
                            const isComplete = idx <= timelineProgress;
                            const isCurrent = idx === timelineProgress;
                            return (
                              <div key={step.status} className="flex flex-1 flex-col items-center gap-1.5">
                                <div className={cn(
                                  "grid size-8 place-items-center rounded-full transition-all",
                                  isComplete ? "bg-primary text-white" : "bg-muted text-muted-foreground",
                                  isCurrent && "ring-2 ring-primary/30 ring-offset-2 ring-offset-card",
                                )}>
                                  {step.icon}
                                </div>
                                <span className={cn(
                                  "text-[10px] font-bold text-center",
                                  isComplete ? "text-text" : "text-muted-foreground",
                                )}>
                                  {step.label}
                                </span>
                                {idx < timelineSteps.length - 1 && (
                                  <div className={cn(
                                    "absolute h-0.5",
                                    idx < timelineProgress ? "bg-primary" : "bg-border",
                                  )} style={{ left: `${(idx + 1) * 25}%`, width: "25%" }} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Items */}
                    <div className="mt-3 border-t border-border pt-3">
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {order.items.map((ci) => (
                          <span key={ci.item.id} className="rounded-lg bg-muted px-2 py-1">
                            {ci.quantity}× {ci.item.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <Button variant="secondary" className="text-sm" onClick={() => navigate(`/payment-success/${order.id}`)}>
                        <Receipt size={16} /> View receipt
                      </Button>
                      {order.status === "cancelled" && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-danger">
                          <XCircle size={14} /> Order cancelled
                        </span>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
