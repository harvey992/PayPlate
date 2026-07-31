import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Wallet3D({ children, className }: { children?: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (y - 0.5) * 8; // rotateX
      const ry = (x - 0.5) * -12; // rotateY
      const card = el.querySelector<HTMLElement>(".card");
      if (card) card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(12px)`;
    }

    function onLeave() {
      const card = el.querySelector<HTMLElement>(".card");
      if (card) card.style.transform = `rotateX(0deg) rotateY(0deg) translateZ(0px)`;
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={cn("wallet-3d relative overflow-hidden rounded-[1.75rem] p-6", className)}>
      <div className="card rounded-[1.5rem] bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,.35),transparent_28%),linear-gradient(135deg,#0F172A,#0D9F6E)] p-6 text-white shadow-lift will-change-transform">
        {children}
      </div>
      <div className="wallet-reflection" />
    </div>
  );
}
