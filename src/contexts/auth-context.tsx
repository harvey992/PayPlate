import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authService } from "@/services/auth-service";
import { getSupabase, isSupabaseConfigured } from "@/services/supabase-client";
import type { User, VerificationStatus } from "@/types/payplate";

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (email: string, password: string, fullName: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyStudent: (university: string, studentNumber: string, faculty?: string, campus?: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured) {
      const sb = getSupabase();
      if (sb) {
        sb.auth.getSession().then(({ data }) => {
          if (data.session?.user) {
            sb.from("profiles").select("*").eq("id", data.session.user.id).maybeSingle().then(({ data: profile }) => {
              if (profile) {
                setUser({
                  id: profile.id, email: data.session!.user.email ?? "", fullName: profile.full_name || "",
                  avatarUrl: profile.avatar_url ?? undefined, role: profile.role,
                  verificationStatus: profile.verification_status as VerificationStatus,
                  university: profile.university ?? undefined, studentNumber: profile.student_number ?? undefined,
                  faculty: profile.faculty ?? undefined, campus: profile.campus ?? undefined, createdAt: profile.created_at,
                });
              } else {
                setUser({ id: data.session.user.id, email: data.session.user.email ?? "", fullName: (data.session.user.user_metadata?.full_name as string) ?? "", role: "student", verificationStatus: "unverified", createdAt: data.session.user.created_at });
              }
              setIsLoading(false);
            });
          } else {
            const session = authService.getStoredSession();
            if (session) setUser(session.user);
            setIsLoading(false);
          }
        });
        const { data: listener } = sb.auth.onAuthStateChange((_event, session) => { if (!session?.user) setUser(null); });
        return () => { listener.subscription.unsubscribe(); };
      }
    }
    const session = authService.getStoredSession();
    if (session) setUser(session.user);
    setIsLoading(false);
  }, []);

  const value = useMemo<AuthState>(() => ({
    user, isLoading, isAuthenticated: Boolean(user),
    async login(email, password, rememberMe) { const session = await authService.login(email, password, rememberMe); setUser(session.user); },
    async register(email, password, fullName, rememberMe) { const session = await authService.register(email, password, fullName, rememberMe); setUser(session.user); },
    async logout() { await authService.logout(); setUser(null); },
    async forgotPassword(email) { await authService.forgotPassword(email); },
    async verifyStudent(university, studentNumber, faculty, campus) { if (!user) return; const updated = await authService.verifyStudent(user, university, studentNumber, faculty, campus); setUser(updated); },
    updateUser(updates) { setUser((prev) => (prev ? { ...prev, ...updates } : prev)); },
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
