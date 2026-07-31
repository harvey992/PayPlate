import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Coins({ count = 4, active = false }: { count?: number; active?: boolean }) {
  const coins = Array.from({ length: count });
  return (
    <div className="flex gap-2">
      {coins.map((_, i) => (
        <motion.div
          key={i}
          className="coin"
          initial={{ y: -20, opacity: 0 }}
          animate={active ? { y: [0, -12, 0], rotateY: 360 } : { y: 0, rotateY: 0 }}
          transition={{ duration: 0.9, delay: i * 0.06, type: "spring", stiffness: 120 }}
        />
      ))}
    </div>
  );
}
