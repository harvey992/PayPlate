import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Wallet, Trophy, ShieldCheck, Sparkles, Bike, ScanLine, Send, ArrowDownToLine, LayoutList, Star, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const BURGER_IMG = "https://images.pexels.com/photos/4253703/pexels-photo-4253703.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop";
const PIZZA_IMG = "https://images.pexels.com/photos/6223172/pexels-photo-6223172.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop";
const BOWL_IMG = "https://images.pexels.com/photos/7146785/pexels-photo-7146785.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop";

const features = [
  { icon: <Wallet size={28} />, title: "Student Wallet", description: "Top up once, pay everywhere. No cash, no fuss." },
  { icon: <Bike size={28} />, title: "Order anywhere", description: "Every campus restaurant in your pocket." },
  { icon: <Trophy size={28} />, title: "Earn rewards", description: "Every order earns points toward free food." },
  { icon: <ShieldCheck size={28} />, title: "Student verified", description: "Exclusive discounts just for verified students." },
];

const stats = [
  { icon: "🏪", value: "6+", label: "Campus restaurants" },
  { icon: "💸", value: "15%", label: "Avg student discount" },
  { icon: "⏱️", value: "12min", label: "Avg pickup time" },
];

const quickActions = [
  { icon: <ScanLine size={20} />, label: "Scan to pay" },
  { icon: <Send size={20} />, label: "Send" },
  { icon: <ArrowDownToLine size={20} />, label: "Request" },
  { icon: <LayoutList size={20} />, label: "Transactions" },
];

