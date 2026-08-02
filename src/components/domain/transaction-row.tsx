import { ArrowDownLeft, ArrowUpRight, Gift, RotateCcw } from "lucide-react";
import type { Transaction } from "@/types/payplate";
import { formatRand, timeAgo } from "@/services/payplate-data";
import { cn } from "@/lib/utils";

const iconMap = {
  topup: <ArrowDownLeft size={16} />,
  payment: <ArrowUpRight size={16} />,
  refund: <RotateCcw size={16} />,
  reward: <Gift size={16} />,
};

const colorMap = {
  topup: "bg-success/10 text-success",
  payment: "bg-muted text-muted-foreground",
  refund: "bg-primary/10 text-primary",
  reward: "bg-rewards/10 text-rewards",
};

export function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isPositive = transaction.amountCents > 0;
  return (
    <div className="flex items-center gap-3">
      <div className={cn("grid size-10 place-items-center rounded-xl", colorMap[transaction.type])}>
        {iconMap[transaction.type]}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{transaction.description}</p>
        <p className="text-xs text-muted-foreground">{timeAgo(transaction.date)}</p>
      </div>
      <p className={cn("text-sm font-black tabular-nums", isPositive ? "text-success" : "text-text")}>
        {isPositive ? "+" : ""}{formatRand(transaction.amountCents)}
      </p>
    </div>
  );
}
