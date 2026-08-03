import { useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import { motion } from "framer-motion";
import { Truck, Store, Wallet, CreditCard, CircleCheck as CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useCart } from "@/contexts/cart-context";
import { useOrders } from "@/contexts/orders-context";
import { useWallet } from "@/contexts/wallet-context";
import { useToast } from "@/contexts/toast-context";
import { useAuth } from "@/contexts/auth-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatRand } from "@/services/payplate-data";
import { cn } from "@/lib/utils";
import type { OrderType, PaymentMethod } from "@/types/payplate";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotalCents, studentDiscountCents, deliveryFeeCents, totalCents, clear } = useCart();
  const { createOrder } = useOrders();
  const { balanceCents } = useWallet();
  const { showToast } = useToast();
  const { user } = useAuth();
  const reduced = usePrefersReducedMotion();

  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wallet");
  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0) {
    return (<AppShell><EmptyState icon={<span className="text-3xl">🛒</span>} title="Nothing to check out" description="Your cart is empty. Add some meals first!" action={<Button onClick={() => navigate("/restaurants")}>Browse restaurants</Button>} /></AppShell>);
  }

  const insufficientFunds = paymentMethod === "wallet" && balanceCents < totalCents;

  async function handleCheckout() {
    if (insufficientFunds) { showToast("Insufficient wallet balance. Top up or choose card.", "error"); return; }
    setIsProcessing(true);
    const restaurantId = items[0]?.item.restaurantId ?? "unknown";
    const restaurantName = items[0]?.item.restaurantId ? items[0].item.restaurantId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Restaurant";
    setTimeout(() => {
      const order = createOrder({ items, subtotalCents, studentDiscountCents, promoDiscountCents: 0, deliveryFeeCents: orderType === "delivery" ? deliveryFeeCents : 0, totalCents: orderType === "delivery" ? totalCents : totalCents - deliveryFeeCents, orderType, paymentMethod, restaurantId, restaurantName });
      clear(); setIsProcessing(false); showToast("Order placed successfully!", "success"); navigate(`/payment-success/${order.id}`);
    }, 1500);
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center gap-3"><button onClick={() => navigate("/cart")} aria-label="Back to cart" className="grid size-10 place-items-center rounded-xl bg-card ring-1 ring-border"><ArrowLeft size={18} /></button><div><h1 className="font-heading text-2xl font-black lg:text-3xl">Checkout</h1><p className="text-sm text-muted-foreground">Review and place your order</p></div></div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {/* Order type */}
            <Card><h3 className="font-heading font-black">Delivery or pickup?</h3><div className="mt-4 grid grid-cols-2 gap-3"><button onClick={() => setOrderType("delivery")} className={cn("flex items-center gap-3 rounded-2xl border-2 p-4 transition-all", orderType === "delivery" ? "border-primary bg-primary/5" : "border-border")}><div className={cn("grid size-10 place-items-center rounded-xl", orderType === "delivery" ? "bg-primary text-white" : "bg-muted")}><Truck size={20} /></div><div className="text-left"><p className="font-bold">Delivery</p><p className="text-xs text-muted-foreground">{formatRand(deliveryFeeCents)} fee</p></div></button><button onClick={() => setOrderType("pickup")} className={cn("flex items-center gap-3 rounded-2xl border-2 p-4 transition-all", orderType === "pickup" ? "border-primary bg-primary/5" : "border-border")}><div className={cn("grid size-10 place-items-center rounded-xl", orderType === "pickup" ? "bg-primary text-white" : "bg-muted")}><Store size={20} /></div><div className="text-left"><p className="font-bold">Pickup</p><p className="text-xs text-muted-foreground">No fee</p></div></button></div></Card>
            {/* Payment method */}
            <Card><h3 className="font-heading font-black">Payment method</h3><div className="mt-4 space-y-3"><button onClick={() => setPaymentMethod("wallet")} className={cn("flex w-full items-center justify-between rounded-2xl border-2 p-4 transition-all", paymentMethod === "wallet" ? "border-primary bg-primary/5" : "border-border")}><div className="flex items-center gap-3"><div className={cn("grid size-10 place-items-center rounded-xl", paymentMethod === "wallet" ? "bg-primary text-white" : "bg-muted")}><Wallet size={20} /></div><div className="text-left"><p className="font-bold">PayPlate Wallet</p><p className="text-xs text-muted-foreground">Balance: {formatRand(balanceCents)}</p></div></div>{paymentMethod === "wallet" && <CheckCircle2 size={20} className="text-primary" />}</button><button onClick={() => setPaymentMethod("card")} className={cn("flex w-full items-center justify-between rounded-2xl border-2 p-4 transition-all", paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border")}><div className="flex items-center gap-3"><div className={cn("grid size-10 place-items-center rounded-xl", paymentMethod === "card" ? "bg-primary text-white" : "bg-muted")}><CreditCard size={20} /></div><div className="text-left"><p className="font-bold">Card</p><p className="text-xs text-muted-foreground">Visa, Mastercard (coming soon)</p></div></div>{paymentMethod === "card" && <CheckCircle2 size={20} className="text-primary" />}</button></div>{insufficientFunds && (<div className="mt-3 rounded-xl bg-danger/10 px-4 py-3 text-sm font-bold text-danger">Insufficient wallet balance. You need {formatRand(totalCents - balanceCents)} more.</div>)}</Card>
          </div>
          {/* Order summary */}
          <div><Card><h3 className="font-heading font-black">Order summary</h3><div className="mt-3 max-h-48 space-y-2 overflow-y-auto">{items.map((ci) => (<div key={ci.item.id} className="flex justify-between text-sm"><span className="text-muted-foreground">{ci.quantity}× {ci.item.name}</span><span className="font-bold tabular-nums">{formatRand(ci.item.priceCents * ci.quantity)}</span></div>))}</div><div className="mt-4 space-y-2 border-t border-border pt-4 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-bold tabular-nums">{formatRand(subtotalCents)}</span></div><div className="flex justify-between text-success"><span>Student discount</span><span className="font-bold tabular-nums">−{formatRand(studentDiscountCents)}</span></div>{orderType === "delivery" && (<div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="font-bold tabular-nums">{formatRand(deliveryFeeCents)}</span></div>)}</div><div className="mt-4 flex items-center justify-between border-t border-border pt-4"><span className="font-heading text-lg font-black">Total</span><span className="font-heading text-2xl font-black text-primary tabular-nums">{formatRand(orderType === "delivery" ? totalCents : totalCents - deliveryFeeCents)}</span></div><Button className="mt-4 w-full" disabled={isProcessing || insufficientFunds || (paymentMethod === "card")} onClick={handleCheckout}>{isProcessing ? (<motion.div animate={reduced ? undefined : { rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="size-5 rounded-full border-2 border-white/30 border-t-white" />) : (<>Place order <ArrowRight size={18} /></>)}</Button>{paymentMethod === "card" && (<p className="mt-2 text-center text-xs text-muted-foreground">Card payments coming soon</p>)}</Card></div>
        </div>
      </div>
    </AppShell>
  );
}
