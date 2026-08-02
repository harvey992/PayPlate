import { motion } from "framer-motion";
import { Trophy, Flame, Target, Gift, Star, Crown } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { RewardCard } from "@/components/domain/reward-card";
import { useWallet } from "@/contexts/wallet-context";
import { useToast } from "@/contexts/toast-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { rewards, challenges } from "@/services/payplate-data";
import { cn } from "@/lib/utils";

const tierIcons = { bronze: Trophy, silver: Trophy, gold: Trophy, diamond: Crown };
const tierColors = { bronze: "from-amber-700 to-amber-500", silver: "from-gray-400 to-gray-200", gold: "from-yellow-600 to-yellow-400", diamond: "from-cyan-400 to-blue-300" };

export function RewardsPage() {
  const { rewardPoints, tier, tierProgressPercent } = useWallet();
  const { showToast } = useToast();
  const reduced = usePrefersReducedMotion();

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="font-heading text-2xl font-black">Rewards</h1>
          <p className="mt-1 text-sm text-muted-foreground">Earn points, unlock rewards</p>
        </div>

        {/* Tier card */}
        <motion.div initial={reduced ? undefined : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={cn("relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br p-6 text-white shadow-lift", tierColors[tier])}>
            <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-white/15 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-white/70">Current tier</p>
                <p className="mt-1 font-heading text-3xl font-black capitalize">{tier}</p>
                <p className="mt-0.5 text-sm text-white/70">{rewardPoints} points</p>
              </div>
              {(() => { const Icon = tierIcons[tier]; return <div className="grid size-14 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm"><Icon size={26} /></div>; })()}
            </div>
            <div className="relative mt-4">
              <div className="h-2 overflow-hidden rounded-full bg-white/25">
                <motion.div initial={reduced ? undefined : { width: 0 }} animate={{ width: `${tierProgressPercent}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-white" />
              </div>
              <p className="mt-1.5 text-xs font-bold text-white/70">{Math.round(tierProgressPercent)}% to next tier</p>
            </div>
          </div>
        </motion.div>

        {/* Challenges */}
        <div>
          <div className="mb-3 flex items-center gap-2"><Target size={18} className="text-primary" /><h2 className="font-heading text-lg font-black">Challenges</h2></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {challenges.map((ch, i) => (
              <motion.div key={ch.id} initial={reduced ? undefined : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("grid size-10 place-items-center rounded-xl", ch.isComplete ? "bg-success/10 text-success" : "bg-primary/10 text-primary")}>
                        {ch.isComplete ? <Trophy size={18} /> : <Flame size={18} />}
                      </div>
                      <div>
                        <h3 className="font-heading text-sm font-black">{ch.title}</h3>
                        <span className={cn("text-xs font-bold", ch.timeframe === "daily" ? "text-primary" : "text-rewards")}>{ch.timeframe}</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-rewards/10 px-2 py-0.5 text-xs font-black text-rewards">+{ch.points}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <div className={cn("h-full rounded-full", ch.isComplete ? "bg-success" : "bg-gradient-to-r from-primary to-accent")} style={{ width: `${Math.min((ch.progress / ch.target) * 100, 100)}%` }} />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{ch.progress} / {ch.target}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Rewards */}
        <div>
          <div className="mb-3 flex items-center gap-2"><Gift size={18} className="text-primary" /><h2 className="font-heading text-lg font-black">Available rewards</h2></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {rewards.map((r, i) => (
              <motion.div key={r.id} initial={reduced ? undefined : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <RewardCard reward={r} onRedeem={() => showToast("Reward redeemed!", "success")} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
