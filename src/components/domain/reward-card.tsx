import { motion } from "framer-motion";
import { Trophy, CheckCircle2, Lock } from "lucide-react";
import type { Reward } from "@/types/payplate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

const tierColors: Record<Reward["tier"], string> = {
  bronze: "from-amber-700 to-amber-500",
  silver: "from-gray-400 to-gray-200",
  gold: "from-yellow-600 to-yellow-400",
  diamond: "from-cyan-400 to-blue-300",
};

export function RewardCard({ reward, onRedeem }: { reward: Reward; onRedeem?: () => void }) {
  const reduced = usePrefersReducedMotion();
  const canRedeem = reward.isEarned;

  return (
    <motion.div whileHover={!reduced ? { y: -4 } : undefined} transition={{ type: "spring", stiffness: 320, damping: 28 }}>
      <Card className="relative overflow-hidden p-5">
        <div className={cn("absolute -right-8 -top-8 size-24 rounded-full bg-gradient-to-br opacity-10 blur-2xl", tierColors[reward.tier])} />
        <div className="flex items-start justify-between">
          <div className={cn("grid size-12 place-items-center rounded-2xl bg-gradient-to-br text-white", tierColors[reward.tier])}>
            <Trophy size={20} />
          </div>
          {reward.isEarned ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-black text-success">
              <CheckCircle2 size={12} /> Earned
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-black text-muted-foreground">
              <Lock size={12} /> {reward.pointsCost} pts
            </span>
          )}
        </div>
        <h3 className="mt-4 font-heading text-base font-black">{reward.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{reward.description}</p>
        {!reward.isEarned && reward.progressPercent != null && (
          <div className="mt-3">
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${reward.progressPercent}%` }} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{Math.round(reward.progressPercent)}% progress</p>
          </div>
        )}
        <Button
          variant={canRedeem ? "primary" : "secondary"}
          className={cn("mt-4 w-full", !canRedeem && "pointer-events-none opacity-50")}
          onClick={onRedeem}
          disabled={!canRedeem}
        >
          {canRedeem ? "Redeem now" : `Unlock at ${reward.pointsCost} pts`}
        </Button>
      </Card>
    </motion.div>
  );
}
