import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getSupabase, isSupabaseConfigured } from "@/services/supabase-client";
import { useAuth } from "./auth-context";
import { mockTransactions } from "@/services/payplate-data";
import type { Transaction, RewardTier } from "@/types/payplate";

type WalletState = {
  balanceCents: number; transactions: Transaction[]; totalSpentThisMonthCents: number;
  rewardPoints: number; tier: RewardTier; tierProgressPercent: number; isLoading: boolean;
  topUp: (amountCents: number) => void;
  deduct: (amountCents: number, description: string, merchantName?: string) => void;
  addReward: (amountCents: number, description: string) => void;
  refresh: () => void;
};

const WalletContext = createContext<WalletState | undefined>(undefined);
const MOCK_INITIAL_BALANCE = 74500;
const MOCK_INITIAL_POINTS = 360;

function tierFromPoints(points: number): { tier: RewardTier; progress: number } {
  if (points >= 2000) return { tier: "diamond", progress: 100 };
  if (points >= 800) return { tier: "gold", progress: ((points - 800) / 1200) * 100 };
  if (points >= 500) return { tier: "silver", progress: ((points - 500) / 300) * 100 };
  return { tier: "bronze", progress: (points / 500) * 100 };
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [balanceCents, setBalanceCents] = useState(MOCK_INITIAL_BALANCE);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [rewardPoints, setRewardPoints] = useState(MOCK_INITIAL_POINTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !isSupabaseConfigured) { setIsLoading(false); return; }
    const sb = getSupabase();
    if (!sb) { setIsLoading(false); return; }
    async function loadWallet() {
      const { data: profile } = await sb!.from("profiles").select("wallet_balance_cents, reward_points, reward_tier").eq("id", user!.id).maybeSingle();
      if (profile) { setBalanceCents(profile.wallet_balance_cents ?? 0); setRewardPoints(profile.reward_points ?? 0); }
      const { data: txns } = await sb!.from("transactions").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(50);
      if (txns && txns.length > 0) {
        setTransactions(txns.map((t: Record<string, unknown>) => ({ id: t.id as string, type: t.type as Transaction["type"], amountCents: t.amount_cents as number, description: t.description as string, merchantName: t.merchant_name as string | undefined, date: t.created_at as string })));
      }
      setIsLoading(false);
    }
    loadWallet();
  }, [user]);

  const { tier, progress: tierProgressPercent } = tierFromPoints(rewardPoints);
  const totalSpentThisMonthCents = useMemo(() => transactions.filter((t) => t.type === "payment").reduce((s, t) => s + Math.abs(t.amountCents), 0), [transactions]);

  async function persistTransaction(txn: Omit<Transaction, "id" | "date">) {
    if (!user || !isSupabaseConfigured) return;
    const sb = getSupabase();
    if (!sb) return;
    await sb.from("transactions").insert({ user_id: user.id, type: txn.type, amount_cents: txn.amountCents, description: txn.description, merchant_name: txn.merchantName ?? null });
  }

  async function updateProfileBalance(newBalance: number, pointsDelta: number = 0) {
    if (!user || !isSupabaseConfigured) return;
    const sb = getSupabase();
    if (!sb) return;
    await sb.from("profiles").update({ wallet_balance_cents: newBalance, reward_points: rewardPoints + pointsDelta }).eq("id", user.id);
  }

  const value = useMemo<WalletState>(() => ({
    balanceCents, transactions, totalSpentThisMonthCents, rewardPoints, tier, tierProgressPercent, isLoading,
    topUp(amountCents) {
      const newBalance = balanceCents + amountCents;
      setBalanceCents(newBalance);
      const txn: Transaction = { id: `t-${Date.now()}`, type: "topup", amountCents, description: "Wallet top-up", date: new Date().toISOString() };
      setTransactions((prev) => [txn, ...prev]);
      persistTransaction(txn); updateProfileBalance(newBalance);
    },
    deduct(amountCents, description, merchantName) {
      const newBalance = balanceCents - amountCents;
      setBalanceCents(newBalance);
      const pointsEarned = Math.floor(amountCents / 100);
      setRewardPoints((prev) => prev + pointsEarned);
      const txn: Transaction = { id: `t-${Date.now()}`, type: "payment", amountCents: -amountCents, description, merchantName, date: new Date().toISOString() };
      setTransactions((prev) => [txn, ...prev]);
      persistTransaction(txn); updateProfileBalance(newBalance, pointsEarned);
    },
    addReward(amountCents, description) {
      const txn: Transaction = { id: `t-${Date.now()}`, type: "reward", amountCents, description, date: new Date().toISOString() };
      setTransactions((prev) => [txn, ...prev]);
      persistTransaction(txn);
    },
    refresh() {
      setIsLoading(true);
      if (user && isSupabaseConfigured) {
        const sb = getSupabase();
        if (sb) {
          sb.from("transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50).then(({ data: txns }) => {
            if (txns) { setTransactions(txns.map((t: Record<string, unknown>) => ({ id: t.id as string, type: t.type as Transaction["type"], amountCents: t.amount_cents as number, description: t.description as string, merchantName: t.merchant_name as string | undefined, date: t.created_at as string }))); }
            setIsLoading(false);
          });
          return;
        }
      }
      setIsLoading(false);
    },
  }), [balanceCents, transactions, totalSpentThisMonthCents, rewardPoints, tier, tierProgressPercent, isLoading, user]);

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
