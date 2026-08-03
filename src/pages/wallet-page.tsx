import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "@/lib/router-compat";
import {
  Plus, TrendingDown, Trophy, QrCode, ArrowUpRight, ArrowDownLeft,
  Wallet, Receipt, Sparkles, CreditCard, Shield, ChevronRight, AlertCircle,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionRow } from "@/components/domain/transaction-row";
import { useWallet } from "@/contexts/wallet-context";
import { useCredit, tierFromScore } from "@/contexts/credit-context";
import { useToast } from "@/contexts/toast-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatRand } from "@/services/payplate-data";
import { cn } from "@/lib/utils";
import type { CreditTier } from "@/types/payplate";

type Tab = "all" | "topup" | "payment" | "reward";

const tierColors: Record<CreditTier, { bg: string; text: string; glow: string }> = {
  bronze: { bg: "from-amber-700 to-amber-900", text: "text-amber-600", glow: "shadow-[0_0_30px_rgba(180,83,9,0.2)]" },
  silver: { bg: "from-slate-400 to-slate-600", text: "text-slate-500", glow: "shadow-[0_0_30px_rgba(148,163,184,0.2)]" },
  gold: { bg: "from-yellow-400 to-yellow-600", text: "text-yellow-500", glow: "shadow-[0_0_30px_rgba(250,204,21,0.3)]" },
  diamond: { bg: "from-cyan-300 to-blue-500", text: "text-cyan-500", glow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]" },
  platinum: { bg: "from-slate-200 to-slate-400", text: "text-slate-600", glow: "shadow-[0_0_40px_rgba(203,213,225,0.4)]" },
};

