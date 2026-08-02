import type { MenuItem } from "@/types/payplate";
import { MenuItemCard } from "./menu-item-card";

export function FoodCard({ item }: { item: MenuItem }) {
  return <MenuItemCard item={item} />;
}
