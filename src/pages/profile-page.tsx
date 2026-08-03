import { useNavigate } from "@/lib/router-compat";
import { motion } from "framer-motion";
import { User as UserIcon, GraduationCap, Settings, Bell, LifeBuoy, ChevronRight, LogOut, CreditCard, Heart } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/contexts/toast-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();

  async function handleLogout() {
    await logout();
    showToast("Signed out", "info");
    navigate("/");
  }

  if (!user) {
    return (
      <AppShell>
        <Card className="mx-auto max-w-md text-center">
          <h2 className="font-heading text-lg font-black">You're not signed in</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to access your profile, wallet, and rewards.</p>
          <div className="mt-4 flex gap-2">
            <Button className="flex-1" onClick={() => navigate("/login")}>Sign in</Button>
            <Button variant="secondary" className="flex-1" onClick={() => navigate("/register")}>Sign up</Button>
          </div>
        </Card>
      </AppShell>
    );
  }

  const menuItems = [
    { icon: <GraduationCap size={20} />, label: "Student verification", to: "/verification" },
    { icon: <Settings size={20} />, label: "Settings", to: "/settings" },
    { icon: <Bell size={20} />, label: "Notifications", to: "/notifications" },
    { icon: <CreditCard size={20} />, label: "Payment methods", to: "/wallet" },
    { icon: <Heart size={20} />, label: "Saved restaurants", to: "/restaurants?favorites=true" },
    { icon: <LifeBuoy size={20} />, label: "Help & Support", to: "/support" },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Profile header */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="flex items-center gap-4">
            <div className="grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
              <UserIcon size={28} />
            </div>
            <div className="flex-1">
              <h1 className="font-heading text-xl font-black">{user.fullName}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant={user.verificationStatus === "verified" ? "success" : user.verificationStatus === "pending" ? "warning" : "default"}>
                  {user.verificationStatus === "verified" ? "Verified student" : user.verificationStatus === "pending" ? "Verification pending" : "Unverified"}
                </Badge>
                <Badge variant="primary">{user.role}</Badge>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Student verification */}
        {user.verificationStatus !== "verified" && (
          <Card className="bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-black">Verify your student status</h3>
                <p className="text-sm text-muted-foreground">Unlock exclusive student discounts at every restaurant.</p>
              </div>
            </div>
            <Button className="mt-4 w-full" onClick={() => navigate("/verification")}>
              {user.verificationStatus === "pending" ? "View verification status" : "Start verification"}
            </Button>
          </Card>
        )}

        {/* Menu */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.to)}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-transform hover:-translate-y-0.5"
            >
              <div className="grid size-10 place-items-center rounded-xl bg-muted text-muted-foreground">
                {item.icon}
              </div>
              <span className="flex-1 text-left font-bold">{item.label}</span>
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <Button variant="ghost" className="w-full text-danger" onClick={handleLogout}>
          <LogOut size={18} /> Sign out
        </Button>
      </div>
    </AppShell>
  );
}
