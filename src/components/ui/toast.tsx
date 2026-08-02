import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Info, X } from "lucide-react";
import { useToast } from "@/contexts/toast-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const icons = {
  success: <CheckCircle2 size={20} />,
  error: <AlertCircle size={20} />,
  info: <Info size={20} />,
};

const colors = {
  success: "text-success",
  error: "text-danger",
  info: "text-primary",
};

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();
  const reduced = usePrefersReducedMotion();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-lift"
            role="alert"
          >
            <span className={colors[toast.variant]}>{icons[toast.variant]}</span>
            <p className="text-sm font-bold">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss"
              className="ml-2 text-muted-foreground hover:text-text"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
