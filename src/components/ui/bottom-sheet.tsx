import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function BottomSheet({ open, onClose, children }: { open?: boolean; onClose?: () => void; children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && onClose) onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-dark/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />
          <motion.div
            initial={reduced ? { opacity: 0 } : { y: "100%" }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 w-full max-w-3xl"
          >
            <Card className="rounded-t-3xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="mx-auto h-1.5 w-12 rounded-full bg-muted" />
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="grid size-9 place-items-center rounded-xl bg-muted text-muted-foreground"
                >
                  <X size={18} />
                </button>
              </div>
              {children}
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
