import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@/lib/router-compat";
import { motion } from "framer-motion";
import { CircleCheck as CheckCircle2, Receipt, Chrome as Home, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/contexts/orders-context";
import { useWallet } from "@/contexts/wallet-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatRand, formatDate } from "@/services/payplate-data";
import type { Order } from "@/types/payplate";

export function PaymentSuccessPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById } = useOrders();
  const { rewardPoints } = useWallet();
  const reduced = usePrefersReducedMotion();
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    if (id) setOrder(getOrderById(id));
  }, [id, getOrderById]);

  useEffect(() => {
    const timer = setTimeout(() => setShowReceipt(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const pointsEarned = order ? Math.floor(order.totalCents / 100) : 0;

  return (
    <AppShell>
      <div className="mx-auto max-w-lg">
        {/* Success animation */}
        <div className="flex flex-col items-center pt-8 text-center">
          <motion.div
            initial={reduced ? undefined : { scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative grid size-24 place-items-center rounded-full bg-success/15"
          >
            <motion.div
              animate={reduced ? undefined : { scale: [1, 1.15, 1] }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <CheckCircle2 size={56} className="text-success" />
            </motion.div>
            {/* Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={reduced ? undefined : { opacity: 0, scale: 0 }}
                animate={reduced ? undefined : { opacity: [0, 1, 0], scale: [0, 1, 0], x: Math.cos((i / 6) * Math.PI * 2) * 60, y: Math.sin((i / 6) * Math.PI * 2) * 60 }}
                transition={{ duration: 1, delay: 0.4 + i * 0.05 }}
                className="absolute"
              >
                <Sparkles size={16} className="text-rewards" />
              </motion.div>
            ))}
          </motion.div>

          <motion.h1
            initial={reduced ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 font-heading text-2xl font-black"
          >
            Payment successful!
          </motion.h1>
          <motion.p
            initial={reduced ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-muted-foreground"
          >
            You earned {pointsEarned} reward points
          </motion.p>
        </div>

        {/* Receipt */}
        {order && (
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 30 }}
            animate={{ opacity: showReceipt ? 1 : 0, y: showReceipt ? 0 : 30 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <Card>
              <div className="flex items-center gap-2 border-b border-border pb-4">
                <Receipt size={18} className="text-primary" />
                <h3 className="font-heading font-black">Receipt</h3>
                <span className="ml-auto text-xs text-muted-foreground">#{order.id.slice(-6).toUpperCase()}</span>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Restaurant</span>
                  <span className="font-bold">{order.restaurantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order type</span>
                  <span className="font-bold capitalize">{order.orderType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Placed</span>
                  <span className="font-bold">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated ready</span>
                  <span className="font-bold text-primary">{formatDate(order.estimatedReadyAt)}</span>
                </div>
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <div className="space-y-1 text-sm">
                  {order.items.map((ci) => (
                    <div key={ci.item.id} className="flex justify-between">
                      <span className="text-muted-foreground">{ci.quantity}× {ci.item.name}</span>
                      <span className="font-bold tabular-nums">{formatRand(ci.item.priceCents * ci.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold tabular-nums">{formatRand(order.subtotalCents)}</span>
                </div>
                <div className="flex justify-between text-success">
                  <span>Student discount</span>
                  <span className="font-bold tabular-nums">−{formatRand(order.studentDiscountCents)}</span>
                </div>
                {order.deliveryFeeCents > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-bold tabular-nums">{formatRand(order.deliveryFeeCents)}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="font-heading text-lg font-black">Total paid</span>
                <span className="font-heading text-2xl font-black text-primary tabular-nums">{formatRand(order.totalCents)}</span>
              </div>

              <div className="mt-3 rounded-xl bg-rewards/10 px-4 py-3 text-center text-sm font-bold text-rewards">
                +{pointsEarned} reward points earned · Total: {rewardPoints} pts
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={reduced ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-6 flex gap-3"
        >
          <Button variant="secondary" className="flex-1" onClick={() => navigate("/orders")}>
            View orders
          </Button>
          <Button className="flex-1" onClick={() => navigate("/home")}>
            <Home size={18} /> Back home
          </Button>
        </motion.div>
      </div>
    </AppShell>
  );
}
