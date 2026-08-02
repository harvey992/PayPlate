import { Card } from "@/components/ui/card";
import type { MenuItem } from "@/types/payplate";
import { MenuItemCard } from "./menu-item-card";

export function OrderCard({ items }: { items: MenuItem[] }) {
  const total = items.reduce((s, i) => s + i.priceCents, 0);
  return (
    <Card>
      <h3 className="font-heading text-lg font-black">Order summary</h3>
      <div className="mt-4 space-y-3">
        {items.map((it) => (
          <MenuItemCard key={it.id} item={it} />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="font-bold">Total</p>
        <p className="font-heading font-black">{new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(total / 100)}</p>
      </div>
    </Card>
  );
}
