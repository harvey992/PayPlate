import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { MenuItem } from "@/types/payplate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export function MenuItemCard({ item, onAdd }: { item: MenuItem; onAdd?: () => void }) {
  const reduced = usePrefersReducedMotion();

  return (
    <Card className="group relative overflow-hidden p-0">
      <div className="relative h-40 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className={cn("h-full w-full object-cover transition-transform duration-300", !reduced && "group-hover:scale-105")}
          loading="lazy"
        />
        {item.isPopular && (
          <Badge variant="warning" className="absolute left-2 top-2">
            Popular
          </Badge>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{item.name}</h3>
          <span className="shrink-0 font-bold text-primary">R{(item.priceCents / 100).toFixed(2)}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {item.dietaryTags?.map((tag) => (
              <Badge key={tag} variant="default" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <Button onClick={onAdd} className="h-8 min-h-0 w-8 rounded-full p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
