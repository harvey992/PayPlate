import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-border bg-card p-10 text-center">
      <div className="grid size-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
        {icon}
      </div>
      <h3 className="mt-4 font-heading text-lg font-black">{title}</h3>
      <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
