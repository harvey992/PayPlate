import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CircleCheck as CheckCircle2, Hop as Home, Receipt } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function PaymentSuccessPage() {
  const reduced = usePrefersReducedMotion();
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center py-16">
        <motion.div initial={reduced ? undefined : { scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="grid size-24 place-items-center rounded-full bg-success/10">
          <motion.div initial={reduced ? undefined : { scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}>
            <CheckCircle2 size={56} className="text-success" />
          </motion.div>
        </motion.div>

        <motion.h1 initial={reduced ? undefined : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 font-heading text-2xl font-black">Payment successful!</motion.h1>
        <motion.p initial={reduced ? undefined : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-2 text-center text-sm text-muted-foreground">Your order has been placed and reward points added to your wallet.</motion.p>

        <motion.div initial={reduced ? undefined : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8 flex w-full flex-col gap-3">
          <Button className="w-full" onClick={() => navigate("/orders")}><Receipt size={16} /> View order</Button>
          <Link to="/home"><Button variant="secondary" className="w-full"><Home size={16} /> Back to home</Button></Link>
        </motion.div>
      </div>
    </AppShell>
  );
}