export function WalletPage() {
  const { balanceCents, transactions, totalSpentThisMonthCents, rewardPoints, tier, tierProgressPercent, topUp, isLoading } = useWallet();
  const { account, latestScore, availableCents, utilizationPercent, isLoading: creditLoading } = useCredit();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("all");

  function handleTopUp() {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast("Enter a valid amount", "error");
      return;
    }
    topUp(Math.round(amount * 100));
    showToast(`Topped up ${formatRand(Math.round(amount * 100))}`, "success");
    setTopUpAmount("");
    setShowTopUp(false);
  }

  const filteredTransactions = activeTab === "all"
    ? transactions
    : transactions.filter((t) => t.type === activeTab);

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "topup", label: "Top-ups" },
    { key: "payment", label: "Payments" },
    { key: "reward", label: "Rewards" },
  ];

  const quickActions = [
    { icon: <Plus size={22} />, label: "Top up", onClick: () => setShowTopUp(true), color: "bg-primary/10 text-primary" },
    { icon: <QrCode size={22} />, label: "Scan QR", onClick: () => setShowQR(true), color: "bg-accent/10 text-accent" },
    { icon: <ArrowUpRight size={22} />, label: "Send", onClick: () => showToast("Coming soon", "info"), color: "bg-rewards/10 text-rewards" },
    { icon: <ArrowDownLeft size={22} />, label: "Request", onClick: () => showToast("Coming soon", "info"), color: "bg-blue-500/10 text-blue-500" },
  ];

  const creditTier = latestScore ? tierFromScore(latestScore.score) : "bronze";
  const tierColor = tierColors[creditTier];
  const interestRate = account ? (account.interestBps / 100).toFixed(2) : "0.00";
  const creditStatusText = account?.status === "active" ? "Active" : account?.status === "frozen" ? "Frozen" : "Suspended";
  const hasDebt = account && account.usedCents > 0;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-black lg:text-3xl">Wallet</h1>
          <p className="mt-1 text-sm text-muted-foreground">Balance, credit & rewards</p>
        </div>

        {/* Food Credit Card */}
        {creditLoading ? (
          <Skeleton className="h-48 rounded-3xl" />
        ) : account ? (
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-lg",
              tierColor.bg,
              tierColor.glow,
            )}
          >
            <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-white/70">Food Credit</p>
                <div className="mt-2 flex items-center gap-2">
                  <CreditCard size={14} className="text-white/80" />
                  <span className="text-xs font-bold capitalize text-white/70">{creditTier} Tier · {creditStatusText}</span>
                </div>
              </div>
              <div className="grid size-10 place-items-center rounded-xl bg-white/15 backdrop-blur-sm">
                <CreditCard size={18} />
              </div>
            </div>
            <div className="relative mt-5">
              <p className="font-heading text-3xl font-black tabular-nums">{formatRand(availableCents)}</p>
              <p className="mt-1 text-sm text-white/70">Available credit</p>
            </div>
            <div className="relative mt-4">
              <div className="flex justify-between text-xs text-white/60">
                <span>Used: {formatRand(account.usedCents)}</span>
                <span>Limit: {formatRand(account.creditLimitCents)}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
                <motion.div
                  initial={reduced ? undefined : { width: 0 }}
                  animate={{ width: `${utilizationPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full bg-white/80"
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-white/60">Interest: {interestRate}% APR</span>
                <span className="text-xs text-white/60">Due: Day {account.monthlyDueDate}</span>
              </div>
            </div>
            {hasDebt && (
              <Button
                onClick={() => navigate("/repayment")}
                className="relative mt-4 w-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              >
                Repay Credit <ChevronRight size={16} />
              </Button>
            )}
            {account.status === "frozen" && (
              <div className="relative mt-3 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs">
                <AlertCircle size={14} className="shrink-0" />
                <span>Credit frozen: {account.freezeReason ?? "Contact support"}</span>
              </div>
            )}
          </motion.div>
        ) : null}

        {/* Credit Score Card */}
        {latestScore && (
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-primary" />
                <h3 className="font-heading font-black">Credit Score</h3>
              </div>
              <span className={cn("text-sm font-bold capitalize", tierColor.text)}>{creditTier}</span>
            </div>
            <div className="mt-4 flex items-center gap-6">
              <div className="relative grid place-items-center">
                <svg className="size-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted" />
                  <motion.circle
                    cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6"
                    strokeLinecap="round" className="text-primary"
                    strokeDasharray={2 * Math.PI * 34}
                    initial={reduced ? undefined : { strokeDashoffset: 2 * Math.PI * 34 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - latestScore.score / 1000) }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <span className="absolute font-heading text-xl font-black tabular-nums">{latestScore.score}</span>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Risk</span>
                  <span className="font-bold">{latestScore.riskScore}/100</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Trust</span>
                  <span className="font-bold">{latestScore.trustScore}/100</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Utilization</span>
                  <span className="font-bold">{Math.round(utilizationPercent)}%</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Wallet Balance Card */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-600 to-dark p-6 text-white shadow-lift"
        >
          <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-8 size-40 rounded-full bg-accent/20 blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/70">PayPlate Wallet</p>
              <div className="mt-3 flex items-center gap-2">
                <Wallet size={16} className="text-white/80" />
                <span className="text-xs font-bold capitalize text-white/70">{tier} tier</span>
              </div>
            </div>
            <div className="grid size-10 place-items-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Wallet size={18} />
            </div>
          </div>
          <div className="relative mt-6">
            <motion.p
              key={balanceCents}
              initial={reduced ? undefined : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-4xl font-black tabular-nums"
            >
              {formatRand(balanceCents)}
            </motion.p>
            <p className="mt-1 text-sm text-white/70">{rewardPoints} reward points</p>
          </div>
          <div className="relative mt-5 flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-1 w-12 rounded-full bg-white/30" />
              <div className="h-1 w-8 rounded-full bg-white/20" />
            </div>
            <div className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-black backdrop-blur-sm">
              •••• 2026
            </div>
          </div>
        </motion.div>

        {/* Quick actions grid */}
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className="flex flex-col items-center gap-1.5"
            >
              <div className={cn("grid size-14 place-items-center rounded-2xl transition-transform active:scale-90", action.color)}>
                {action.icon}
              </div>
              <span className="text-xs font-bold">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Analytics cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <div className="grid size-10 place-items-center rounded-xl bg-danger/10 text-danger">
                <TrendingDown size={18} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Spent this month</p>
                <p className="font-heading text-lg font-black tabular-nums">{formatRand(totalSpentThisMonthCents)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <div className="grid size-10 place-items-center rounded-xl bg-rewards/10 text-rewards">
                <Trophy size={18} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Reward tier</p>
                <p className="font-heading text-lg font-black capitalize">{tier} · {rewardPoints} pts</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tier progress bar */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              <h3 className="font-heading font-black">Tier progress</h3>
            </div>
            <span className="text-sm font-bold text-primary">{Math.round(tierProgressPercent)}%</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={reduced ? undefined : { width: 0 }}
              animate={{ width: `${tierProgressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {tier === "diamond" ? "Max tier reached!" : `Earn ${2000 - rewardPoints} more points to reach ${tier === "bronze" ? "Silver" : tier === "silver" ? "Gold" : "Diamond"}`}
          </p>
        </Card>

        {/* Transactions */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt size={18} className="text-primary" />
              <h3 className="font-heading text-lg font-black">Recent activity</h3>
            </div>
          </div>

          {/* Tab filter pills */}
          <div className="mb-3 flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-bold transition-all",
                  activeTab === tab.key
                    ? "bg-primary text-white"
                    : "bg-card text-muted-foreground ring-1 ring-border",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16" />)}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <Card className="py-8 text-center">
              <Wallet size={32} className="mx-auto text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">No transactions yet</p>
            </Card>
          ) : (
            <Card className="divide-y divide-border p-0">
              {filteredTransactions.map((t) => (
                <div key={t.id} className="p-4">
                  <TransactionRow transaction={t} />
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>

      {/* Top-up dialog */}
      <Dialog open={showTopUp} onClose={() => setShowTopUp(false)} title="Top up wallet">
        <div className="space-y-4">
          <div className="rounded-2xl bg-primary/5 p-4 text-center">
            <p className="text-xs text-muted-foreground">Current balance</p>
            <p className="font-heading text-2xl font-black text-primary">{formatRand(balanceCents)}</p>
          </div>
          <Input
            label="Amount (R)"
            type="number"
            placeholder="e.g. 100"
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2">
            {[50, 100, 200].map((amt) => (
              <button
                key={amt}
                onClick={() => setTopUpAmount(String(amt))}
                className="flex-1 rounded-xl bg-muted py-2 text-sm font-bold transition-colors hover:bg-primary/10 hover:text-primary"
              >
                R{amt}
              </button>
            ))}
          </div>
          <Button className="w-full" onClick={handleTopUp}>Top up</Button>
        </div>
      </Dialog>

      {/* QR dialog */}
      <Dialog open={showQR} onClose={() => setShowQR(false)} title="Pay via QR">
        <div className="flex flex-col items-center py-4">
          <div className="grid size-48 place-items-center rounded-3xl border-2 border-border bg-card">
            <QrCode size={120} className="text-primary" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Show this code to the cashier to pay</p>
          <p className="mt-1 font-heading text-lg font-black">{formatRand(balanceCents)} available</p>
        </div>
      </Dialog>
    </AppShell>
  );
}
