import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthPage } from "@/pages/auth-page";
import { Dashboard } from "@/pages/dashboard";
import { LandingPage } from "@/pages/landing-page";
import { TopNavigation } from "@/components/navigation/top-navigation";
import {
  PlaceholderPage,
  RestaurantDetailsPage,
  RestaurantsPage,
  RewardsPage,
  WalletPage,
} from "@/pages/resource-page";
import { DesignSystemPage } from "@/pages/design-system-page";

export function App() {
  return (
    <ThemeProvider>
      <TopNavigation />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/restaurants/:id" element={<RestaurantDetailsPage />} />
        <Route
          path="/cart"
          element={
            <PlaceholderPage
              eyebrow="Cart"
              title="Review your order."
              description="Prepare item quantities, student discounts, and reward redemptions."
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <PlaceholderPage
              eyebrow="Checkout"
              title="Pay securely with wallet."
              description="A secure checkout flow prepared for payment provider integration."
            />
          }
        />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route
          path="/orders"
          element={
            <PlaceholderPage
              eyebrow="Orders"
              title="Track every campus meal."
              description="Order history, receipts, and reorder actions will live here."
            />
          }
        />
        <Route
          path="/profile"
          element={
            <PlaceholderPage
              eyebrow="Profile"
              title="Manage your student identity."
              description="Profile, student verification, preferences, and saved restaurants."
            />
          }
        />
        <Route
          path="/settings"
          element={
            <PlaceholderPage
              eyebrow="Settings"
              title="Tune PayPlate your way."
              description="Theme, security, privacy, notifications, and payment controls."
            />
          }
        />
        <Route
          path="/notifications"
          element={
            <PlaceholderPage
              eyebrow="Notifications"
              title="Never miss a reward or receipt."
              description="Student deals, wallet alerts, and restaurant updates."
            />
          }
        />
        <Route
          path="/support"
          element={
            <PlaceholderPage
              eyebrow="Help & Support"
              title="Get help quickly."
              description="Support articles, contact options, and payment safety guidance."
            />
          }
        />
        <Route path="/design-system" element={<DesignSystemPage />} />
      </Routes>
    </ThemeProvider>
  );
}
