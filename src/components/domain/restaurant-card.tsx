import { Link } from "@/lib/router-compat";
import { Star, Clock, MapPin, Heart } from "lucide-react";
import type { Restaurant } from "@/types/payplate";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const reduced = usePrefersReducedMotion();
  const [isFav, setIsFav] = useState(false);

  return (
    <motion.div
      whileHover={!reduced ? { y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="h-full"
    >
      <Link
        to={`/restaurants/${restaurant.id}`}
        aria-label={`View ${restaurant.name}`}
        className="block h-full overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-lift"
      >
        {/* Hero image */}
        <div className="relative h-36 overflow-hidden">
          <img
            src={restaurant.heroImage}
            alt={`${restaurant.name} food`}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/25 to-transparent" />

          {/* Top badges */}
          <div className="absolute left-2.5 top-2.5 flex gap-1.5">
            {(restaurant.studentDiscountPercent ?? 0) > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-black text-white shadow-soft">
                {restaurant.studentDiscountPercent}% student
              </span>
            )}
            {restaurant.tags?.includes("Popular") && (
              <span className="rounded-full bg-rewards px-2 py-0.5 text-[10px] font-black text-white shadow-soft">
                Popular
              </span>
            )}
          </div>

          {/* Favourite heart */}
          <button
            onClick={(e) => { e.preventDefault(); setIsFav(!isFav); }}
            aria-label={`Favourite ${restaurant.name}`}
            className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full bg-white/90 backdrop-blur-sm shadow-soft transition-transform active:scale-90"
          >
            <Heart size={15} className={cn("transition-colors", isFav ? "fill-danger text-danger" : "text-muted-foreground")} />
          </button>

          {/* Closed overlay */}
          {!restaurant.isOpen && (
            <div className="absolute inset-0 flex items-center justify-center bg-dark/50 backdrop-blur-[2px]">
              <span className="rounded-full bg-dark/80 px-4 py-1.5 text-sm font-black text-white">Closed</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1.5 p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-heading text-base font-black">{restaurant.name}</h3>
            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-black text-primary">
              <Star size={11} fill="currentColor" />
              {restaurant.rating}
            </span>
          </div>

          <p className="truncate text-xs text-muted-foreground">{restaurant.cuisine}</p>

          {/* Meta row */}
          <div className="flex items-center gap-3 pt-1 text-xs font-bold">
            <span className={cn("inline-flex items-center gap-1", restaurant.isOpen ? "text-primary" : "text-muted-foreground")}>
              <Clock size={13} /> {restaurant.etaMinutes} min
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <MapPin size={13} /> {restaurant.distance}
            </span>
          </div>

          {/* Status tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-bold",
              restaurant.isOpen
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger",
            )}>
              {restaurant.isOpen ? "Open" : "Closed"}
            </span>
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
              Pickup
            </span>
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
              Delivery
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