export function LandingPage() {
  const reduced = usePrefersReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Top nav */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.06] bg-[#050505]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-[#00D27A] text-white"><span className="font-heading text-base font-black">P</span></div>
            <span className="font-heading text-lg font-black">PayPlate</span>
          </div>
          <nav className="hidden items-center gap-7 text-sm font-bold text-white/60 lg:flex">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden text-sm font-bold text-white/70 hover:text-white transition-colors sm:block">Sign in</Link>
            <Link to="/register"><button className="rounded-2xl bg-[#00D27A] px-5 py-2.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-[#00B86B]" style={{ boxShadow: "0 8px 24px rgba(0,210,122,0.3)" }}>Get started</button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden pt-20" style={{ background: "linear-gradient(180deg,#050505,#0B0B0B,#101010)" }}>
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(ellipse at top,rgba(0,210,122,0.18) 0%,transparent 65%)" }} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.025]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)`, backgroundSize: "48px 48px" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-5 pt-16 pb-20 lg:grid-cols-2 lg:gap-16 lg:pt-20">
          {/* Left */}
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <motion.div initial={reduced ? undefined : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
              <Sparkles size={13} className="text-[#00D27A]" /> Student Food Assistance Platform
            </motion.div>
            <motion.h1 initial={reduced ? undefined : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-5 font-heading text-[2.6rem] font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Helping students<br /><span style={{ color: "#00D27A" }}>eat smarter.</span>
            </motion.h1>
            <motion.p initial={reduced ? undefined : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/55 lg:mx-0">
              Discover campus restaurants, pay with your student wallet, and earn rewards on every meal.
            </motion.p>
            <motion.div initial={reduced ? undefined : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link to="/register"><button className="inline-flex items-center gap-2 rounded-2xl bg-[#00D27A] px-7 py-3.5 text-base font-black text-white transition-all hover:-translate-y-0.5 hover:bg-[#00B86B] active:scale-95" style={{ boxShadow: "0 15px 35px rgba(0,210,122,0.3)" }}>Get started <ArrowRight size={18} /></button></Link>
              <Link to="/login"><button className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-7 py-3.5 text-base font-bold text-white transition-all hover:bg-white/10 active:scale-95">I have an account</button></Link>
            </motion.div>
            <div className="mt-10 flex items-center justify-center gap-8 lg:justify-start">
              {stats.map((s) => (<div key={s.label} className="flex items-center gap-2.5"><span className="text-xl">{s.icon}</span><div><p className="font-heading text-xl font-black">{s.value}</p><p className="text-[11px] text-white/40">{s.label}</p></div></div>))}
            </div>
          </div>

          {/* Phone mockup */}
          <motion.div initial={reduced ? undefined : { opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 24 }} className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 -z-10 scale-110 rounded-[3rem]" style={{ background: "radial-gradient(ellipse,rgba(0,210,122,0.25) 0%,transparent 70%)", filter: "blur(40px)" }} />
              <motion.div animate={reduced ? undefined : { y: [0, -14, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} className="relative w-[260px] overflow-hidden rounded-[2.8rem] border border-white/10 shadow-2xl sm:w-[290px]" style={{ background: "#080808", boxShadow: "0 40px 80px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.08)" }}>
                <div className="flex items-center justify-between px-6 pt-3 pb-1"><span className="text-[10px] font-bold text-white/50">9:41</span><div className="h-5 w-20 rounded-full bg-black" /><div className="flex items-center gap-1"><div className="h-2 w-3 rounded-sm bg-white/50" /><div className="h-1.5 w-1 rounded-sm bg-white/50" /></div></div>
                <div className="space-y-3 px-3 pb-4 pt-1">
                  <div className="flex items-center justify-between"><div><p className="text-[10px] text-white/50">Good evening,</p><p className="font-heading text-sm font-black">Jake 👋</p></div><div className="size-8 rounded-full bg-gradient-to-br from-[#00D27A] to-[#00B86B]"><div className="grid size-full place-items-center font-bold text-white text-[10px]">J</div></div></div>
                  <div className="overflow-hidden rounded-2xl p-3 text-white" style={{ background: "linear-gradient(135deg,#00D27A,#00885A)" }}>
                    <div className="flex items-start justify-between"><div><p className="text-[9px] font-bold text-white/70">PayPlate Wallet</p><p className="mt-0.5 font-heading text-xl font-black">R450.00</p><p className="text-[9px] text-white/60">Available Balance</p></div><button className="rounded-xl bg-white/20 px-2.5 py-1 text-[9px] font-black backdrop-blur-sm">Top up</button></div>
                    <div className="mt-2 flex items-center gap-1.5"><span className="text-xs">🏆</span><p className="text-[9px] text-white/70">Rewards</p><span className="ml-auto text-[10px] font-black">320 pts</span></div>
                  </div>
                  <div><p className="mb-1.5 text-[9px] font-bold text-white/50">Quick actions</p><div className="grid grid-cols-4 gap-1">{quickActions.map((a) => (<div key={a.label} className="flex flex-col items-center gap-1"><div className="grid size-9 place-items-center rounded-xl bg-white/[0.07]"><span className="text-white/70" style={{ width: 16, height: 16 }}>{a.icon}</span></div><span className="text-center text-[8px] text-white/50 leading-tight">{a.label}</span></div>))}</div></div>
                  <div className="overflow-hidden rounded-xl" style={{ background: "#1a1a1a" }}><div className="flex items-center gap-2 p-2"><img src={BURGER_IMG} alt="" className="h-14 w-16 rounded-lg object-cover" loading="lazy" /><div className="flex-1"><p className="text-[9px] font-black text-[#00D27A]">Students save more</p><p className="text-[9px] text-white/70 leading-tight">Up to 20% off on meals</p><button className="mt-1 rounded-lg bg-[#00D27A] px-2 py-0.5 text-[8px] font-black text-white">View deals</button></div></div></div>
                  <div><div className="flex items-center justify-between"><p className="text-[9px] font-black">Popular near you</p><p className="text-[9px] font-bold text-[#00D27A]">See all</p></div><div className="mt-1.5 flex gap-2"><img src={PIZZA_IMG} alt="" className="h-14 w-16 rounded-xl object-cover" loading="lazy" /><img src={BOWL_IMG} alt="" className="h-14 w-16 rounded-xl object-cover" loading="lazy" /></div></div>
                </div>
                <div className="border-t border-white/[0.06] px-3 py-2" style={{ background: "#080808" }}><div className="flex items-center justify-around">{["🏠", "📋", "💳", "⭐", "👤"].map((icon, i) => (<span key={i} className={`text-sm ${i === 0 ? "opacity-100" : "opacity-30"}`}>{icon}</span>))}</div></div>
              </motion.div>
              {!reduced && (<>
                <motion.div animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-12 top-8 text-5xl drop-shadow-2xl">🍔</motion.div>
                <motion.div animate={{ y: [0, 14, 0], rotate: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute -left-14 top-24 text-4xl drop-shadow-2xl">🍕</motion.div>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute -right-8 bottom-32 text-3xl drop-shadow-2xl">☕</motion.div>
                <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute -left-6 bottom-16 text-3xl drop-shadow-2xl">🪙</motion.div>
              </>)}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="px-5 py-16 lg:py-24" style={{ background: "#050505" }}>
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={reduced ? undefined : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={!reduced ? { y: -4 } : undefined} className="group relative flex flex-col justify-between rounded-[1.5rem] p-6 transition-all" style={{ background: "#101010", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 10px 40px rgba(0,0,0,0.45)" }}>
                <div><div className="grid size-14 place-items-center rounded-2xl bg-[#00D27A]/10 text-[#00D27A]">{f.icon}</div><h3 className="mt-5 font-heading text-lg font-black text-white">{f.title}</h3><p className="mt-2 text-sm leading-relaxed text-white/50">{f.description}</p></div>
                <div className="mt-6"><div className="grid size-8 place-items-center rounded-xl border border-white/10 text-white/40 transition-colors group-hover:border-[#00D27A]/30 group-hover:text-[#00D27A]"><ArrowRight size={16} /></div></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-5 py-16 lg:py-24" style={{ background: "#050505" }}>
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-heading text-3xl font-black lg:text-4xl">How it works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[{ step: "01", title: "Create account", description: "Sign up and verify your student status to unlock discounts." }, { step: "02", title: "Top up wallet", description: "Add funds to your PayPlate wallet using card or bank transfer." }, { step: "03", title: "Order & earn", description: "Pay at campus restaurants and earn reward points on every meal." }].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-[#00D27A] font-heading text-xl font-black text-white" style={{ boxShadow: "0 8px 24px rgba(0,210,122,0.3)" }}>{item.step}</div>
                <h3 className="mt-5 font-heading text-lg font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16 lg:py-20" style={{ background: "#050505" }}>
        <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] p-10 text-center lg:p-16" style={{ background: "linear-gradient(135deg,#00D27A,#00885A,#050505 80%)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
          <h2 className="font-heading text-3xl font-black text-white lg:text-4xl">Ready to eat smarter?</h2>
          <p className="mx-auto mt-4 max-w-md text-white/60">Join PayPlate today and start saving on every campus meal.</p>
          <Link to="/register" className="mt-8 inline-block"><button className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 font-black text-[#00885A] transition-all hover:-translate-y-0.5 hover:bg-white/90">Create free account <ArrowRight size={18} /></button></Link>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#050505" }} className="px-5 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2"><div className="grid size-8 place-items-center rounded-lg bg-[#00D27A]"><span className="font-heading text-sm font-black text-white">P</span></div><span className="font-heading font-black">PayPlate</span></div>
          <p className="text-sm text-white/30">© 2026 PayPlate. Student Food Assistance Platform.</p>
        </div>
      </footer>
    </div>
  );
}
