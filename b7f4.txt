import { motion } from "framer-motion";
import { Trophy, Target, Flame, CircleCheck as CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RewardCard } from "@/components/domain/reward-card";
import { useRewards } from "@/contexts/rewards-context";
import { useWallet } from "@/contexts/wallet-context";
import { useToast } from "@/contexts/toast-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export function RewardsPage() {
  const { rewards, challenges, isLoading, redeem } = useRewards();
  const { rewardPoints, tier, tierProgressPercent } = useWallet();
  const { showToast } = useToast();
  const reduced = usePrefersReducedMotion();

  function handleRedeem(title: string) {
    redeem(title);
    showToast(`${title} redeemed!`, "success");
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-black lg:text-3xl">Rewards</h1>
          <p className="mt-1 text-sm text-muted-foreground">Earn points, complete challenges, unlock rewards</p>
        </div>

        {/* Tier banner */}
        <Card className="overflow-hidden bg-gradient-to-br from-primary to-primary-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/70">Current tier</p>
              <p className="mt-1 font-heading text-3xl font-black capitalize">{tier}</p>
              <p className="mt-1 text-sm text-white/80">{rewardPoints} points</p>
            </div>
            <motion.div
              animate={reduced ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="grid size-16 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm"
            >
              <Trophy size={32} />
            </motion.div>
          </div>
          <div className="mt-4">
            <div className="h-2 overflow-hidden rounded-full bg-white/20">
              <motion.div
                initial={reduced ? undefined : { width: 0 }}
                animate={{ width: `${tierProgressPercent}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-white"
              />
            </div>
            <p className="mt-2 text-xs text-white/70">{Math.round(tierProgressPercent)}% to next tier</p>
          </div>
        </Card>

        {/* Challenges */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Target size={18} className="text-primary" />
            <h2 className="font-heading text-lg font-black">Challenges</h2>
          </div>
          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28" />)}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {challenges.map((ch, i) => (
                <motion.div
                  key={ch.id}
                  initial={reduced ? undefined : { opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className={cn(ch.isComplete && "bg-success/5")}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {ch.timeframe === "daily" ? <Flame size={14} className="text-warning" /> : <Target size={14} className="text-primary" />}
                          <span className="text-xs font-bold capitalize text-muted-foreground">{ch.timeframe}</span>
                        </div>
                        <h3 className="mt-1.5 font-heading font-black">{ch.title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{ch.description}</p>
                      </div>
                      {ch.isComplete ? (
                        <CheckCircle2 size={20} className="shrink-0 text-success" />
                      ) : (
                        <Badge variant="primary" className="shrink-0">+{ch.points}</Badge>
                      )}
                    </div>
                    <div className="mt-3">
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn("h-full rounded-full transition-all duration-500", ch.isComplete ? "bg-success" : "bg-primary")}
                          style={{ width: `${Math.min((ch.progress / ch.target) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {ch.progress}/{ch.target} {ch.target > 100 ? "points" : "orders"}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Rewards */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Trophy size={18} className="text-primary" />
            <h2 className="font-heading text-lg font-black">Available rewards</h2>
          </div>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-56" />)}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rewards.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={reduced ? undefined : { opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <RewardCard reward={r} onRedeem={() => handleRedeem(r.title)} />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function Badge({ variant, className, children }: { variant: "primary" | "default"; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
      variant === "primary" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
      className,
    )}>
      {children}
    </span>
  );
}
