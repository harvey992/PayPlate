import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "dark";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white shadow-lift hover:-translate-y-0.5 hover:bg-primary-600",
  secondary: "bg-card text-text ring-1 ring-border hover:-translate-y-0.5 hover:shadow-soft",
  ghost: "bg-transparent text-text hover:bg-muted",
  dark: "bg-dark text-white shadow-soft hover:-translate-y-0.5",
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-extrabold transition-transform duration-200 will-change-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
