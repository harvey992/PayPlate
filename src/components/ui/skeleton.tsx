import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  // Don't use motion when the user prefers reduced motion (handled in the CSS utility class)
  const prefersReduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  return <div className={cn(!prefersReduced ? "animate-pulse rounded-2xl bg-muted" : "rounded-2xl bg-muted", className)} {...props} />;
}
