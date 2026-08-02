import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type Settings = {
  notifications: { orderUpdates: boolean; rewards: boolean; offers: boolean; };
  privacy: { showProfile: boolean; shareOrderHistory: boolean; };
  payment: { defaultMethod: "wallet" | "card"; autoTopUp: boolean; };
};

type SettingsState = {
  settings: Settings;
  updateNotification: (key: keyof Settings["notifications"], value: boolean) => void;
  updatePrivacy: (key: keyof Settings["privacy"], value: boolean) => void;
  updatePayment: (key: keyof Settings["payment"], value: boolean | string) => void;
};

const defaultSettings: Settings = {
  notifications: { orderUpdates: true, rewards: true, offers: false },
  privacy: { showProfile: true, shareOrderHistory: false },
  payment: { defaultMethod: "wallet", autoTopUp: false },
};

const SettingsContext = createContext<SettingsState | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    try { const raw = localStorage.getItem("payplate_settings"); if (raw) return { ...defaultSettings, ...JSON.parse(raw) }; } catch { /* ignore */ }
    return defaultSettings;
  });
  function persist(next: Settings) { setSettings(next); localStorage.setItem("payplate_settings", JSON.stringify(next)); }
  const value = useMemo<SettingsState>(() => ({
    settings,
    updateNotification(key, val) { persist({ ...settings, notifications: { ...settings.notifications, [key]: val } }); },
    updatePrivacy(key, val) { persist({ ...settings, privacy: { ...settings.privacy, [key]: val } }); },
    updatePayment(key, val) { persist({ ...settings, payment: { ...settings.payment, [key]: val } }); },
  }), [settings]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
