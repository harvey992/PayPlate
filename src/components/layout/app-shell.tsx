import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/bottom-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-md px-4 pb-28 pt-6 lg:max-w-2xl lg:px-6 lg:pb-10">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
