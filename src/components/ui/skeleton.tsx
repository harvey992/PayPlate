import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const prefersReduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  return <div className={cn(!prefersReduced ? "animate-pulse rounded-2xl bg-muted" : "rounded-2xl bg-muted", className)} {...props} />;
}
