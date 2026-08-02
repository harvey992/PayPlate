import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { BottomNav, Sidebar } from "./navigation-bar";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useLocation } from "@/lib/router-compat";

export function AppShell({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <Sidebar />
      <motion.main
        key={location.pathname}
        initial={reduced ? undefined : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.2, 0.9, 0.2, 1] }}
        className="mx-auto w-full max-w-7xl px-5 pb-28 pt-20 lg:ml-64 lg:px-10 lg:pb-12"
      >
        {children}
      </motion.main>
      <BottomNav />
    </div>
  );
}
