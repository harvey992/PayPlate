import { Plus, Minus, Clock, Flame, Star, Heart } from "lucide-react";
import type { MenuItem } from "@/types/payplate";
import { formatRand } from "@/services/payplate-data";
import { Badge } from "@/components/ui/badge";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/contexts/toast-context";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const reduced = usePrefersReducedMotion();
  const { addItem, getQuantity, updateQuantity } = useCart();
  const { showToast } = useToast();
  const [isFav, setIsFav] = useState(false);
  const quantity = getQuantity(item.id);

  function handleAdd() {
    addItem(item);
    showToast(`${item.name} added to cart`, "success");
  }

  return (
    <motion.div
      whileHover={!reduced ? { y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="h-full"
    >
      <div className="flex h-full gap-3 rounded-2xl border border-border bg-card p-3 shadow-card transition-shadow duration-300 hover:shadow-lift">
        {/* Image */}
        <div className="relative shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="size-24 rounded-xl object-cover"
            loading="lazy"
          />
          {item.isPopular && (
            <div className="absolute -left-1 -top-1 flex items-center gap-0.5 rounded-full bg-card px-1.5 py-0.5 shadow-soft ring-1 ring-border">
              <Flame size={10} className="text-warning" />
              <span className="text-[9px] font-black">Popular</span>
            </div>
          )}
          <button
            onClick={() => setIsFav(!isFav)}
            aria-label={`Favourite ${item.name}`}
            className="absolute bottom-1 right-1 grid size-6 place-items-center rounded-full bg-card/90 backdrop-blur-sm shadow-soft"
          >
            <Heart size={12} className={cn("transition-colors", isFav ? "fill-danger text-danger" : "text-muted-foreground")} />
          </button>
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-1">
              <h3 className="truncate font-heading text-sm font-black leading-tight">{item.name}</h3>
              {item.rating && (
                <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-bold text-rewards">
                  <Star size={11} fill="currentColor" /> {item.rating}
                </span>
              )}
            </div>
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-0.5"><Clock size={10} /> {item.prepTimeMinutes}min</span>
              {item.calories && <span>· {item.calories} cal</span>}
              {item.dietaryTags.slice(0, 1).map((tag) => (
                <Badge key={tag} className="text-[9px] px-1.5 py-0">{tag}</Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <p className="font-heading text-base font-black tabular-nums">{formatRand(item.priceCents)}</p>
            {quantity > 0 ? (
              <motion.div
                initial={reduced ? undefined : { scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1.5"
              >
                <button
                  onClick={() => updateQuantity(item.id, quantity - 1)}
                  className="grid size-8 place-items-center rounded-xl bg-muted transition-transform active:scale-90"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="min-w-5 text-center font-heading text-sm font-black tabular-nums">{quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, quantity + 1)}
                  className="grid size-8 place-items-center rounded-xl bg-primary text-white shadow-lift transition-transform active:scale-90"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                whileTap={!reduced ? { scale: 0.9 } : undefined}
                onClick={handleAdd}
                aria-label={`Add ${item.name} to cart`}
                className="grid size-9 place-items-center rounded-xl bg-primary text-white shadow-lift transition-transform duration-200 hover:-translate-y-0.5 active:scale-90"
              >
                <Plus size={18} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
