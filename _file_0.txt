import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const STORAGE_KEY = "payplate_intro_v2";
const FIRST_LAUNCH_KEY = "payplate_first_launch_v2";

// OLED-black brand palette — matches the dark theme tokens exactly
// (--background: #050505, --primary: #00D27A, --accent: #00E5A8)
const BG = "#050505";
const PRIMARY = "#00D27A";
const ACCENT = "#00E5A8";

const TAGLINE_LINES = ["Student Food.", "Smart Payments.", "Real Savings."];

type Phase =
  | "glow"       // 1-2: black bg + ambient glow ramps in
  | "coin"       // 3: 3D coin rotates in
  | "plate"      // 4: coin morphs into a plate
  | "food"       // 5: food elements appear with depth
  | "logo"       // 6: logo fades in
  | "tagline"    // 7: three-line tagline
  | "progress"   // 8: glowing loading bar
  | "wallet"     // 9: plate transitions into wallet icon
  | "out";       // 10: fade into home

const PHASE_TIMINGS: { phase: Phase; at: number }[] = [
  { phase: "glow", at: 0 },
  { phase: "coin", at: 150 },
  { phase: "plate", at: 650 },
  { phase: "food", at: 950 },
  { phase: "logo", at: 1350 },
  { phase: "tagline", at: 1650 },
  { phase: "progress", at: 2050 },
  { phase: "wallet", at: 2450 },
  { phase: "out", at: 2700 },
];

const TOTAL_DURATION = 3000;

