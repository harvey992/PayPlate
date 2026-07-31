import { useState } from "react";
import { Wallet3D } from "@/components/domain/wallet-3d";
import { Coins } from "@/components/rewards/Coins";
import { motion, AnimatePresence } from "framer-motion";

export function SuccessAnimation() {
  const [show, setShow] = useState(false);

  function trigger() {
    setShow(true);
    setTimeout(() => setShow(false), 2800);
  }

  return (
    <div>
      <button onClick={trigger} className="rounded-2xl bg-primary text-white px-4 py-2">Simulate payment</button>

      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4">
            <motion.div initial={{ rotateY: 0 }} animate={{ rotateY: 180 }} transition={{ duration: 0.8 }}>
              <Wallet3D>
                <div className="text-sm text-white/80">Payment received</div>
                <div className="mt-4 font-heading text-2xl font-black">R42.00</div>
              </Wallet3D>
            </motion.div>

            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6 }} className="mt-4 grid place-items-center">
              <div className="rounded-full bg-white p-4 shadow-lift">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#0D9F6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </motion.div>

            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }} className="mt-4">
              <Coins count={6} active />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
