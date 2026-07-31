import { Plus } from "lucide-react";
import type { MenuItem } from "@/types/payplate";
import { formatRand } from "@/services/payplate-data";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { motion } from "framer-motion";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      whileHover={!reduced ? { y: -6, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
    >
      <Card className="grid grid-cols-[104px_1fr] gap-4 p-3 transition-transform duration-300">
        <img
          src={item.image}
          alt={item.name}
          className="aspect-square h-full w-full rounded-2xl object-cover object-center transition-transform duration-300"
          loading="lazy"
        />

        <div className="flex min-w-0 flex-col justify-between py-1">
          <div className="space-y-1">
            <div className="flex flex-wrap gap-1">
              {item.dietaryTags.slice(0, 2).map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>

            <h3 className="truncate font-heading text-lg font-black">{item.name}</h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-heading text-lg font-black">{formatRand(item.priceCents)}</p>
            <button
              aria-label={`Add ${item.name}`}
              className="grid size-10 place-items-center rounded-2xl bg-primary text-white shadow-lift transform transition-transform duration-200 hover:-translate-y-0.5"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
