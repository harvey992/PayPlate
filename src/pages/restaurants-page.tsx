import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ListFilter as Filter, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { RestaurantCard } from "@/components/domain/restaurant-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useRestaurants } from "@/contexts/restaurants-context";

const CATEGORIES = ["All", "Burgers", "Pizza", "Bowls", "Coffee", "Sushi", "Ramen"];

export function RestaurantsPage() {
  const { restaurants, isLoading, search, getByCategory } = useRestaurants();
  const [params] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(params.get("cat") || "All");
  const [query, setQuery] = useState(params.get("q") || "");

  useEffect(() => {
    const cat = params.get("cat");
    const q = params.get("q");
    if (cat) setActiveCategory(cat);
    if (q) setQuery(q);
  }, [params]);

  let filtered = activeCategory === "All" ? restaurants : getByCategory(activeCategory);
  if (query) filtered = search(query);

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="font-heading text-2xl font-black">Restaurants</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} places near you</p>
        </div>

        <label className="flex items-center gap-2.5 rounded-2xl bg-card px-4 py-3 ring-1 ring-border shadow-card focus-within:ring-primary/40">
          <Filter size={17} className="text-muted-foreground" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search restaurants..." className="flex-1 bg-transparent text-sm font-medium outline-none" />
        </label>

        <div className="scroll-snap-x">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-2xl px-4 py-2 text-sm font-black whitespace-nowrap transition-all ${activeCategory === cat ? "bg-primary text-white shadow-lift" : "bg-card text-muted-foreground ring-1 ring-border"}`}>
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<SlidersHorizontal size={28} />} title="No restaurants found" description="Try a different search or category." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        )}
      </div>
    </AppShell>
  );
}
