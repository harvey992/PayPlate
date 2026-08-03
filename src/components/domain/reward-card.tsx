import { motion } from "framer-motion";
import { Coffee, Beef, CreditCard, Pizza, Diamond } from "lucide-react";
import type { Reward } from "@/types/payplate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

const tierConfig = {
  bronze: { bg: "from-amber-700 to-amber-900", glow: "shadow-[0_0_30px_rgba(180,83,9,0.3)]", label: "text-amber-600" },
  silver: { bg: "from-slate-300 to-slate-500", glow: "shadow-[0_0_30px_rgba(148,163,184,0.3)]", label: "text-slate-400" },
  gold: { bg: "from-yellow-400 to-yellow-600", glow: "shadow-[0_0_30px_rgba(250,204,21,0.4)]", label: "text-yellow-500" },
  diamond: { bg: "from-cyan-300 to-blue-500", glow: "shadow-[0_0_40px_rgba(59,130,246,0.4)]", label: "text-cyan-400" },
};

const iconMap: Record<string, React.ReactNode> = {
  coffee: <Coffee size={28} />,
  fries: <Beef size={28} />,
  credit: <CreditCard size={28} />,
  pizza: <Pizza size={28} />,
  diamond: <Diamond size={28} />,
};

export function RewardCard({ reward, onRedeem }: { reward: Reward; onRedeem?: () => void }) {
  const reduced = usePrefersReducedMotion();
  const config = tierConfig[reward.tier];

  return (
    <Card className={cn("relative overflow-hidden border-0 bg-gradient-to-br p-5 text-white", config.bg, config.glow)}>
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              {iconMap[reward.icon] ?? <Diamond size={28} />}
            </div>
            <div>
              <h3 className="text-lg font-bold">{reward.title}</h3>
              <p className={cn("text-xs font-semibold uppercase tracking-wide", config.label)}>{reward.tier} Tier</p>
            </div>
          </div>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            {reward.pointsCost} pts
          </span>
        </div>
        <p className="text-sm text-white/80">{reward.description}</p>
        <Button
          onClick={onRedeem}
          className="w-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
          disabled={reward.isEarned}
        >
          {reward.isEarned ? "Redeemed" : "Redeem Reward"}
        </Button>
      </div>
      {!reduced && (
        <motion.div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </Card>
  );
}
