import { Star } from "lucide-react";
import type { Restaurant } from "@/types/payplate";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      whileHover={!reduced ? { y: -6, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
    >
      <Card className="overflow-hidden p-0 transition-transform duration-300">
        <div className="relative h-44">
          <img
            src={restaurant.heroImage}
            alt={`${restaurant.name} food`}
            className="h-full w-full object-cover object-center transition-transform duration-300"
            loading="lazy"
          />
          <Badge className="absolute left-3 top-3">{restaurant.discountLabel}</Badge>
        </div>

        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-heading text-lg font-black">{restaurant.name}</h3>
              <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
            </div>

            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-black text-primary">
              <Star size={13} fill="currentColor" />
              {restaurant.rating}
            </span>
          </div>

          <p className="text-sm font-bold text-primary">
            {restaurant.etaMinutes} min · {restaurant.distance}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
