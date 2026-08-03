import { useState } from "react";
import { Link, useNavigate } from "@/lib/router-compat";
import { motion } from "framer-motion";
import { Mail, Lock, User as UserIcon, ArrowLeft, GraduationCap, CircleCheck as CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/selection-controls";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/contexts/toast-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type AuthMode = "login" | "register" | "forgot";

export function AuthPage({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate();
  const { login, register, forgotPassword } = useAuth();
  const { showToast } = useToast();
  const reduced = usePrefersReducedMotion();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        await login(email, password, rememberMe);
        showToast("Welcome back!", "success");
        navigate("/home");
      } else if (mode === "register") {
        if (!fullName.trim()) throw new Error("Please enter your full name.");
        await register(email, password, fullName, rememberMe);
        showToast("Account created! Check your email for verification.", "success");
        navigate("/home");
      } else {
        await forgotPassword(email);
        setEmailSent(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const titles = {
    login: { eyebrow: "Welcome back", title: "Sign in to PayPlate", desc: "Your campus food wallet is waiting." },
    register: { eyebrow: "Join PayPlate", title: "Create your account", desc: "Student-exclusive deals, wallet, and rewards." },
    forgot: { eyebrow: "Reset password", title: "Forgot your password?", desc: "We'll send you a reset link." },
  };

  const t = titles[mode];

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left visual panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary-600 to-dark lg:block">
        <div className="absolute inset-0">
          <div className="absolute -left-20 top-20 size-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-20 bottom-20 size-72 rounded-full bg-white/5 blur-3xl" />
          <motion.div
            animate={reduced ? undefined : { y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/3 -translate-x-1/2"
          >
            <div className="rounded-3xl bg-white/15 p-8 backdrop-blur-md">
              <GraduationCap size={48} className="text-white" />
            </div>
          </motion.div>
        </div>
        <div className="relative flex h-full flex-col justify-end p-12">
          <h2 className="font-heading text-4xl font-black text-white">Campus food, simplified.</h2>
          <p className="mt-3 max-w-md text-white/80">
            Order from your favourite campus restaurants, pay with your wallet, and earn rewards on every purchase.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-text">
            <ArrowLeft size={16} /> Back home
          </Link>

          <p className="text-sm font-bold text-primary">{t.eyebrow}</p>
          <h1 className="mt-1 font-heading text-3xl font-black">{t.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>

          {mode === "forgot" && emailSent ? (
            <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-center">
              <CheckCircle2 size={40} className="mx-auto text-success" />
              <h3 className="mt-4 font-heading text-lg font-black">Check your inbox</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                If an account exists for {email}, we've sent a password reset link.
              </p>
              <Link to="/login">
                <Button variant="secondary" className="mt-6 w-full">Back to sign in</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {mode === "register" && (
                <Input
                  label="Full name"
                  name="fullName"
                  placeholder="Jane Doe"
                  icon={<UserIcon size={18} />}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              )}

              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="jane@university.ac.za"
                icon={<Mail size={18} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {mode !== "forgot" && (
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock size={18} />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              )}

              {mode === "login" && (
                <div className="flex items-center justify-between">
                  <Checkbox checked={rememberMe} onChange={setRememberMe} label="Remember me" />
                  <Link to="/forgot-password" className="text-sm font-bold text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              )}

              {error && (
                <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-bold text-danger">
                  {error}
                </div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Please wait…" : mode === "login" ? "Sign in" : mode === "register" ? "Create account" : "Send reset link"}
              </Button>
            </form>
          )}

          {mode === "login" && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="font-bold text-primary hover:underline">Sign up</Link>
            </p>
          )}
          {mode === "register" && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-primary hover:underline">Sign in</Link>
            </p>
          )}
          {mode === "forgot" && !emailSent && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Remembered it?{" "}
              <Link to="/login" className="font-bold text-primary hover:underline">Back to sign in</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
