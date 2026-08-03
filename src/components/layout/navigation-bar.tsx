import { NavLink } from "@/lib/router-compat";
import {
  Home, Receipt, Wallet, Star, User, QrCode,
  type LucideIcon,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/home",      label: "Home",    icon: Home    },
  { to: "/orders",   label: "Orders",  icon: Receipt  },
  { to: "/wallet",   label: "Wallet",  icon: Wallet   },
  { to: "/rewards",  label: "Rewards", icon: Star     },
  { to: "/profile",  label: "Profile", icon: User     },
];

const SIDEBAR_ITEMS: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/home",          label: "Home",          icon: Home    },
  { to: "/restaurants",   label: "Restaurants",   icon: Home    },
  { to: "/orders",        label: "Orders",        icon: Receipt },
  { to: "/wallet",        label: "Wallet",        icon: Wallet  },
  { to: "/rewards",       label: "Rewards",       icon: Star    },
  { to: "/cart",          label: "Cart",          icon: Receipt },
  { to: "/profile",       label: "Profile",       icon: User    },
  { to: "/notifications", label: "Notifications", icon: Home    },
  { to: "/settings",      label: "Settings",      icon: Home    },
  { to: "/support",       label: "Support",       icon: Home    },
];

/* ─── Bottom Navigation (mobile) ─── */
export function BottomNav() {
  const { itemCount } = useCart();
  const reduced = usePrefersReducedMotion();

  const left  = NAV_ITEMS.slice(0, 2);   // Home, Orders
  const right = NAV_ITEMS.slice(2);      // Wallet, Rewards, Profile

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)", background: "rgba(10,10,10,0.97)", backdropFilter: "blur(20px)" }}
      aria-label="Primary navigation"
    >
      <div className="relative mx-auto flex max-w-md items-end justify-around px-2 pt-2 pb-2">
        {left.map(({ to, label, icon: Icon }) => (
          <NavTab key={to} to={to} label={label} icon={Icon} reduced={reduced}
            badge={to === "/orders" ? itemCount : 0} />
        ))}

        {/* Centre QR FAB */}
        <div className="relative -mt-7 flex w-16 shrink-0 flex-col items-center">
          <NavLink
            to="/wallet"
            aria-label="Scan QR to pay"
            className="relative grid size-16 place-items-center rounded-2xl bg-primary text-white transition-transform active:scale-90"
            style={{ boxShadow: "0 8px 28px rgba(0,210,122,0.45)" }}
          >
            {!reduced && (
              <motion.span
                animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-2xl bg-primary/40"
              />
            )}
            <QrCode size={26} className="relative" />
          </NavLink>
          <span className="mt-0.5 text-[10px] font-bold text-muted-foreground">Pay</span>
        </div>

        {right.map(({ to, label, icon: Icon }) => (
          <NavTab key={to} to={to} label={label} icon={Icon} reduced={reduced} />
        ))}
      </div>
    </nav>
  );
}

function NavTab({
  to, label, icon: Icon, reduced, badge = 0,
}: {
  to: string; label: string; icon: LucideIcon; reduced: boolean; badge?: number;
}) {
  return (
    <NavLink
      to={to}
      className="relative flex flex-1 flex-col items-center gap-0.5 py-1"
      aria-label={label}
    >
      {({ isActive }) => (
        <>
          <span className="relative grid place-items-center">
            {isActive && !reduced && (
              <motion.span
                layoutId="nav-indicator"
                className="absolute -inset-x-3 -inset-y-1.5 rounded-xl bg-primary/12"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <Icon
              size={22}
              strokeWidth={isActive ? 2.5 : 1.8}
              className={cn("relative transition-colors", isActive ? "text-primary" : "text-muted-foreground")}
            />
            {badge > 0 && (
              <span className="absolute -right-1.5 -top-1 grid min-w-[16px] place-items-center rounded-full bg-primary px-1 text-[9px] font-black text-white">
                {badge}
              </span>
            )}
          </span>
          <span className={cn("relative text-[10px] font-bold transition-colors",
            isActive ? "text-primary" : "text-muted-foreground")}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}

/* ─── Sidebar (desktop) ─── */
export function Sidebar() {
  const { itemCount } = useCart();

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-30 hidden w-64 flex-col border-r border-border bg-card p-5 lg:flex">
      <NavLink to="/home" className="mb-8 flex items-center gap-2.5">
        <div className="grid size-10 place-items-center rounded-xl bg-primary text-white shadow-lift">
          <span className="font-heading text-lg font-black">P</span>
        </div>
        <span className="font-heading text-xl font-black">PayPlate</span>
      </NavLink>

      <nav className="flex flex-1 flex-col gap-0.5">
        {SIDEBAR_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-text",
              )
            }
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
            {to === "/cart" && itemCount > 0 && (
              <span className="ml-auto grid min-w-5 place-items-center rounded-full bg-primary px-1.5 text-xs font-black text-white">
                {itemCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-2xl bg-primary/5 p-4">
        <p className="text-xs font-bold text-muted-foreground">Need help?</p>
        <NavLink to="/support" className="mt-1 block text-sm font-black text-primary">
          Contact support →
        </NavLink>
      </div>
    </aside>
  );
}
