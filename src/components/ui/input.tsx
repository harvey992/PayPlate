import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-bold text-muted-foreground">{label}</span>
      )}
      <input
        className={cn(
          "w-full rounded-2xl border border-border bg-muted px-4 py-3 text-sm font-medium text-text placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20",
          className,
        )}
        {...props}
      />
    </label>
  );
}
