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
    <Card className="overflow-hidden p-0">
      <div className={cn("relative bg-gradient-to-br p-5", config.bg, config.glow)}>
        <div className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">
          {reward.tier}
        </div>
        <div className="flex items-center gap-3">
          <motion.div
            animate={reduced ? undefined : { rotateY: [0, 360] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="grid size-14 place-items-center rounded-2xl bg-white/20 text-white backdrop-blur-sm"
          >
            {iconMap[reward.icon]}
          </motion.div>
          <div>
            <h4 className="font-heading text-lg font-black text-white">{reward.title}</h4>
            <p className="text-xs text-white/80">{reward.description}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {reward.isEarned ? (
          <Button variant="primary" className="w-full" onClick={onRedeem}>
            Redeem · {reward.pointsCost} pts
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-muted-foreground">{reward.pointsCost} pts needed</span>
              <span className={config.label}>{reward.progressPercent ?? 0}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${reward.progressPercent ?? 0}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
