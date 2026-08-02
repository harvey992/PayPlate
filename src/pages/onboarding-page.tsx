import { useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Wallet, Trophy, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const ONBOARD_KEY = "payplate_onboarded";

const slides = [
  {
    icon: <Utensils size={48} />,
    title: "Discover affordable meals",
    description: "Find campus restaurants with student-exclusive discounts, all in one place.",
    gradient: "from-primary/20 via-accent/10 to-transparent",
  },
  {
    icon: <Wallet size={48} />,
    title: "Pay with student wallet",
    description: "Top up your PayPlate wallet and pay securely — no card needed on campus.",
    gradient: "from-blue-500/20 via-primary/10 to-transparent",
  },
  {
    icon: <Trophy size={48} />,
    title: "Earn rewards every meal",
    description: "Every order earns reward points. Climb tiers and unlock free meals.",
    gradient: "from-rewards/20 via-amber-500/10 to-transparent",
  },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  function finish() {
    localStorage.setItem(ONBOARD_KEY, "1");
    navigate("/register");
  }

  function next() {
    if (index < slides.length - 1) setIndex(index + 1);
    else finish();
  }

  const slide = slides[index];

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-background px-6">
      {/* Skip */}
      <button
        onClick={finish}
        className="absolute right-5 top-5 text-sm font-bold text-muted-foreground transition-colors hover:text-text"
      >
        Skip
      </button>

      {/* Slide content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={reduced ? undefined : { opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? undefined : { opacity: 0, x: -60 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex flex-col items-center text-center"
        >
          {/* Illustration */}
          <div className={`relative mb-10 grid size-56 place-items-center rounded-[2.5rem] bg-gradient-to-br ${slide.gradient}`}>
            <div className="absolute inset-0 rounded-[2.5rem] glass" />
            <motion.div
              animate={reduced ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative grid size-24 place-items-center rounded-full bg-primary text-white shadow-lift"
            >
              {slide.icon}
            </motion.div>
            {/* Floating particles */}
            {!reduced && (
              <>
                <div className="absolute left-6 top-8 size-2 rounded-full bg-primary/40 animate-float" />
                <div className="absolute right-8 top-12 size-1.5 rounded-full bg-accent/50 animate-float-slow" />
                <div className="absolute bottom-10 left-10 size-2 rounded-full bg-rewards/40 animate-float" />
              </>
            )}
          </div>

          <h2 className="font-heading text-2xl font-black tracking-tight">{slide.title}</h2>
          <p className="mt-3 max-w-xs text-base leading-relaxed text-muted-foreground">
            {slide.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="mt-10 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 w-full max-w-xs">
        <Button className="w-full" onClick={next}>
          {index === slides.length - 1 ? "Get started" : "Next"}
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
}

export function hasOnboarded(): boolean {
  return localStorage.getItem(ONBOARD_KEY) === "1";
}
