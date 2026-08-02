import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/selection-controls";
import { useSettings } from "@/contexts/settings-context";
import { useAuth } from "@/contexts/auth-context";
import { Bell, Shield, CreditCard, Moon } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";

export function SettingsPage() {
  const { settings, updateNotification, updatePrivacy, updatePayment } = useSettings();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-black lg:text-3xl">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Customize PayPlate your way</p>
        </div>

        {/* Theme */}
        <Card>
          <div className="flex items-center gap-2">
            <Moon size={18} className="text-primary" />
            <h3 className="font-heading font-black">Appearance</h3>
          </div>
          <div className="mt-4 flex gap-3">
            {(["light", "dark", "dev"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`flex-1 rounded-xl border-2 p-3 text-sm font-bold capitalize transition-all ${
                  theme === t ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            <h3 className="font-heading font-black">Notifications</h3>
          </div>
          <div className="mt-4 space-y-4">
            <Checkbox
              checked={settings.notifications.orderUpdates}
              onChange={(v) => updateNotification("orderUpdates", v)}
              label="Order status updates"
            />
            <Checkbox
              checked={settings.notifications.rewards}
              onChange={(v) => updateNotification("rewards", v)}
              label="Reward points & tier updates"
            />
            <Checkbox
              checked={settings.notifications.offers}
              onChange={(v) => updateNotification("offers", v)}
              label="Student-exclusive offers"
            />
          </div>
        </Card>

        {/* Privacy */}
        <Card>
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-primary" />
            <h3 className="font-heading font-black">Privacy</h3>
          </div>
          <div className="mt-4 space-y-4">
            <Checkbox
              checked={settings.privacy.showProfile}
              onChange={(v) => updatePrivacy("showProfile", v)}
              label="Show profile to other students"
            />
            <Checkbox
              checked={settings.privacy.shareOrderHistory}
              onChange={(v) => updatePrivacy("shareOrderHistory", v)}
              label="Share order history for recommendations"
            />
          </div>
        </Card>

        {/* Payment */}
        <Card>
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-primary" />
            <h3 className="font-heading font-black">Payment</h3>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <p className="mb-2 text-sm font-bold">Default payment method</p>
              <div className="flex gap-3">
                {(["wallet", "card"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => updatePayment("defaultMethod", m)}
                    className={`flex-1 rounded-xl border-2 p-3 text-sm font-bold capitalize transition-all ${
                      settings.payment.defaultMethod === m ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <Checkbox
              checked={settings.payment.autoTopUp}
              onChange={(v) => updatePayment("autoTopUp", v)}
              label="Auto top-up when balance is low"
            />
          </div>
        </Card>

        {user && (
          <Card className="bg-muted">
            <p className="text-sm text-muted-foreground">Account: {user.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">Member since {new Date(user.createdAt).toLocaleDateString("en-ZA")}</p>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
