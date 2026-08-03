import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2, Clock, ArrowLeft, CreditCard, Wallet,
  Building2, Zap, Calendar, TrendingDown, AlertCircle,
} from "lucide-react";
import { useNavigate } from "@/lib/router-compat";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCredit } from "@/contexts/credit-context";
import { useToast } from "@/contexts/toast-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatRand } from "@/services/payplate-data";
import { cn } from "@/lib/utils";
import type { RepaymentMethod, RepaymentType } from "@/types/payplate";

type PaymentMode = "full" | "partial" | "schedule";

const methods: { key: RepaymentMethod; label: string; icon: typeof Wallet; desc: string }[] = [
  { key: "wallet", label: "Wallet", icon: Wallet, desc: "Pay from PayPlate wallet" },
  { key: "card", label: "Card", icon: CreditCard, desc: "Credit / debit card" },
  { key: "bank_transfer", label: "Bank Transfer", icon: Building2, desc: "EFT transfer" },
  { key: "instant_eft", label: "Instant EFT", icon: Zap, desc: "Instant bank payment" },
];

export function RepaymentPage() {
  const navigate = useNavigate();
  const { account, repayments, isLoading, repay } = useCredit();
  const { showToast } = useToast();
  const reduced = usePrefersReducedMotion();

  const [mode, setMode] = useState<PaymentMode>("full");
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<RepaymentMethod>("wallet");
  const [scheduleDate, setScheduleDate] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (isLoading) {
    return (
      <AppShell>
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </AppShell>
    );
  }

  if (!account || account.usedCents === 0) {
    return (
      <AppShell>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/wallet")} className="grid size-10 place-items-center rounded-xl bg-card">
              <ArrowLeft size={18} />
            </button>
            <h1 className="font-heading text-2xl font-black lg:text-3xl">Repayment</h1>
          </div>
          <Card className="flex flex-col items-center py-16 text-center">
            <CheckCircle2 size={48} className="text-success" />
            <h3 className="mt-4 font-heading text-xl font-black">You're all caught up!</h3>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              No outstanding credit balance. Eat now, pay later — your credit is ready to use.
            </p>
            <Button className="mt-6" onClick={() => navigate("/restaurants")}>
              Browse restaurants
            </Button>
          </Card>
        </div>
      </AppShell>
    );
  }

  const interestOwed = Math.round(account.usedCents * (account.interestBps / 10000));
  const totalOwed = account.usedCents + interestOwed;
  const partialAmount = parseFloat(amount) || 0;
  const partialAmountCents = Math.round(partialAmount * 100);
  const scheduleAmountCents = Math.round(totalOwed / 3);

  const modes: { key: PaymentMode; label: string; desc: string }[] = [
    { key: "full", label: "Full repayment", desc: formatRand(totalOwed) },
    { key: "partial", label: "Partial", desc: "Custom amount" },
    { key: "schedule", label: "3-month plan", desc: `${formatRand(scheduleAmountCents)}/mo` },
  ];

  async function handleConfirm() {
    if (!account) return;
    setProcessing(true);

    let amountCents = 0;
    let type: RepaymentType = "manual";

    if (mode === "full") {
      amountCents = totalOwed;
      type = "early";
    } else if (mode === "partial") {
      if (partialAmountCents <= 0 || partialAmountCents > totalOwed) {
        showToast("Enter a valid amount", "error");
        setProcessing(false);
        return;
      }
      amountCents = partialAmountCents;
      type = "partial";
    } else {
      amountCents = scheduleAmountCents;
      type = "scheduled";
    }

    const success = await repay(amountCents, selectedMethod, type);
    setProcessing(false);
    setShowConfirm(false);

    if (success) {
      showToast("Repayment successful!", "success");
      navigate("/wallet");
    } else {
      showToast("Repayment failed. Please try again.", "error");
    }
  }

  const sortedRepayments = [...repayments].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/wallet")} className="grid size-10 place-items-center rounded-xl bg-card">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-heading text-2xl font-black lg:text-3xl">Repayment</h1>
            <p className="text-sm text-muted-foreground">Pay off your food credit</p>
          </div>
        </div>

        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white shadow-lg"
        >
          <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-primary/20 blur-2xl" />
          <p className="text-xs font-bold uppercase tracking-wide text-white/60">Outstanding balance</p>
          <p className="mt-2 font-heading text-4xl font-black tabular-nums">{formatRand(totalOwed)}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-xs text-white/60">Principal</p>
              <p className="font-heading text-lg font-black tabular-nums">{formatRand(account.usedCents)}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-xs text-white/60">Interest ({(account.interestBps / 100).toFixed(2)}% APR)</p>
              <p className="font-heading text-lg font-black tabular-nums">{formatRand(interestOwed)}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs">
            <Calendar size={14} className="shrink-0" />
            <span>Due date: day {account.monthlyDueDate} of each month</span>
          </div>
        </motion.div>

        <div>
          <h3 className="mb-3 font-heading font-black">How would you like to repay?</h3>
          <div className="space-y-3">
            {modes.map((m) => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border-2 p-4 transition-all",
                  mode === m.key ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("grid size-10 place-items-center rounded-xl", mode === m.key ? "bg-primary text-white" : "bg-muted")}>
                    {m.key === "full" ? <CheckCircle2 size={18} /> : m.key === "partial" ? <TrendingDown size={18} /> : <Calendar size={18} />}
                  </div>
                  <div className="text-left">
                    <p className="font-bold">{m.label}</p>
                    <p className="text-sm text-muted-foreground">{m.desc}</p>
                  </div>
                </div>
                <div className={cn("grid size-6 place-items-center rounded-full border-2", mode === m.key ? "border-primary bg-primary" : "border-border")}>
                  {mode === m.key && <div className="size-2.5 rounded-full bg-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {mode === "partial" && (
          <Card className="p-5">
            <Input label="Amount to repay (R)" type="number" placeholder={`Max: ${(totalOwed / 100).toFixed(2)}`} value={amount} onChange={(e) => setAmount(e.target.value)} />
            <div className="mt-3 flex gap-2">
              {[0.25, 0.5, 0.75].map((pct) => (
                <button key={pct} onClick={() => setAmount(((totalOwed * pct) / 100).toFixed(2))} className="flex-1 rounded-xl bg-muted py-2 text-sm font-bold transition-colors hover:bg-primary/10 hover:text-primary">
                  {pct === 0.25 ? "25%" : pct === 0.5 ? "50%" : "75%"}
                </button>
              ))}
            </div>
          </Card>
        )}

        {mode === "schedule" && (
          <Card className="p-5">
            <div className="space-y-3">
              {[1, 2, 3].map((month) => (
                <div key={month} className="flex items-center justify-between rounded-xl bg-muted p-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary"><Calendar size={16} /></div>
                    <span className="text-sm font-bold">Month {month}</span>
                  </div>
                  <span className="font-heading font-black tabular-nums">{formatRand(scheduleAmountCents)}</span>
                </div>
              ))}
            </div>
            <Input label="Start date" type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="mt-4" />
          </Card>
        )}

        <div>
          <h3 className="mb-3 font-heading font-black">Payment method</h3>
          <div className="grid grid-cols-2 gap-3">
            {methods.map((m) => {
              const Icon = m.icon;
              return (
                <button key={m.key} onClick={() => setSelectedMethod(m.key)} className={cn("flex flex-col items-start gap-2 rounded-2xl border-2 p-4 transition-all", selectedMethod === m.key ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30")}>
                  <div className={cn("grid size-10 place-items-center rounded-xl", selectedMethod === m.key ? "bg-primary text-white" : "bg-muted")}><Icon size={18} /></div>
                  <div><p className="font-bold">{m.label}</p><p className="text-xs text-muted-foreground">{m.desc}</p></div>
                </button>
              );
            })}
          </div>
        </div>

        <Card className="p-5">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Repayment amount</span><span className="font-bold tabular-nums">{formatRand(mode === "full" ? totalOwed : mode === "partial" ? partialAmountCents : scheduleAmountCents)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Method</span><span className="font-bold capitalize">{selectedMethod.replace("_", " ")}</span></div>
            <div className="flex justify-between border-t pt-2"><span className="font-heading font-black">Remaining after</span><span className="font-heading font-black tabular-nums text-primary">{formatRand(Math.max(0, totalOwed - (mode === "full" ? totalOwed : mode === "partial" ? partialAmountCents : scheduleAmountCents)))}</span></div>
          </div>
          <Button className="mt-4 w-full" onClick={() => setShowConfirm(true)} disabled={mode === "partial" && partialAmountCents <= 0}>Confirm repayment</Button>
        </Card>

        <div>
          <h3 className="mb-3 font-heading text-lg font-black">Repayment history</h3>
          {sortedRepayments.length === 0 ? (
            <Card className="py-8 text-center"><Clock size={28} className="mx-auto text-muted-foreground" /><p className="mt-3 text-sm text-muted-foreground">No repayments yet</p></Card>
          ) : (
            <div className="space-y-3">
              {sortedRepayments.map((r) => (
                <Card key={r.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("grid size-10 place-items-center rounded-full", r.status === "successful" ? "bg-success/10 text-success" : r.status === "pending" ? "bg-warning/10 text-warning" : r.status === "failed" ? "bg-danger/10 text-danger" : "bg-muted text-muted-foreground")}>
                        {r.status === "successful" ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                      </div>
                      <div><p className="font-bold">{formatRand(r.amountCents)}</p><p className="text-xs text-muted-foreground capitalize">{r.type.replace("_", " ")} · {r.paymentMethod.replace("_", " ")}</p></div>
                    </div>
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold capitalize", r.status === "successful" ? "bg-success/10 text-success" : r.status === "pending" ? "bg-warning/10 text-warning" : r.status === "failed" ? "bg-danger/10 text-danger" : "bg-muted text-muted-foreground")}>{r.status}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm repayment">
        <div className="space-y-4">
          <div className="rounded-2xl bg-primary/5 p-4 text-center">
            <p className="text-xs text-muted-foreground">You're about to repay</p>
            <p className="font-heading text-3xl font-black text-primary">{formatRand(mode === "full" ? totalOwed : mode === "partial" ? partialAmountCents : scheduleAmountCents)}</p>
            <p className="mt-1 text-sm text-muted-foreground capitalize">via {selectedMethod.replace("_", " ")}</p>
          </div>
          {selectedMethod === "wallet" && (
            <div className="flex items-center gap-2 rounded-xl bg-warning/10 p-3 text-xs text-warning"><AlertCircle size={14} className="shrink-0" /><span>This will deduct from your wallet balance</span></div>
          )}
          <Button className="w-full" onClick={handleConfirm} disabled={processing}>{processing ? "Processing..." : "Confirm & pay"}</Button>
        </div>
      </Dialog>
    </AppShell>
  );
}
