import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, GraduationCap, Settings, Bell, LifeBuoy, LogOut, ChevronRight, BadgeCheck, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useWallet } from "@/contexts/wallet-context";
import { useOrders } from "@/contexts/orders-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatRand } from "@/services/payplate-data";
import { cn } from "@/lib/utils";

export function ProfilePage() {
  const { user, logout, verifyStudent } = useAuth();
  const { balanceCents, rewardPoints, tier } = useWallet();
  const { orders } = useOrders();
  const reduced = usePrefersReducedMotion();

  const menuItems = [
    { icon: Bell, label: "Notifications", to: "/notifications" },
    { icon: Settings, label: "Settings", to: "/settings" },
    { icon: LifeBuoy, label: "Help & Support", to: "/support" },
  ];

  return (
    <AppShell>
      <div className="space-y-5">
        {/* Profile header */}
        <motion.div initial={reduced ? undefined : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="flex items-center gap-4 p-5">
            <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-600 text-white">
              <span className="font-heading text-2xl font-black">{user?.fullName?.charAt(0) || "U"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate font-heading text-lg font-black">{user?.fullName || "User"}</h1>
                {user?.verificationStatus === "verified" && <BadgeCheck size={18} className="shrink-0 text-primary" />}
              </div>
              <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
              {user?.university && <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.university}</p>}
            </div>
          </Card>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Balance", value: formatRand(balanceCents) },
            { label: "Points", value: String(rewardPoints) },
            { label: "Orders", value: String(orders.length) },
          ].map((s) => (
            <Card key={s.label} className="p-3 text-center">
              <p className="font-heading text-base font-black">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Verification */}
        {user?.verificationStatus !== "verified" && (
          <Card className="bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><GraduationCap size={22} /></div>
              <div className="flex-1">
                <h3 className="font-heading font-black">Verify student status</h3>
                <p className="text-sm text-muted-foreground">Unlock exclusive student discounts</p>
              </div>
              <Button className="text-sm" onClick={() => verifyStudent("University of Cape Town", "STU001")}>Verify</Button>
            </div>
          </Card>
        )}

        {/* Menu */}
        <div className="space-y-1">
          {menuItems.map(({ icon: Icon, label, to }) => (
            <Link key={to} to={to}>
              <Card className="flex items-center gap-3 p-4 transition-colors hover:bg-muted">
                <div className="grid size-10 place-items-center rounded-xl bg-muted text-muted-foreground"><Icon size={18} /></div>
                <span className="flex-1 font-bold">{label}</span>
                <ChevronRight size={18} className="text-muted-foreground" />
              </Card>
            </Link>
          ))}
        </div>

        {/* Logout */}
        <Button variant="secondary" className="w-full text-danger" onClick={logout}>
          <LogOut size={16} /> Sign out
        </Button>
      </div>
    </AppShell>
  );
}
