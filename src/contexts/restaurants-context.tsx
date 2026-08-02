import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { restaurantService } from "@/services/payplate-api";
import type { Restaurant } from "@/types/payplate";

type RestaurantsState = {
  restaurants: Restaurant[];
  isLoading: boolean;
  error: string | null;
  search: (query: string) => Promise<Restaurant[]>;
  getById: (id: string) => Promise<Restaurant | null>;
  filterByCategory: (category: string) => Promise<Restaurant[]>;
  retry: () => void;
};

const RestaurantsContext = createContext<RestaurantsState | undefined>(undefined);

export function RestaurantsProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setIsLoading(true);
    setError(null);
    restaurantService.getAll().then((data) => {
      setRestaurants(data);
      setIsLoading(false);
    }).catch(() => {
      setError("Failed to load restaurants. Please try again.");
      setIsLoading(false);
    });
  }

  useEffect(() => { load(); }, []);

  const value = useMemo<RestaurantsState>(
    () => ({
      restaurants,
      isLoading,
      error,
      async search(query) { return restaurantService.search(query); },
      async getById(id) { return restaurantService.getById(id); },
      async filterByCategory(category) { return restaurantService.getByCategory(category); },
      retry() { load(); },
    }),
    [restaurants, isLoading, error],
  );

  return <RestaurantsContext.Provider value={value}>{children}</RestaurantsContext.Provider>;
}

export function useRestaurants() {
  const ctx = useContext(RestaurantsContext);
  if (!ctx) throw new Error("useRestaurants must be used within RestaurantsProvider");
  return ctx;
}
