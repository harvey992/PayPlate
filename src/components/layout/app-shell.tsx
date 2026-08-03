import { NavLink } from "@/lib/router-compat";
import { Sidebar, BottomNav } from "./navigation-bar";
import { useAuth } from "@/contexts/auth-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="mx-auto max-w-2xl px-4 pb-24 pt-6 lg:max-w-4xl lg:pb-6">
          {children}
        </main>
      </div>
      {user && <BottomNav />}
    </div>
  );
}
