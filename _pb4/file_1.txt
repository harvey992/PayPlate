import { useNavigate } from "@/lib/router-compat";
import { motion } from "framer-motion";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, GraduationCap } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { useCart } from "@/contexts/cart-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatRand } from "@/services/payplate-data";
import { useState } from "react";

export function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, subtotalCents, studentDiscountCents, deliveryFeeCents, totalCents, itemCount } = useCart();
  const reduced = usePrefersReducedMotion();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  function applyPromo() {
    if (!promoCode.trim()) return;
    if (promoCode.toUpperCase() === "STUDENT10") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code. Try STUDENT10.");
      setPromoApplied(false);
    }
  }

  if (items.length === 0) {
    return (
      <AppShell>
        <EmptyState
          icon={<ShoppingBag size={32} />}
          title="Your cart is empty"
          description="Browse restaurants and add meals to get started."
          action={<Button onClick={() => navigate("/restaurants")}>Browse restaurants</Button>}
        />
      </AppShell>
    );
  }

  const promoDiscount = promoApplied ? Math.round(subtotalCents * 0.1) : 0;
  const finalTotal = totalCents - promoDiscount;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-black lg:text-3xl">Your cart</h1>
          <p className="mt-1 text-sm text-muted-foreground">{itemCount} item{itemCount > 1 ? "s" : ""}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Items */}
          <div className="space-y-3 lg:col-span-2">
            {items.map((ci, i) => (
              <motion.div
                key={ci.item.id}
                initial={reduced ? undefined : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="grid grid-cols-[80px_1fr_auto] items-center gap-4 p-3">
                  <img src={ci.item.image} alt={ci.item.name} className="aspect-square w-full rounded-xl object-cover" />
                  <div className="min-w-0">
                    <h3 className="truncate font-heading font-black">{ci.item.name}</h3>
                    <p className="text-sm text-muted-foreground">{formatRand(ci.item.priceCents)} each</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(ci.item.id, ci.quantity - 1)}
                        className="grid size-8 place-items-center rounded-lg bg-muted"
                        aria-label="Decrease"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-6 text-center font-heading font-black tabular-nums">{ci.quantity}</span>
                      <button
                        onClick={() => updateQuantity(ci.item.id, ci.quantity + 1)}
                        className="grid size-8 place-items-center rounded-lg bg-primary text-white"
                        aria-label="Increase"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-heading font-black tabular-nums">{formatRand(ci.item.priceCents * ci.quantity)}</p>
                    <button
                      onClick={() => removeItem(ci.item.id)}
                      className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <Card>
              <h3 className="font-heading text-lg font-black">Order summary</h3>

              {/* Promo code */}
              <div className="mt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    icon={<Tag size={16} />}
                  />
                  <Button variant="secondary" onClick={applyPromo} className="whitespace-nowrap">Apply</Button>
                </div>
                {promoError && <p className="mt-2 text-xs font-bold text-danger">{promoError}</p>}
                {promoApplied && <p className="mt-2 text-xs font-bold text-success">10% promo applied!</p>}
              </div>

              <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold tabular-nums">{formatRand(subtotalCents)}</span>
                </div>
                <div className="flex justify-between text-success">
                  <span className="inline-flex items-center gap-1"><GraduationCap size={14} /> Student discount (15%)</span>
                  <span className="font-bold tabular-nums">−{formatRand(studentDiscountCents)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-success">
                    <span>Promo (STUDENT10)</span>
                    <span className="font-bold tabular-nums">−{formatRand(promoDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery fee</span>
                  <span className="font-bold tabular-nums">{formatRand(deliveryFeeCents)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="font-heading text-lg font-black">Total</span>
                <motion.span
                  key={finalTotal}
                  initial={reduced ? undefined : { scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="font-heading text-2xl font-black text-primary tabular-nums"
                >
                  {formatRand(finalTotal)}
                </motion.span>
              </div>

              <Button className="mt-4 w-full" onClick={() => navigate("/checkout")}>
                Proceed to checkout <ArrowRight size={18} />
              </Button>
            </Card>

            <p className="text-center text-xs text-muted-foreground">
              You're saving {formatRand(studentDiscountCents + promoDiscount)} with student discounts
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
