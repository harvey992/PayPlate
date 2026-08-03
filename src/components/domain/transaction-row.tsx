import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import type { Transaction } from "@/types/payplate";
import { cn } from "@/lib/utils";

export function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isPositive = transaction.type === "topup" || transaction.type === "refund";

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          isPositive ? "bg-green-500/10" : "bg-red-500/10"
        )}>
          {isPositive ? (
            <ArrowDownLeft className="h-5 w-5 text-green-500" />
          ) : (
            <ArrowUpRight className="h-5 w-5 text-red-500" />
          )}
        </div>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <p className="text-sm text-muted-foreground">{transaction.date}</p>
        </div>
      </div>
      <span className={cn("font-semibold", isPositive ? "text-green-500" : "text-red-500")}>
        {isPositive ? "+" : "-"}${Math.abs(transaction.amountCents / 100).toFixed(2)}
      </span>
    </div>
  );
}
