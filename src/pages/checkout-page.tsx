import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, Tag, ArrowRight, CircleCheck as CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useCart } from "@/contexts/cart-context";
import { useWallet } from "@/contexts/wallet-context";
import { useOrders } from "@/contexts/orders-context";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/contexts/toast-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatRand } from "@/services/payplate-data";

export function CheckoutPage() {
  const { items, totalCents, clear } = useCart();
  const { balanceCents, spend, addReward } = useWallet();
  const { createOrder } = useOrders();
  const { user } = useAuth();
  const { showToast } = useToast();
  const reduced = usePrefersReducedMotion();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const studentDiscount = user?.verificationStatus === "verified" ? Math.round(totalCents * 0.15) : 0;
  const deliveryFee = 1000;
  const finalTotal = totalCents - studentDiscount + deliveryFee;
  const sufficientBalance = balanceCents >= finalTotal;

  if (items.length === 0) {
    return <AppShell><EmptyState icon={<CheckCircle2 size={28} />} title="Nothing to check out" description="Your cart is empty." action={<Button onClick={() => navigate("/restaurants")}>Browse restaurants</Button>} /></AppShell>;
  }

  function handleCheckout() {
    if (!sufficientBalance) { showToast("Insufficient wallet balance. Top up to continue.", "error"); return; }
    setIsProcessing(true);
    setTimeout(() => {
      const restaurantName = items[0]?.item ? `${items[0].item.name}` : "Order";
      const order = createOrder({
        restaurantId: items[0]?.item.restaurantId || "",
        restaurantName: items[0]?.item.restaurantId || "Restaurant",
        items: items.map(({ item, quantity }) => ({ item, quantity })),
        totalCents: finalTotal,
      });
      spend(finalTotal, `Payment — ${order.restaurantName}`);
      addReward(order.rewardPointsEarned, `Reward points — ${order.restaurantName}`);
      clear();
      setIsProcessing(false);
      showToast("Payment successful!", "success");
      navigate("/payment-success");
    }, 1500);
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="font-heading text-2xl font-black">Checkout</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pay with your PayPlate wallet</p>
        </div>

        {/* Payment method */}
        <Card className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Wallet size={22} /></div>
          <div className="flex-1">
            <h3 className="font-heading font-black">PayPlate Wallet</h3>
            <p className="text-sm text-muted-foreground">Balance: {formatRand(balanceCents)}</p>
          </div>
          <CheckCircle2 size={20} className="text-primary" />
        </Card>

        {!sufficientBalance && (
          <Card className="border-danger/30 bg-danger/5">
            <p className="text-sm font-bold text-danger">Insufficient balance. You need {formatRand(finalTotal - balanceCents)} more.</p>
            <Button variant="secondary" className="mt-3 w-full" onClick={() => navigate("/wallet")}>Top up wallet</Button>
          </Card>
        )}

        {/* Summary */}
        <Card>
          <h3 className="font-heading font-black">Payment summary</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal ({items.length} items)</span><span className="font-bold">{formatRand(totalCents)}</span></div>
            {studentDiscount > 0 && <div className="flex justify-between text-primary"><span className="inline-flex items-center gap-1"><Tag size={12} /> Student discount</span><span className="font-bold">-{formatRand(studentDiscount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery fee</span><span className="font-bold">{formatRand(deliveryFee)}</span></div>
            <div className="flex justify-between border-t border-border pt-2"><span className="font-heading font-black">Total</span><span className="font-heading font-black text-primary">{formatRand(finalTotal)}</span></div>
          </div>
        </Card>

        <Button className="w-full" onClick={handleCheckout} disabled={isProcessing || !sufficientBalance}>
          {isProcessing ? "Processing..." : <>Pay {formatRand(finalTotal)} <ArrowRight size={16} /></>}
        </Button>
      </div>
    </AppShell>
  );
}
