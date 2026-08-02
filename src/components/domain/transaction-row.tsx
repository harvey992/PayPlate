import type { Transaction } from "@/types/payplate";
import { formatRand, timeAgo } from "@/services/payplate-data";
import { ArrowDownLeft, ArrowUpRight, Gift, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  topup: { icon: ArrowDownLeft, color: "text-success" },
  payment: { icon: ArrowUpRight, color: "text-danger" },
  reward: { icon: Gift, color: "text-primary" },
  refund: { icon: RotateCcw, color: "text-warning" },
};

export function TransactionRow({ transaction }: { transaction: Transaction }) {
  const { icon: Icon, color } = iconMap[transaction.type];

  return (
    <div className="flex items-center gap-3">
      <div className={cn("grid size-10 shrink-0 place-items-center rounded-xl bg-muted", color)}>
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{transaction.description}</p>
        <p className="text-xs text-muted-foreground">{timeAgo(transaction.date)}</p>
      </div>
      <p className={cn(
        "shrink-0 font-heading text-sm font-black tabular-nums",
        transaction.amountCents > 0 ? "text-success" : "text-text",
      )}>
        {transaction.amountCents > 0 ? "+" : ""}{formatRand(Math.abs(transaction.amountCents))}
      </p>
    </div>
  );
}
