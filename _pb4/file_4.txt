import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, TrendingDown, Trophy, QrCode, ArrowUpRight, ArrowDownLeft, Wallet, Receipt, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionRow } from "@/components/domain/transaction-row";
import { useWallet } from "@/contexts/wallet-context";
import { useToast } from "@/contexts/toast-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatRand } from "@/services/payplate-data";
import { cn } from "@/lib/utils";

type Tab = "all" | "topup" | "payment" | "reward";

export function WalletPage() {
  const { balanceCents, transactions, totalSpentThisMonthCents, rewardPoints, tier, tierProgressPercent, topUp, isLoading } = useWallet();
  const { showToast } = useToast();
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

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-black lg:text-3xl">Wallet</h1>
          <p className="mt-1 text-sm text-muted-foreground">Balance, payments & rewards</p>
        </div>

        {/* Stacked wallet cards */}
        <div className="relative">
          {/* Back card (reward tier) */}
          <div className="absolute -bottom-3 left-3 right-3 h-24 rounded-3xl bg-gradient-to-r from-rewards/80 to-amber-600/80 opacity-60 blur-[1px]" />

          {/* Main wallet card */}
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-600 to-dark p-6 text-white shadow-lift"
          >
            {/* Ambient blobs */}
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
        </div>

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
