import { useToast } from "@/contexts/toast-context";
import { motion, AnimatePresence } from "framer-motion";
import { CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  const icons = {
    success: <CheckCircle2 size={18} className="text-success" />,
    error: <AlertCircle size={18} className="text-danger" />,
    info: <Info size={18} className="text-primary" />,
  };

  return (
    <div className="fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 lg:bottom-8">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-2 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-lift"
          >
            {icons[t.type]}
            <span className="text-sm font-bold">{t.message}</span>
            <button onClick={() => dismissToast(t.id)} className="text-muted-foreground hover:text-text">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
