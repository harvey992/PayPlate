import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import type { Transaction } from "@/types/payplate";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function TransactionCard({ transaction }: { transaction: Transaction }) {
  const isPositive = transaction.type === "topup" || transaction.type === "refund";

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full",
            isPositive ? "bg-green-500/10" : "bg-red-500/10"
          )}>
            {isPositive ? (
              <ArrowDownLeft className="h-6 w-6 text-green-500" />
            ) : (
              <ArrowUpRight className="h-6 w-6 text-red-500" />
            )}
          </div>
          <div>
            <p className="font-semibold">{transaction.description}</p>
            <p className="text-sm text-muted-foreground">{transaction.date}</p>
          </div>
        </div>
        <span className={cn("text-lg font-bold", isPositive ? "text-green-500" : "text-red-500")}>
          {isPositive ? "+" : "-"}${Math.abs(transaction.amountCents / 100).toFixed(2)}
        </span>
      </div>
    </Card>
  );
}
