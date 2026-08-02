import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatRand } from "@/services/payplate-data";

export function CartPage() {
  const { items, totalCents, itemCount, updateQuantity, removeItem, clear } = useCart();
  const { user } = useAuth();
  const reduced = usePrefersReducedMotion();
  const navigate = useNavigate();

  const studentDiscount = user?.verificationStatus === "verified" ? Math.round(totalCents * 0.15) : 0;
  const deliveryFee = totalCents > 0 ? 1000 : 0;
  const finalTotal = totalCents - studentDiscount + deliveryFee;

  if (items.length === 0) {
    return (
      <AppShell>
        <EmptyState icon={<ShoppingBag size={28} />} title="Your cart is empty" description="Browse restaurants and add items to your cart." action={<Link to="/restaurants"><Button>Browse restaurants</Button></Link>} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-black">Cart</h1>
            <p className="mt-1 text-sm text-muted-foreground">{itemCount} items</p>
          </div>
          <button onClick={clear} className="text-sm font-bold text-danger">Clear all</button>
        </div>

        <div className="space-y-3">
          {items.map(({ item, quantity }, i) => (
            <motion.div key={item.id} initial={reduced ? undefined : { opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} exit={{ opacity: 0, x: 20 }}>
              <Card className="flex items-center gap-3 p-3">
                <img src={item.image} alt={item.name} className="size-16 rounded-2xl object-cover" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <h3 className="truncate font-heading text-sm font-black">{item.name}</h3>
                  <p className="font-heading text-sm font-black text-primary">{formatRand(item.priceCents)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, quantity - 1)} className="grid size-8 place-items-center rounded-xl bg-muted" aria-label="Decrease"><Minus size={14} /></button>
                  <span className="min-w-5 text-center font-heading font-black tabular-nums">{quantity}</span>
                  <button onClick={() => updateQuantity(item.id, quantity + 1)} className="grid size-8 place-items-center rounded-xl bg-primary text-white" aria-label="Increase"><Plus size={14} /></button>
                  <button onClick={() => removeItem(item.id)} className="grid size-8 place-items-center rounded-xl text-danger" aria-label="Remove"><Trash2 size={14} /></button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <Card>
          <h3 className="font-heading font-black">Order summary</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-bold">{formatRand(totalCents)}</span></div>
            {studentDiscount > 0 && <div className="flex justify-between text-primary"><span className="inline-flex items-center gap-1"><Tag size={12} /> Student discount (15%)</span><span className="font-bold">-{formatRand(studentDiscount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery fee</span><span className="font-bold">{formatRand(deliveryFee)}</span></div>
            <div className="flex justify-between border-t border-border pt-2"><span className="font-heading font-black">Total</span><span className="font-heading font-black text-primary">{formatRand(finalTotal)}</span></div>
          </div>
          <Button className="mt-4 w-full" onClick={() => navigate("/checkout")}>Proceed to checkout <ArrowRight size={16} /></Button>
        </Card>
      </div>
    </AppShell>
  );
}
