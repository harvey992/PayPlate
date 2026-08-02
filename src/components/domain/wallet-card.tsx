import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { Wallet } from "lucide-react";
import { formatRand } from "@/services/payplate-data";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type WalletCardProps = {
  balanceCents: number;
  rewardPoints: number;
  tier: string;
  className?: string;
};

export function WalletCard({ balanceCents, rewardPoints, tier, className }: WalletCardProps) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });

  function handleMouse(e: React.MouseEvent) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotateX.set(((cy - e.clientY) / rect.height) * 20);
    rotateY.set(((e.clientX - cx) / rect.width) * 20);
  }

  function handleTouch(e: React.TouchEvent) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const touch = e.touches[0];
    rotateX.set(((cy - touch.clientY) / rect.height) * 20);
    rotateY.set(((touch.clientX - cx) / rect.width) * 20);
  }

  function reset() {
    rotateX.set(0);
    rotateY.set(0);
  }

  const transform = useTransform([rotateX, rotateY], ([rx, ry]) =>
    `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`,
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onTouchMove={handleTouch}
      onTouchEnd={reset}
      style={{ transform }}
      className={cn(
        "relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-600 to-dark p-6 text-white shadow-lift",
        className,
      )}
    >
      {/* Glass reflection */}
      <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-8 size-40 rounded-full bg-white/5 blur-2xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-white/70">PayPlate Wallet</p>
          <div className="mt-3 flex items-center gap-2">
            <Wallet size={18} className="text-white/80" />
            <span className="text-xs font-bold capitalize text-white/70">{tier} tier</span>
          </div>
        </div>
        <div className="grid size-10 place-items-center rounded-xl bg-white/15 backdrop-blur-sm">
          <Wallet size={18} />
        </div>
      </div>

      <div className="relative mt-8">
        <motion.p
          key={balanceCents}
          initial={reduced ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-3xl font-black tabular-nums"
        >
          {formatRand(balanceCents)}
        </motion.p>
        <p className="mt-1 text-xs text-white/70">{rewardPoints} reward points</p>
      </div>

      <div className="relative mt-6 flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-1 w-12 rounded-full bg-white/30" />
          <div className="h-1 w-8 rounded-full bg-white/20" />
        </div>
        <div className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-black backdrop-blur-sm">
          •••• 2026
        </div>
      </div>
    </motion.div>
  );
}
