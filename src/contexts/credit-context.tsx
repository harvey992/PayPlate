import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from "react";
import { getSupabase, isSupabaseConfigured } from "@/services/supabase-client";
import { useAuth } from "./auth-context";
import type { CreditAccount, CreditEvent, CreditScore, CreditState, Repayment, RepaymentMethod, RepaymentType } from "@/types/payplate";

const CreditContext = createContext<CreditState | undefined>(undefined);

const INITIAL_LIMIT_CENTS = 50000;
const INITIAL_INTEREST_BPS = 500;

function tierFromScore(score: number): CreditScore["tier"] {
  if (score >= 900) return "platinum";
  if (score >= 750) return "diamond";
  if (score >= 600) return "gold";
  if (score >= 400) return "silver";
  return "bronze";
}

function mapCreditAccount(row: Record<string, unknown>): CreditAccount {
  return {
    id: row.id as string,
    creditLimitCents: row.credit_limit_cents as number,
    usedCents: row.used_cents as number,
    interestBps: row.interest_bps as number,
    monthlyDueDate: row.monthly_due_date as number,
    status: row.status as CreditAccount["status"],
    emergencyCreditCents: row.emergency_credit_cents as number,
    emergencyUsedCents: row.emergency_used_cents as number,
    freezeReason: row.credit_freeze_reason as string | undefined,
  };
}

function mapCreditScore(row: Record<string, unknown>): CreditScore {
  return {
    id: row.id as string,
    score: row.score as number,
    tier: row.tier as CreditScore["tier"],
    riskScore: row.risk_score as number,
    trustScore: row.trust_score as number,
    factors: row.factors as Record<string, number>,
    createdAt: row.created_at as string,
  };
}

function mapRepayment(row: Record<string, unknown>): Repayment {
  return {
    id: row.id as string,
    creditAccountId: row.credit_account_id as string,
    amountCents: row.amount_cents as number,
    type: row.type as Repayment["type"],
    status: row.status as Repayment["status"],
    paymentMethod: row.payment_method as Repayment["paymentMethod"],
    dueDate: row.due_date as string | undefined,
    paidAt: row.paid_at as string | undefined,
    lateFeeCents: row.late_fee_cents as number,
    description: row.description as string,
    createdAt: row.created_at as string,
  };
}

function mapCreditEvent(row: Record<string, unknown>): CreditEvent {
  return {
    id: row.id as string,
    eventType: row.event_type as CreditEvent["eventType"],
    description: row.description as string,
    metadata: row.metadata as Record<string, unknown>,
    createdAt: row.created_at as string,
  };
}

export function CreditProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [account, setAccount] = useState<CreditAccount | null>(null);
  const [latestScore, setLatestScore] = useState<CreditScore | null>(null);
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [events, setEvents] = useState<CreditEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAll = useCallback(async () => {
    if (!user || !isSupabaseConfigured) { setIsLoading(false); return; }
    const sb = getSupabase();
    if (!sb) { setIsLoading(false); return; }

    const { data: acct } = await sb
      .from("credit_accounts")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    let currentAccount: CreditAccount | null = null;
    if (acct) {
      currentAccount = mapCreditAccount(acct);
    } else {
      const { data: newAcct } = await sb
        .from("credit_accounts")
        .insert({
          user_id: user.id,
          credit_limit_cents: INITIAL_LIMIT_CENTS,
          interest_bps: INITIAL_INTEREST_BPS,
          monthly_due_date: 1,
        })
        .select("*")
        .maybeSingle();
      if (newAcct) currentAccount = mapCreditAccount(newAcct);
    }
    setAccount(currentAccount);

    const { data: scores } = await sb
      .from("credit_scores")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);
    if (scores && scores.length > 0) setLatestScore(mapCreditScore(scores[0]));

    const { data: rpmts } = await sb
      .from("repayments")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    if (rpmts) setRepayments(rpmts.map(mapRepayment));

    const { data: evts } = await sb
      .from("credit_events")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);
    if (evts) setEvents(evts.map(mapCreditEvent));

    setIsLoading(false);
  }, [user]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const availableCents = account ? account.creditLimitCents - account.usedCents : 0;
  const utilizationPercent = account && account.creditLimitCents > 0
    ? (account.usedCents / account.creditLimitCents) * 100
    : 0;

  const useCredit = useCallback(async (amountCents: number, description: string): Promise<boolean> => {
    if (!user || !isSupabaseConfigured || !account) return false;
    const sb = getSupabase();
    if (!sb) return false;
    if (account.status !== "active") return false;
    if (amountCents > availableCents) return false;

    const newUsed = account.usedCents + amountCents;
    const { error } = await sb
      .from("credit_accounts")
      .update({ used_cents: newUsed })
      .eq("id", account.id);
    if (error) return false;

    await sb.from("credit_events").insert({
      user_id: user.id,
      event_type: "credit_used",
      description,
      metadata: { amount_cents: amountCents },
    });

    setAccount({ ...account, usedCents: newUsed });
    return true;
  }, [user, account, availableCents]);

  const repay = useCallback(async (
    amountCents: number,
    method: RepaymentMethod,
    type: RepaymentType,
  ): Promise<boolean> => {
    if (!user || !isSupabaseConfigured || !account) return false;
    const sb = getSupabase();
    if (!sb) return false;
    if (amountCents <= 0 || amountCents > account.usedCents) return false;

    const { data: repayment, error: insertError } = await sb
      .from("repayments")
      .insert({
        user_id: user.id,
        credit_account_id: account.id,
        amount_cents: amountCents,
        type,
        status: "successful",
        payment_method: method,
        paid_at: new Date().toISOString(),
        description: type === "early" ? "Early repayment" : `Repayment via ${method}`,
      })
      .select("*")
      .maybeSingle();
    if (insertError || !repayment) return false;

    const newUsed = Math.max(0, account.usedCents - amountCents);
    await sb.from("credit_accounts").update({ used_cents: newUsed }).eq("id", account.id);

    await sb.from("credit_events").insert({
      user_id: user.id,
      event_type: "credit_repaid",
      description: `Repaid ${amountCents} cents via ${method}`,
      metadata: { amount_cents: amountCents, repayment_id: repayment.id },
    });

    setAccount({ ...account, usedCents: newUsed });
    setRepayments((prev) => [mapRepayment(repayment), ...prev]);
    return true;
  }, [user, account]);

  const value: CreditState = {
    account,
    latestScore,
    repayments,
    events,
    availableCents,
    utilizationPercent,
    isLoading,
    refresh: () => { setIsLoading(true); loadAll(); },
    useCredit,
    repay,
  };

  return <CreditContext.Provider value={value}>{children}</CreditContext.Provider>;
}

export function useCredit() {
  const ctx = useContext(CreditContext);
  if (!ctx) throw new Error("useCredit must be used within CreditProvider");
  return ctx;
}

export { tierFromScore };
