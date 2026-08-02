import { Link } from "react-router-dom";
import { Star, Clock, MapPin, Heart, Truck, Store } from "lucide-react";
import type { Restaurant } from "@/types/payplate";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const reduced = usePrefersReducedMotion();
  const [isFav, setIsFav] = useState(false);

  return (
    <motion.div
      whileHover={!reduced ? { y: -6, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
    >
      <Link to={`/restaurants/${restaurant.id}`}>
        <Card className="overflow-hidden p-0 transition-shadow duration-300 hover:shadow-lift">
          <div className="relative h-40 overflow-hidden">
            <img
              src={restaurant.heroImage}
              alt={`${restaurant.name} food`}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <Badge className="absolute left-3 top-3 bg-primary text-white">{restaurant.discountLabel}</Badge>
            <button
              onClick={(e) => { e.preventDefault(); setIsFav(!isFav); }}
              aria-label={`Favourite ${restaurant.name}`}
              className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-black/40 backdrop-blur-sm"
            >
              <Heart size={14} className={cn("transition-colors", isFav ? "fill-danger text-danger" : "text-white")} />
            </button>
          </div>

          <div className="space-y-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate font-heading text-base font-black">{restaurant.name}</h3>
                <p className="truncate text-sm text-muted-foreground">{restaurant.cuisine}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-black text-primary">
                <Star size={13} fill="currentColor" />
                {restaurant.rating}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
              <span className={cn("inline-flex items-center gap-1", restaurant.isOpen ? "text-success" : "text-danger")}>
                <span className={cn("size-1.5 rounded-full", restaurant.isOpen ? "bg-success" : "bg-danger")} />
                {restaurant.isOpen ? "Open" : "Closed"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={13} /> {restaurant.etaMinutes} min
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={13} /> {restaurant.distance}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {restaurant.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-border px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                  {tag}
                </span>
              ))}
              <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                <Store size={10} /> Pickup
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                <Truck size={10} /> Delivery
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
