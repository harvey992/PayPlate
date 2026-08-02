import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, ArrowLeft, GraduationCap } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/contexts/toast-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type Mode = "login" | "register" | "forgot";

export function AuthPage({ mode }: { mode: Mode }) {
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "login") {
      if (!email) { showToast("Enter your email", "error"); return; }
      login(email);
      showToast("Welcome back!", "success");
      navigate("/home");
    } else if (mode === "register") {
      if (!email || !fullName) { showToast("Fill in all fields", "error"); return; }
      register(email, fullName);
      showToast("Account created!", "success");
      navigate("/home");
    } else {
      showToast("Reset link sent to your email", "success");
      navigate("/login");
    }
  }

  const titles = { login: "Welcome back", register: "Create account", forgot: "Reset password" };
  const subtitles = {
    login: "Sign in to your PayPlate wallet",
    register: "Join PayPlate and start saving",
    forgot: "We'll send you a reset link",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-5 max-w-md mx-auto w-full">
        <motion.div initial={reduced ? undefined : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="grid size-10 place-items-center rounded-xl bg-primary text-white shadow-lift">
              <span className="font-heading text-lg font-black">P</span>
            </div>
            <span className="font-heading text-xl font-black">PayPlate</span>
          </Link>

          <h1 className="font-heading text-3xl font-black">{titles[mode]}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitles[mode]}</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {mode === "register" && (
              <Field icon={<User size={18} />} label="Full name">
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jake Mokoena" className="w-full bg-transparent text-sm font-medium outline-none" />
              </Field>
            )}
            <Field icon={<Mail size={18} />} label="Email">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jake@student.ac.za" className="w-full bg-transparent text-sm font-medium outline-none" />
            </Field>
            {mode !== "forgot" && (
              <Field icon={<Lock size={18} />} label="Password">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-transparent text-sm font-medium outline-none" />
              </Field>
            )}

            {mode === "login" && (
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm font-bold text-primary">Forgot password?</Link>
              </div>
            )}

            <button type="submit" className="w-full rounded-2xl bg-primary py-3.5 text-base font-black text-white transition-all hover:-translate-y-0.5 hover:bg-primary-600 active:scale-95" style={{ boxShadow: "0 12px 30px rgba(0,210,122,0.25)" }}>
              {mode === "login" ? "Sign in" : mode === "register" ? "Create account" : "Send reset link"}
            </button>
          </form>

          {mode === "login" && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              No account? <Link to="/register" className="font-bold text-primary">Sign up</Link>
            </p>
          )}
          {mode === "register" && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="font-bold text-primary">Sign in</Link>
            </p>
          )}
          {mode !== "login" && (
            <Link to="/login" className="mt-4 flex items-center justify-center gap-1 text-sm font-bold text-muted-foreground">
              <ArrowLeft size={14} /> Back to sign in
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <span className="text-muted-foreground">{icon}</span>
        {children}
      </div>
    </label>
  );
}
