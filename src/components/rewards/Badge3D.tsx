import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Badge3D({ variant = "gold", className }: { variant?: "bronze" | "silver" | "gold" | "diamond"; className?: string }) {
  const base = "inline-grid place-items-center rounded-full p-3 shadow-lift badge-3d";
  const styles = {
    bronze: "bg-gradient-to-tr from-[#b87333] to-[#c98c58] text-white",
    silver: "bg-gradient-to-tr from-[#c0c0c0] to-[#e8e8e8] text-black",
    gold: "bg-gradient-to-tr from-[#ffd700] to-[#ffb84a] text-black",
    diamond: "bg-gradient-to-tr from-[#cbe9ff] to-[#9fd7ff] text-black",
  } as const;

  return (
    <motion.div
      className={cn(base, styles[variant], className)}
      animate={{ rotateY: [0, 360] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    >
      <div className="font-extrabold">{variant === "gold" ? "★" : variant === "diamond" ? "♦" : variant === "silver" ? "☆" : "●"}</div>
    </motion.div>
  );
}
