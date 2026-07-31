import type { MenuItem } from "@/types/payplate";
import { MenuItemCard } from "./menu-item-card";

export function FoodCard({ item }: { item: MenuItem }) {
  // Reuse existing MenuItemCard to avoid duplication
  return <MenuItemCard item={item} />;
}
