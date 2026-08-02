import { useNavigate } from "react-router-dom";
import { Moon, Sun, Bell, Shield, Globe, LogOut, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const sections = [
    { icon: Bell, label: "Notifications", desc: "Push, email, and order alerts", to: "/notifications" },
    { icon: Shield, label: "Security", desc: "Password, biometrics, sessions", to: "/support" },
    { icon: Globe, label: "Language", desc: "English (South Africa)", to: "/support" },
  ];

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="font-heading text-2xl font-black">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Customize your experience</p>
        </div>

        {/* Theme */}
        <div>
          <h2 className="mb-3 font-heading text-sm font-black text-muted-foreground uppercase tracking-wide">Appearance</h2>
          <Card className="flex items-center gap-3 p-4">
            <div className="grid size-10 place-items-center rounded-xl bg-muted text-muted-foreground">{theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}</div>
            <div className="flex-1"><h3 className="font-heading font-black">Theme</h3><p className="text-sm text-muted-foreground">Dark / Light</p></div>
            <div className="flex gap-2">
              <button onClick={() => setTheme("dark")} className={cn("rounded-xl px-3 py-1.5 text-xs font-bold", theme === "dark" ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>Dark</button>
              <button onClick={() => setTheme("light")} className={cn("rounded-xl px-3 py-1.5 text-xs font-bold", theme === "light" ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>Light</button>
            </div>
          </Card>
        </div>

        {/* Settings sections */}
        <div>
          <h2 className="mb-3 font-heading text-sm font-black text-muted-foreground uppercase tracking-wide">General</h2>
          <div className="space-y-1">
            {sections.map(({ icon: Icon, label, desc, to }) => (
              <Card key={label} className="flex items-center gap-3 p-4" onClick={() => navigate(to)}>
                <div className="grid size-10 place-items-center rounded-xl bg-muted text-muted-foreground"><Icon size={18} /></div>
                <div className="flex-1"><h3 className="font-bold">{label}</h3><p className="text-sm text-muted-foreground">{desc}</p></div>
                <ChevronRight size={18} className="text-muted-foreground" />
              </Card>
            ))}
          </div>
        </div>

        <Button variant="secondary" className="w-full text-danger" onClick={() => { logout(); navigate("/"); }}>
          <LogOut size={16} /> Sign out
        </Button>
      </div>
    </AppShell>
  );
}
