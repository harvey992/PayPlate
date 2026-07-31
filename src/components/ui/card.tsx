import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-[1.25rem] border border-border bg-card p-5 shadow-soft transition-transform duration-300", className)}
      {...props}
    />
  );
}
