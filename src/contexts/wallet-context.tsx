import { createContext, useContext, useState, type ReactNode } from "react";
import { mockTransactions } from "@/services/payplate-data";
import type { Transaction } from "@/types/payplate";

type WalletContextValue = {
  balanceCents: number;
  transactions: Transaction[];
  totalSpentThisMonthCents: number;
  rewardPoints: number;
  tier: "bronze" | "silver" | "gold" | "diamond";
  tierProgressPercent: number;
  topUp: (cents: number) => void;
  spend: (cents: number, merchant: string) => void;
  addReward: (points: number, description: string) => void;
  isLoading: boolean;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balanceCents, setBalanceCents] = useState(45000);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [rewardPoints, setRewardPoints] = useState(320);

  const totalSpentThisMonthCents = transactions
    .filter((t) => t.type === "payment")
    .reduce((sum, t) => sum + Math.abs(t.amountCents), 0);

  const tier: WalletContextValue["tier"] =
    rewardPoints >= 2000 ? "diamond" :
    rewardPoints >= 1000 ? "gold" :
    rewardPoints >= 500 ? "silver" : "bronze";

  const tierFloor = tier === "diamond" ? 2000 : tier === "gold" ? 1000 : tier === "silver" ? 500 : 0;
  const tierCeil = tier === "diamond" ? 2000 : tier === "gold" ? 2000 : tier === "silver" ? 1000 : 500;
  const tierProgressPercent = tier === "diamond" ? 100 : ((rewardPoints - tierFloor) / (tierCeil - tierFloor)) * 100;

  function topUp(cents: number) {
    setBalanceCents((b) => b + cents);
    setTransactions((prev) => [
      { id: `t-${Date.now()}`, type: "topup", amountCents: cents, description: "Wallet top-up", date: new Date().toISOString() },
      ...prev,
    ]);
  }

  function spend(cents: number, merchant: string) {
    setBalanceCents((b) => b - cents);
    setTransactions((prev) => [
      { id: `t-${Date.now()}`, type: "payment", amountCents: -cents, description: merchant, merchantName: merchant, date: new Date().toISOString() },
      ...prev,
    ]);
  }

  function addReward(points: number, description: string) {
    setRewardPoints((p) => p + points);
    setTransactions((prev) => [
      { id: `t-${Date.now()}`, type: "reward", amountCents: points * 5, description, date: new Date().toISOString() },
      ...prev,
    ]);
  }

  return (
    <WalletContext.Provider
      value={{ balanceCents, transactions, totalSpentThisMonthCents, rewardPoints, tier, tierProgressPercent, topUp, spend, addReward, isLoading: false }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
