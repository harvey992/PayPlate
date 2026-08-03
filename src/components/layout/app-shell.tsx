import type { ReactNode } from "react";
import { Sidebar, BottomNav } from "./navigation-bar";

/**
 * Responsive app chrome wrapped around every authenticated page's content:
 * a fixed left Sidebar on desktop (lg+), a fixed bottom tab bar with a
 * centre QR-pay button on mobile. The global header/search bar
 * (TopNavigation) is already rendered once in src/routes/__root.tsx, so
 * this only adds the primary section nav.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:pl-64">
        <div className="pb-24 lg:pb-8">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
