import { getSupabase, isSupabaseConfigured } from "./supabase-client";
import type { AuthSession, User, VerificationStatus } from "@/types/payplate";

/**
 * Auth service — uses Supabase auth with profiles table.
 * Falls back to localStorage mock auth when Supabase isn't configured.
 */

const STORAGE_KEY = "payplate_session";
const MOCK_DELAY = 600;

function delay<T>(data: T, ms = MOCK_DELAY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

function makeMockUser(email: string, fullName: string): User {
  return {
    id: `mock-${btoa(email).slice(0, 12)}`,
    email,
    fullName,
    role: "student",
    verificationStatus: "unverified",
    createdAt: new Date().toISOString(),
  };
}

function makeSession(user: User): AuthSession {
  return {
    user,
    token: `mock-token-${Date.now()}`,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
  };
}

function saveSession(session: AuthSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function loadSession(): AuthSession | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (parsed.expiresAt < Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

async function fetchProfile(sb: ReturnType<typeof getSupabase>, userId: string): Promise<User | null> {
  if (!sb) return null;
  const { data } = await sb
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    email: "",
    fullName: data.full_name || "",
    avatarUrl: data.avatar_url ?? undefined,
    role: data.role,
    verificationStatus: data.verification_status as VerificationStatus,
    university: data.university ?? undefined,
    studentNumber: data.student_number ?? undefined,
    createdAt: data.created_at,
  };
}

export const authService = {
  async register(email: string, password: string, fullName: string, rememberMe: boolean): Promise<AuthSession> {
    if (isSupabaseConfigured) {
      const sb = getSupabase()!;
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw new Error(error.message);
      if (!data.user) throw new Error("Registration failed — no user returned.");

      // Create profile row
      await sb.from("profiles").upsert({
        id: data.user.id,
        full_name: fullName,
        email,
        role: "student",
        verification_status: "unverified",
        reward_tier: "bronze",
        reward_points: 0,
        wallet_balance_cents: 0,
      });

      const user: User = {
        id: data.user.id,
        email: data.user.email ?? email,
        fullName,
        role: "student",
        verificationStatus: "unverified",
        createdAt: data.user.created_at,
      };
      const session = makeSession(user);
      if (rememberMe) saveSession(session);
      return session;
    }

    const user = makeMockUser(email, fullName);
    const session = makeSession(user);
    if (rememberMe) saveSession(session);
    return delay(session);
  },

  async login(email: string, password: string, rememberMe: boolean): Promise<AuthSession> {
    if (isSupabaseConfigured) {
      const sb = getSupabase()!;
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      if (!data.user) throw new Error("Login failed — no user returned.");

      const profile = await fetchProfile(sb, data.user.id);
      const user: User = profile ?? {
        id: data.user.id,
        email: data.user.email ?? email,
        fullName: (data.user.user_metadata?.full_name as string) ?? email.split("@")[0],
        role: "student",
        verificationStatus: "unverified",
        createdAt: data.user.created_at,
      };
      user.email = data.user.email ?? email;

      const session = makeSession(user);
      if (rememberMe) saveSession(session);
      return session;
    }

    const user = makeMockUser(email, email.split("@")[0]);
    const session = makeSession(user);
    if (rememberMe) saveSession(session);
    return delay(session);
  },

  async forgotPassword(email: string): Promise<void> {
    if (isSupabaseConfigured) {
      const sb = getSupabase()!;
      const { error } = await sb.auth.resetPasswordForEmail(email);
      if (error) throw new Error(error.message);
      return;
    }
    return delay(undefined);
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured) {
      const sb = getSupabase();
      if (sb) await sb.auth.signOut();
    }
    clearSession();
    return delay(undefined);
  },

  getStoredSession(): AuthSession | null {
    return loadSession();
  },

  async verifyStudent(user: User, university: string, studentNumber: string, faculty?: string, campus?: string): Promise<User> {
    const updated: User = {
      ...user,
      university,
      studentNumber,
      faculty,
      campus,
      verificationStatus: "pending" as VerificationStatus,
    };

    if (isSupabaseConfigured) {
      const sb = getSupabase()!;
      await sb.from("profiles").update({
        university,
        student_number: studentNumber,
        faculty: faculty ?? null,
        campus: campus ?? null,
        verification_status: "pending",
      }).eq("id", user.id);
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const session = JSON.parse(raw) as AuthSession;
      saveSession({ ...session, user: updated });
    }
    return delay(updated, 800);
  },

  async resendVerification(_email: string): Promise<void> {
    return delay(undefined);
  },
};
