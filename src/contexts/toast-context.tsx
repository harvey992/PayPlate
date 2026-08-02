import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type Toast = {
  id: string;
  message: string;
  variant: "success" | "error" | "info";
};

type ToastState = {
  toasts: Toast[];
  showToast: (message: string, variant?: Toast["variant"]) => void;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastState | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const value = useMemo<ToastState>(
    () => ({
      toasts,
      showToast(message, variant = "success") {
        const id = `toast-${Date.now()}-${Math.random()}`;
        setToasts((prev) => [...prev, { id, message, variant }]);
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
      },
      dismissToast(id) {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      },
    }),
    [toasts],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
