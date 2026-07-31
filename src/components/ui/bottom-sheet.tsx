import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export function BottomSheet({ open, onClose, children }: { open?: boolean; onClose?: () => void; children: React.ReactNode }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && onClose) onClose();
    }

    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-dark/40 p-4">
      <Card className="w-full max-w-3xl rounded-t-2xl p-6">
        {children}
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </Card>
    </div>
  );
}
