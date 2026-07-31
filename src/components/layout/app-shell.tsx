import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-7xl px-5 pb-28 pt-20 lg:ml-80 lg:px-8 lg:pb-10">
        {children}
      </main>
    </div>
  );
}