export function CinematicSplash({ onComplete }: { onComplete: () => void }) {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("glow");
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    localStorage.setItem(FIRST_LAUNCH_KEY, "done");
    onComplete();
  };

  useEffect(() => {
    // Respect prefers-reduced-motion: skip straight past the animated intro
    if (reduced) {
      finish();
      return;
    }

    const timers = PHASE_TIMINGS.map(({ phase: p, at }) =>
      setTimeout(() => setPhase(p), at)
    );

    // Loading bar fills across the "progress" -> "wallet" window
    const mountedAt = Date.now();
    const progressStart = PHASE_TIMINGS.find((p) => p.phase === "progress")!.at;
    const progressEnd = PHASE_TIMINGS.find((p) => p.phase === "wallet")!.at;
    const progressWindow = progressEnd - progressStart;
    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - mountedAt;
      const pct = Math.min(
        100,
        Math.max(0, ((elapsed - progressStart) / progressWindow) * 100)
      );
      setProgress(pct);
    }, 30);

    const outTimer = setTimeout(finish, TOTAL_DURATION);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(progressTimer);
      clearTimeout(outTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const showCoin = phase === "coin";
  const showPlate = phase === "plate" || phase === "food" || phase === "logo" || phase === "tagline" || phase === "progress";
  const showWallet = phase === "wallet";
  const showFood = phase === "food" || phase === "logo" || phase === "tagline" || phase === "progress";
  const showLogo = phase === "logo" || phase === "tagline" || phase === "progress" || phase === "wallet";
  const showTagline = phase === "tagline" || phase === "progress" || phase === "wallet";
  const showProgress = phase === "progress" || phase === "wallet";

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: BG, willChange: "opacity" }}
    >
      {/* 1-2. OLED black base + soft ambient green glow ramping in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle, ${PRIMARY}33 0%, transparent 70%)`,
          willChange: "opacity",
        }}
      />
      <div
        className="absolute right-[15%] bottom-[20%] size-64 rounded-full blur-[70px]"
        style={{ background: `${ACCENT}22` }}
      />

      {/* Central stage: coin -> plate -> wallet, cross-faded */}
      <div className="relative z-10 flex h-40 items-center justify-center">
        <AnimatePresence mode="wait">
          {showCoin && (
            <motion.div
              key="coin"
              initial={{ scale: 0.3, rotateY: -180, opacity: 0 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ transformStyle: "preserve-3d", willChange: "transform, opacity" }}
              className="grid size-28 place-items-center rounded-full text-5xl font-black text-white shadow-2xl"
            >
              <div
                className="grid size-28 place-items-center rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`,
                  boxShadow: `0 0 60px ${PRIMARY}73`,
                }}
              >
                P
              </div>
            </motion.div>
          )}

          {showPlate && !showWallet && (
            <motion.div
              key="plate"
              initial={{ scale: 0.7, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ willChange: "transform, opacity" }}
              className="relative grid size-28 place-items-center rounded-full"
            >
              <div
                className="grid size-28 place-items-center rounded-full text-5xl"
                style={{
                  background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`,
                  boxShadow: `0 0 60px ${PRIMARY}73`,
                }}
              >
                🍽️
              </div>

              {/* 5. Food elements orbiting with subtle depth */}
              <AnimatePresence>
                {showFood && (
                  <>
                    <motion.span
                      initial={{ opacity: 0, x: -10, y: -10, scale: 0.5 }}
                      animate={{ opacity: 1, x: -46, y: -36, scale: 1, rotate: [0, -6, 0] }}
                      transition={{ duration: 0.5, rotate: { repeat: Infinity, duration: 2.2 } }}
                      className="absolute text-2xl drop-shadow-lg"
                      style={{ willChange: "transform, opacity" }}
                    >
                      🍔
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, x: 10, y: -10, scale: 0.5 }}
                      animate={{ opacity: 1, x: 44, y: -30, scale: 1, rotate: [0, 6, 0] }}
                      transition={{ duration: 0.5, delay: 0.08, rotate: { repeat: Infinity, duration: 2.4 } }}
                      className="absolute text-xl drop-shadow-lg"
                      style={{ willChange: "transform, opacity" }}
                    >
                      🍟
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 10, scale: 0.5 }}
                      animate={{ opacity: 1, x: 6, y: 42, scale: 1, rotate: [0, -4, 0] }}
                      transition={{ duration: 0.5, delay: 0.16, rotate: { repeat: Infinity, duration: 2.6 } }}
                      className="absolute text-xl drop-shadow-lg"
                      style={{ willChange: "transform, opacity" }}
                    >
                      🥤
                    </motion.span>
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {showWallet && (
            <motion.div
              key="wallet"
              initial={{ scale: 0.6, opacity: 0, rotate: 15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              style={{ willChange: "transform, opacity" }}
              className="grid size-28 place-items-center rounded-full"
            >
              <div
                className="grid size-28 place-items-center rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`,
                  boxShadow: `0 0 60px ${PRIMARY}73`,
                }}
              >
                <Wallet className="size-12 text-white" strokeWidth={2.25} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 6. Logo */}
      <AnimatePresence>
        {showLogo && (
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ willChange: "transform, opacity" }}
            className="relative z-10 mt-6 font-heading text-4xl font-black tracking-tight text-white"
          >
            PayPlate
          </motion.h1>
        )}
      </AnimatePresence>

      {/* 7. Three-line tagline */}
      <AnimatePresence>
        {showTagline && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ willChange: "transform, opacity" }}
            className="relative z-10 mt-4 text-center"
          >
            {TAGLINE_LINES.map((line, i) => (
              <motion.p
                key={line}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                className="text-sm font-bold leading-relaxed"
                style={{ color: i === 2 ? PRIMARY : "#A8A8A8" }}
              >
                {line}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8. Glowing loading bar */}
      <AnimatePresence>
        {showProgress && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 mt-8 w-44"
          >
            <div className="h-1 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})`,
                  boxShadow: `0 0 12px ${PRIMARY}`,
                  willChange: "width",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function QuickSplash({ onComplete }: { onComplete: () => void }) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, "1");
      onComplete();
    }, reduced ? 0 : 700);
    return () => clearTimeout(t);
  }, [onComplete, reduced]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center"
      style={{ background: BG }}
    >
      <motion.div
        animate={reduced ? undefined : { scale: [1, 1.06, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="grid size-24 place-items-center rounded-full"
        style={{
          background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`,
          boxShadow: `0 0 40px ${PRIMARY}66`,
        }}
      >
        <span className="font-heading text-5xl font-black text-white">P</span>
      </motion.div>
      <p className="mt-5 font-heading text-2xl font-black text-white">PayPlate</p>
    </motion.div>
  );
}

export function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [splashType, setSplashType] = useState<"cinematic" | "quick" | "none" | null>(null);

  useEffect(() => {
    const firstLaunch = !localStorage.getItem(FIRST_LAUNCH_KEY);
    const returning = localStorage.getItem(STORAGE_KEY);
    if (firstLaunch) {
      setSplashType("cinematic");
    } else if (!returning) {
      setSplashType("quick");
    } else {
      setSplashType("none");
    }
  }, []);

  if (splashType === null) return null; // wait for mount

  return (
    <AnimatePresence mode="wait">
      {splashType === "cinematic" && (
        <CinematicSplash key="cinematic" onComplete={() => setSplashType("none")} />
      )}
      {splashType === "quick" && (
        <QuickSplash key="quick" onComplete={() => setSplashType("none")} />
      )}
      {splashType === "none" && (
        <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Reset splash for testing
export function resetSplash() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(FIRST_LAUNCH_KEY);
}
