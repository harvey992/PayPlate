import { Star, Clock, MapPin } from "lucide-react";
import type { Restaurant } from "@/types/payplate";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export function RestaurantCard({ restaurant, onClick }: { restaurant: Restaurant; onClick?: () => void }) {
  const reduced = usePrefersReducedMotion();

  return (
    <Card
      className={cn("group cursor-pointer overflow-hidden p-0", onClick && "transition-shadow hover:shadow-lg")}
      onClick={onClick}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={restaurant.heroImage}
          alt={restaurant.name}
          className={cn("h-full w-full object-cover transition-transform duration-300", !reduced && "group-hover:scale-105")}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {!restaurant.isOpen && (
          <Badge variant="danger" className="absolute left-3 top-3">Closed</Badge>
        )}
        {restaurant.discountLabel && (
          <Badge variant="success" className="absolute right-3 top-3">{restaurant.discountLabel}</Badge>
        )}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <h3 className="text-lg font-bold text-white drop-shadow-md">{restaurant.name}</h3>
            <div className="flex items-center gap-2 text-sm text-white/90">
              <Clock className="h-3 w-3" />
              <span>{restaurant.etaMinutes} min</span>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 backdrop-blur-sm">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-dark">{restaurant.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-wrap gap-1">
          <Badge variant="default" className="text-xs">{restaurant.cuisine}</Badge>
          {restaurant.categories.slice(0, 2).map((cat) => (
            <Badge key={cat} variant="default" className="text-xs">
              {cat}
            </Badge>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{restaurant.distance}</span>
          <span>•</span>
          <span>{restaurant.reviewCount} reviews</span>
        </div>
      </div>
    </Card>
  );
}
