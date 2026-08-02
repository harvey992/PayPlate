import { createContext, useContext, useState, type ReactNode } from "react";
import { restaurants as seedRestaurants } from "@/services/payplate-data";
import type { Restaurant } from "@/types/payplate";

type RestaurantsContextValue = {
  restaurants: Restaurant[];
  isLoading: boolean;
  getById: (id: string) => Promise<Restaurant | null>;
  search: (query: string) => Restaurant[];
  getByCategory: (category: string) => Restaurant[];
};

const RestaurantsContext = createContext<RestaurantsContextValue | undefined>(undefined);

export function RestaurantsProvider({ children }: { children: ReactNode }) {
  const [restaurants] = useState<Restaurant[]>(seedRestaurants);

  async function getById(id: string): Promise<Restaurant | null> {
    return restaurants.find((r) => r.id === id) ?? null;
  }

  function search(query: string) {
    const q = query.toLowerCase();
    return restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.categories.some((c) => c.toLowerCase().includes(q)),
    );
  }

  function getByCategory(category: string) {
    if (category === "All") return restaurants;
    return restaurants.filter((r) => r.categories.some((c) => c.toLowerCase().includes(category.toLowerCase())));
  }

  return (
    <RestaurantsContext.Provider
      value={{ restaurants, isLoading: false, getById, search, getByCategory }}
    >
      {children}
    </RestaurantsContext.Provider>
  );
}

export function useRestaurants() {
  const ctx = useContext(RestaurantsContext);
  if (!ctx) throw new Error("useRestaurants must be used within RestaurantsProvider");
  return ctx;
}
