import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, Bell, MapPin, Flame, ArrowRight, Star,
  ChevronRight, RotateCcw, Tag, Clock, QrCode, ScanLine,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RestaurantCard } from "@/components/domain/restaurant-card";
import { MenuItemCard } from "@/components/domain/menu-item-card";
import { useAuth } from "@/contexts/auth-context";
import { useWallet } from "@/contexts/wallet-context";
import { useRestaurants } from "@/contexts/restaurants-context";
import { useOrders } from "@/contexts/orders-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { allMenuItems, offers, formatRand } from "@/services/payplate-data";
import type { MenuItem, Offer } from "@/types/payplate";
import { useState } from "react";

const CATEGORIES = [
  { emoji: "🍽️", label: "All" },
  { emoji: "🍔", label: "Burgers" },
  { emoji: "🍕", label: "Pizza" },
  { emoji: "🥗", label: "Bowls" },
  { emoji: "☕", label: "Coffee" },
  { emoji: "🍣", label: "Sushi" },
  { emoji: "🍜", label: "Ramen" },
];

export function Dashboard() {
  const { user } = useAuth();
  const { balanceCents, rewardPoints, tier } = useWallet();
  const { restaurants, isLoading } = useRestaurants();
  const { orders } = useOrders();
  const reduced = usePrefersReducedMotion();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [popularMeals] = useState<MenuItem[]>(allMenuItems.filter((m) => m.isPopular));
  const [studentOffers] = useState<Offer[]>(offers.filter((o) => o.isStudentExclusive));

  const firstName = user ? user.fullName.split(" ")[0] : "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const lastOrder = orders[0];
  const nearby = [...restaurants].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/restaurants?q=${encodeURIComponent(searchQuery)}`);
  }

  return (
    <AppShell>
      <div className="space-y-5">
        {/* Header */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between gap-3"
        >
          <div>
            <button
              onClick={() => navigate("/restaurants")}
              className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground"
            >
              <MapPin size={14} className="text-primary" />
              {user?.university || "University of Cape Town"}
              <ChevronRight size={14} />
            </button>
            <h1 className="mt-0.5 font-heading text-xl font-black">{greeting}, {firstName}</h1>
          </div>
          <Link to="/notifications" className="relative grid size-10 shrink-0 place-items-center rounded-2xl bg-card ring-1 ring-border shadow-card">
            <Bell size={18} />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
          </Link>
        </motion.div>

        {/* Search */}
        <motion.form onSubmit={handleSearch} initial={reduced ? undefined : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <label className="flex items-center gap-2.5 rounded-2xl bg-card px-4 py-3 ring-1 ring-border shadow-card focus-within:ring-primary/40">
            <Search size={17} className="shrink-0 text-muted-foreground" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search food, restaurants..." className="flex-1 bg-transparent text-sm font-medium text-text placeholder:text-muted-foreground outline-none" />
          </label>
        </motion.form>

        {/* Category chips */}
        <div className="scroll-snap-x">
          {CATEGORIES.map((cat) => (
            <button key={cat.label} onClick={() => { setActiveCategory(cat.label); navigate(`/restaurants?cat=${cat.label}`); }}
              className={`flex shrink-0 items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-black whitespace-nowrap transition-all ${activeCategory === cat.label ? "bg-primary text-white shadow-lift" : "bg-card text-muted-foreground ring-1 ring-border"}`}>
              <span>{cat.emoji}</span>{cat.label}
            </button>
          ))}
        </div>

        {/* Wallet card */}
        <motion.div initial={reduced ? undefined : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} whileHover={!reduced ? { scale: 1.01 } : undefined}>
          <Link to="/wallet">
            <div className="relative overflow-hidden rounded-[1.75rem] p-5 text-white shadow-lift" style={{ background: "linear-gradient(135deg,#00D27A 0%,#008A50 60%,#050505 100%)" }}>
              <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-6 size-36 rounded-full bg-accent/15 blur-2xl" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-white/65">PayPlate Wallet</p>
                  <p className="mt-1 font-heading text-3xl font-black tabular-nums">{formatRand(balanceCents)}</p>
                  <p className="mt-0.5 text-[11px] text-white/60">Available Balance</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold">
                    <span className="text-xs">🏆</span> {rewardPoints} pts · <span className="capitalize">{tier}</span> tier
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="grid size-12 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm">
                    <ChevronRight size={22} />
                  </div>
                  <button onClick={(e) => { e.preventDefault(); navigate("/wallet"); }} className="rounded-xl bg-white/20 px-3 py-1.5 text-xs font-black backdrop-blur-sm hover:bg-white/30">Top up</button>
                </div>
              </div>
              <div className="relative mt-4">
                <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
                  <motion.div initial={reduced ? undefined : { width: 0 }} animate={{ width: `${Math.min((rewardPoints / 2000) * 100, 100)}%` }} transition={{ duration: 0.8, delay: 0.3 }} className="h-full rounded-full bg-white" />
                </div>
                <p className="mt-1.5 text-[10px] font-bold text-white/50">{Math.max(0, 2000 - rewardPoints)} pts to Diamond</p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: <ScanLine size={20} />, label: "Scan", to: "/wallet" },
            { icon: <ArrowRight size={20} />, label: "Send", to: "/wallet" },
            { icon: <QrCode size={20} />, label: "Request", to: "/wallet" },
            { icon: <Clock size={20} />, label: "History", to: "/wallet" },
          ].map((a) => (
            <Link key={a.label} to={a.to}>
              <div className="flex flex-col items-center gap-1.5">
                <div className="grid size-14 place-items-center rounded-2xl bg-card ring-1 ring-border shadow-card transition-transform active:scale-90">{a.icon}</div>
                <span className="text-xs font-bold">{a.label}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Today's deals */}
        {studentOffers.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-heading text-base font-black">Today's deals <span className="text-base">🔥</span></h2>
              <Link to="/restaurants" className="inline-flex items-center gap-1 text-sm font-bold text-primary">See all <ArrowRight size={13} /></Link>
            </div>
            <div className="scroll-snap-x">
              {studentOffers.map((offer) => (
                <div key={offer.id} onClick={() => navigate("/restaurants")} className="w-72 shrink-0 cursor-pointer overflow-hidden rounded-2xl shadow-card transition-shadow hover:shadow-lift" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
                  <div className="flex items-center gap-3 p-3">
                    <img src={offer.image} alt={offer.title} className="h-20 w-24 shrink-0 rounded-xl object-cover" loading="lazy" />
                    <div className="min-w-0">
                      <span className="inline-block rounded-full bg-primary px-2 py-0.5 text-[10px] font-black text-white">{offer.discountPercent}% OFF</span>
                      <p className="mt-1 font-heading text-sm font-black leading-tight">{offer.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{offer.restaurantName}</p>
                      <button className="mt-2 rounded-xl bg-primary px-3 py-1.5 text-xs font-black text-white shadow-lift transition-transform active:scale-95">View deal</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trending now */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <h2 className="font-heading text-base font-black">Trending now <span className="text-base">✨</span></h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {popularMeals.slice(0, 4).map((item, i) => (
              <motion.div key={item.id} initial={reduced ? undefined : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <TrendingCard item={item} onClick={() => navigate(`/restaurants/${item.restaurantId}`)} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Reorder */}
        {lastOrder && (
          <section>
            <div className="mb-3 flex items-center gap-2">
              <RotateCcw size={16} className="text-primary" />
              <h2 className="font-heading text-base font-black">Continue your order</h2>
            </div>
            <Card className="flex items-center gap-3 p-3">
              <div className="size-16 shrink-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10" />
              <div className="flex-1 min-w-0">
                <h3 className="truncate font-heading font-black">{lastOrder.restaurantName}</h3>
                <p className="truncate text-sm text-muted-foreground">{lastOrder.items.length} items · {formatRand(lastOrder.totalCents)}</p>
              </div>
              <button onClick={() => navigate(`/restaurants/${lastOrder.restaurantId}`)} className="shrink-0 rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-white shadow-lift transition-transform active:scale-95">Reorder</button>
            </Card>
          </section>
        )}

        {/* Near you */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2"><MapPin size={16} className="text-primary" /><h2 className="font-heading text-base font-black">Near you</h2></div>
            <Link to="/restaurants" className="inline-flex items-center gap-1 text-sm font-bold text-primary">See all <ArrowRight size={13} /></Link>
          </div>
          {isLoading ? (
            <div className="scroll-snap-x">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-56 w-64 shrink-0 rounded-2xl" />)}</div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {nearby.slice(0, 4).map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
            </div>
          )}
        </section>

        {/* Student discounts */}
        <section>
          <div className="mb-3 flex items-center gap-2"><Tag size={16} className="text-primary" /><h2 className="font-heading text-base font-black">Student discounts</h2></div>
          {isLoading ? (
            <div className="scroll-snap-x">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-56 w-64 shrink-0 rounded-2xl" />)}</div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {restaurants.filter((r) => (r.studentDiscountPercent ?? 0) > 0).slice(0, 4).map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function TrendingCard({ item, onClick }: { item: MenuItem; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group w-full overflow-hidden rounded-2xl text-left shadow-card transition-shadow hover:shadow-lift" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {item.isPopular && <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-black text-white"><Flame size={10} className="mr-0.5 inline" />Popular</span>}
      </div>
      <div className="p-2.5">
        <h3 className="truncate font-heading text-sm font-black">{item.name}</h3>
        <div className="mt-0.5 flex items-center justify-between">
          <p className="font-heading text-sm font-black text-primary tabular-nums">{formatRand(item.priceCents)}</p>
          {item.rating && <span className="inline-flex items-center gap-0.5 text-xs font-bold text-rewards"><Star size={11} fill="currentColor" /> {item.rating}</span>}
        </div>
      </div>
    </button>
  );
}
