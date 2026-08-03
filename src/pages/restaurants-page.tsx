import { useEffect, useState } from "react";
import { useSearchParams } from "@/lib/router-compat";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { RestaurantCard } from "@/components/domain/restaurant-card";
import { useRestaurants } from "@/contexts/restaurants-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { Restaurant } from "@/types/payplate";

const CATEGORIES = ["All", "Burgers", "Pizza", "Bowls", "Coffee", "Sushi", "Ramen"];

export function RestaurantsPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const { restaurants, isLoading, error, search, retry } = useRestaurants();
  const reduced = usePrefersReducedMotion();

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("All");
  const [filtered, setFiltered] = useState<Restaurant[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setFiltered(restaurants);
  }, [restaurants]);

  useEffect(() => {
    if (initialQuery) doSearch(initialQuery);
  }, [initialQuery]);

  async function doSearch(q: string) {
    const results = await search(q);
    setFiltered(results);
  }

  function handleCategory(cat: string) {
    setActiveCategory(cat);
    if (cat === "All") {
      setFiltered(restaurants);
    } else {
      setFiltered(restaurants.filter((r) => r.categories.some((c) => c.toLowerCase().includes(cat.toLowerCase()))));
    }
  }

  function clearFilters() {
    setQuery("");
    setActiveCategory("All");
    setFiltered(restaurants);
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-black lg:text-3xl">Restaurants</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} places to explore</p>
        </div>

        {/* Search + filter toggle */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              icon={<Search size={18} />}
              placeholder="Search restaurants…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") doSearch(query);
              }}
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowFilters((v) => !v)}
            className="px-4"
            aria-label="Toggle filters"
          >
            <SlidersHorizontal size={18} />
          </Button>
        </div>

        {/* Category pills */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap gap-2"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-lift"
                  : "bg-card text-muted-foreground ring-1 ring-border hover:text-text"
              }`}
            >
              {cat}
            </button>
          ))}
          {(activeCategory !== "All" || query) && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-bold text-danger hover:underline"
            >
              <X size={14} /> Clear
            </button>
          )}
        </motion.div>

        {/* Results */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-64" />)}
          </div>
        ) : error ? (
          <EmptyState
            icon={<Search size={32} />}
            title="Something went wrong"
            description={error}
            action={<Button onClick={retry}>Try again</Button>}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Search size={32} />}
            title="No restaurants found"
            description="Try a different search or category."
            action={<Button onClick={clearFilters}>Clear filters</Button>}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r, i) => (
              <motion.div
                key={r.id}
                initial={reduced ? undefined : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <RestaurantCard restaurant={r} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
