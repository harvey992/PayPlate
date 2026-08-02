import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@/lib/router-compat";
import { motion } from "framer-motion";
import { Star, Clock, MapPin, ArrowLeft, Heart, Plus, Minus, Flame, CircleCheck as CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import { useRestaurants } from "@/contexts/restaurants-context";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/contexts/toast-context";
import { useAuth } from "@/contexts/auth-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatRand } from "@/services/payplate-data";
import type { Restaurant, MenuItem } from "@/types/payplate";
import { cn } from "@/lib/utils";

export function RestaurantDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById } = useRestaurants();
  const { addItem, getQuantity, updateQuantity } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const reduced = usePrefersReducedMotion();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getById(id).then((r) => { setRestaurant(r); setIsLoading(false); if (r) setActiveCategory(r.categories[0] ?? "All"); });
  }, [id, getById]);

  function toggleFavorite(itemId: string) {
    setFavorites((prev) => { const next = new Set(prev); if (next.has(itemId)) next.delete(itemId); else next.add(itemId); return next; });
  }

  function handleAdd(item: MenuItem) { addItem(item); showToast(`${item.name} added to cart`, "success"); }

  if (isLoading) { return (<AppShell><Skeleton className="h-64 w-full" /><div className="mt-6 space-y-4"><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /></div></AppShell>); }
  if (!restaurant) { return (<AppShell><EmptyState icon={<span className="text-3xl">404</span>} title="Restaurant not found" description="This restaurant may have closed or moved." action={<Button onClick={() => navigate("/restaurants")}>Browse restaurants</Button>} /></AppShell>); }

  const menuItems = activeCategory === "All" ? restaurant.menuItems : restaurant.menuItems.filter((m) => m.category === activeCategory);

  return (
    <AppShell>
      <div className="space-y-6">
        <Breadcrumb items={[{ title: "Restaurants", to: "/restaurants" }, { title: restaurant.name }]} />
        {/* Hero */}
        <motion.div initial={reduced ? undefined : { opacity: 0 }} animate={{ opacity: 1 }} className="relative overflow-hidden rounded-3xl">
          <img src={restaurant.heroImage} alt={restaurant.name} className="h-56 w-full object-cover sm:h-72" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-start justify-between gap-4"><div><h1 className="font-heading text-2xl font-black lg:text-3xl">{restaurant.name}</h1><p className="mt-1 text-white/80">{restaurant.cuisine}</p></div>{restaurant.studentDiscountPercent ? <Badge className="bg-primary text-white">{restaurant.studentDiscountPercent}% student</Badge> : null}</div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm"><span className="inline-flex items-center gap-1.5"><Star size={16} fill="currentColor" className="text-rewards" />{restaurant.rating} ({restaurant.reviewCount})</span><span className="inline-flex items-center gap-1.5"><Clock size={16} /> {restaurant.etaMinutes} min</span><span className="inline-flex items-center gap-1.5"><MapPin size={16} /> {restaurant.distance}</span><span className={cn("inline-flex items-center gap-1.5 font-bold", restaurant.isOpen ? "text-success" : "text-danger")}>{restaurant.isOpen ? "Open now" : "Closed"}</span></div>
          </div>
        </motion.div>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Menu */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 z-10 mb-4 -mx-1 flex gap-2 overflow-x-auto bg-background/80 px-1 py-2 backdrop-blur-sm">{restaurant.categories.map((cat) => (<button key={cat} onClick={() => setActiveCategory(cat)} className={cn("whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-all", activeCategory === cat ? "bg-primary text-white shadow-lift" : "bg-card text-muted-foreground ring-1 ring-border hover:text-text")}>{cat}</button>))}</div>
            <div className="space-y-3">{menuItems.map((item, i) => { const qty = getQuantity(item.id); const isFav = favorites.has(item.id); return (<motion.div key={item.id} initial={reduced ? undefined : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}><Card className="grid grid-cols-[110px_1fr] gap-4 p-3"><img src={item.image} alt={item.name} className="aspect-square h-full w-full rounded-2xl object-cover" loading="lazy" /><div className="flex min-w-0 flex-col justify-between py-1"><div className="space-y-1"><div className="flex items-start justify-between gap-2"><h3 className="truncate font-heading text-lg font-black">{item.name}</h3><button onClick={() => toggleFavorite(item.id)} aria-label={`Favourite ${item.name}`} className="grid size-8 place-items-center rounded-xl transition-colors hover:bg-muted"><Heart size={18} className={cn("transition-colors", isFav ? "fill-danger text-danger" : "text-muted-foreground")} /></button></div><p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p><div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><Clock size={12} /> {item.prepTimeMinutes} min</span>{item.calories && <span>{item.calories} cal</span>}{item.isPopular && <Badge variant="warning"><Flame size={10} /> Popular</Badge>}{item.rating && <span className="inline-flex items-center gap-1"><Star size={12} fill="currentColor" className="text-rewards" /> {item.rating}</span>}</div></div><div className="flex items-center justify-between"><p className="font-heading text-lg font-black">{formatRand(item.priceCents)}</p>{qty > 0 ? (<div className="flex items-center gap-2"><button onClick={() => updateQuantity(item.id, qty - 1)} className="grid size-9 place-items-center rounded-xl bg-muted text-text" aria-label="Decrease quantity"><Minus size={16} /></button><span className="min-w-6 text-center font-heading font-black tabular-nums">{qty}</span><button onClick={() => updateQuantity(item.id, qty + 1)} className="grid size-9 place-items-center rounded-xl bg-primary text-white shadow-lift" aria-label="Increase quantity"><Plus size={16} /></button></div>) : (<Button onClick={() => handleAdd(item)} className="px-4 py-2 text-sm"><Plus size={16} /> Add</Button>)}</div></div></Card></motion.div>); })}</div>
          </div>
          {/* Sidebar: hours + reviews */}
          <div className="space-y-6">
            <Card><h3 className="font-heading font-black">Opening hours</h3><div className="mt-3 space-y-2">{restaurant.openingHours.map((h) => (<div key={h.day} className="flex justify-between text-sm"><span className="text-muted-foreground">{h.day}</span><span className="font-bold">{h.hours}</span></div>))}</div></Card>
            {restaurant.studentDiscountPercent ? (<Card className="bg-primary/5"><div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-primary" /><h3 className="font-heading font-black">Student discount</h3></div><p className="mt-2 text-sm text-muted-foreground">{user?.verificationStatus === "verified" ? `You get ${restaurant.studentDiscountPercent}% off your entire order.` : `Get ${restaurant.studentDiscountPercent}% off when you verify your student status.`}</p>{user?.verificationStatus !== "verified" && (<Button variant="secondary" className="mt-3 w-full" onClick={() => navigate("/profile")}>Verify student status</Button>)}</Card>) : null}
            <Card><h3 className="font-heading font-black">Reviews ({restaurant.reviews.length})</h3><div className="mt-3 space-y-4">{restaurant.reviews.map((rev) => (<div key={rev.id} className="border-b border-border pb-3 last:border-0 last:pb-0"><div className="flex items-center justify-between"><p className="font-bold text-sm">{rev.authorName}</p><span className="inline-flex items-center gap-1 text-xs font-bold text-rewards"><Star size={12} fill="currentColor" /> {rev.rating}</span></div><p className="mt-1 text-sm text-muted-foreground">{rev.comment}</p></div>))}</div></Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
