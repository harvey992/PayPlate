import { createContext, useContext, useState, type ReactNode } from "react";
import type { User } from "@/types/payplate";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  register: (email: string, fullName: string) => void;
  logout: () => void;
  verifyStudent: (university: string, studentNumber: string) => void;
  updateUser: (updates: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const mockUser: User = {
  id: "user-1",
  email: "jake@student.ac.za",
  fullName: "Jake Mokoena",
  university: "University of Cape Town",
  studentNumber: "MKOJAK001",
  verificationStatus: "verified",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUser);

  function login(email: string) {
    setUser({ ...mockUser, email });
  }

  function register(email: string, fullName: string) {
    setUser({ ...mockUser, email, fullName, verificationStatus: "unverified" });
  }

  function logout() {
    setUser(null);
  }

  function verifyStudent(university: string, studentNumber: string) {
    setUser((prev) =>
      prev ? { ...prev, university, studentNumber, verificationStatus: "verified" } : prev,
    );
  }

  function updateUser(updates: Partial<User>) {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, register, logout, verifyStudent, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
