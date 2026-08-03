import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function WalletCard({ balance, onTopUp, onSend }: { balance: number; onTopUp?: () => void; onSend?: () => void }) {
  const reduced = usePrefersReducedMotion();

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 to-teal-700 p-6 text-white shadow-lg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            <span className="text-sm font-medium text-white/80">PayPlate Balance</span>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-white/60">Wallet</span>
        </div>
        <div className="mt-6">
          <p className="text-4xl font-bold tracking-tight">${balance.toFixed(2)}</p>
          <p className="mt-1 text-sm text-white/60">Available balance</p>
        </div>
        <div className="mt-6 flex gap-3">
          <Button
            onClick={onTopUp}
            className="flex-1 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
          >
            <ArrowDownLeft className="mr-2 h-4 w-4" />
            Top Up
          </Button>
          <Button
            onClick={onSend}
            className="flex-1 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Send
          </Button>
        </div>
      </div>
      {!reduced && (
        <motion.div
          className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-white/5"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      )}
    </Card>
  );
}
