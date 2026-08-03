import { Link, useNavigate } from "@/lib/router-compat";
import { Search, Moon, Sun, Code, ShoppingBag, MapPin, Bell } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { useWallet } from "@/contexts/wallet-context";
import { useOrders } from "@/contexts/orders-context";
import { buildNotifications, countUnread } from "@/lib/notifications";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function TopNavigation() {
  const { theme, toggleTheme, setTheme } = useTheme();
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const { transactions } = useWallet();
  const { orders } = useOrders();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const unreadCount = isAuthenticated ? countUnread(buildNotifications(transactions, orders)) : 0;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchValue.trim()) navigate(`/restaurants?q=${encodeURIComponent(searchValue)}`);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3 lg:px-8">
        <Link to={isAuthenticated ? "/home" : "/"} className="flex shrink-0 items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl bg-primary text-white shadow-lift">
            <span className="font-heading text-sm font-black">P</span>
          </div>
          <span className="hidden font-heading text-lg font-black sm:block">PayPlate</span>
        </Link>

        {isAuthenticated && (
          <form onSubmit={handleSearch} className="hidden flex-1 max-w-md sm:block">
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search restaurants, meals…"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-11 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                aria-label="Search"
              />
            </div>
          </form>
        )}

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <>
              <Link
                to="/notifications"
                className="relative grid size-11 place-items-center rounded-2xl border border-border bg-card shadow-sm"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-danger ring-2 ring-card" />
                )}
              </Link>

              <Link
                to="/cart"
                className="relative grid size-11 place-items-center rounded-2xl border border-border bg-card shadow-sm"
                aria-label={`Cart with ${itemCount} items`}
              >
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-black text-white">
                    {itemCount}
                  </span>
                )}
              </Link>
            </>
          )}

          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="grid size-11 place-items-center rounded-2xl border border-border bg-card shadow-sm transition-transform hover:-translate-y-0.5"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            aria-label="Developer theme"
            title="Toggle developer theme"
            onClick={() => setTheme(theme === "dev" ? "light" : "dev")}
            className="hidden size-11 place-items-center rounded-2xl border border-border bg-card shadow-sm transition-transform hover:-translate-y-0.5 lg:grid"
          >
            <Code size={16} />
          </button>

          {isAuthenticated ? (
            <Link
              to="/profile"
              className="grid size-11 place-items-center rounded-2xl border border-border bg-card font-bold shadow-sm transition-transform hover:-translate-y-0.5"
              aria-label="Profile"
            >
              <span className="text-sm">Me</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className={cn(
                "inline-flex h-11 items-center rounded-2xl bg-primary px-4 text-sm font-extrabold text-white shadow-lift transition-transform hover:-translate-y-0.5",
              )}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
