import type { Transaction } from "@/types/payplate";
import { TransactionRow } from "./transaction-row";

export function TransactionCard({ transaction }: { transaction: Transaction }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <TransactionRow transaction={transaction} />
    </div>
  );
}
