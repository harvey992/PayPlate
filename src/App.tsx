import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/contexts/auth-context";
import { WalletProvider } from "@/contexts/wallet-context";
import { CartProvider } from "@/contexts/cart-context";
import { RestaurantsProvider } from "@/contexts/restaurants-context";
import { OrdersProvider } from "@/contexts/orders-context";
import { ToastProvider } from "@/contexts/toast-context";
import { ToastContainer } from "@/components/ui/toast";
import { LandingPage } from "@/pages/landing-page";
import { AuthPage } from "@/pages/auth-page";
import { Dashboard } from "@/pages/dashboard";
import { RestaurantsPage } from "@/pages/restaurants-page";
import { RestaurantDetailsPage } from "@/pages/restaurant-details-page";
import { CartPage } from "@/pages/cart-page";
import { CheckoutPage } from "@/pages/checkout-page";
import { PaymentSuccessPage } from "@/pages/payment-success-page";
import { WalletPage } from "@/pages/wallet-page";
import { RewardsPage } from "@/pages/rewards-page";
import { OrdersPage } from "@/pages/orders-page";
import { ProfilePage } from "@/pages/profile-page";
import { NotificationsPage } from "@/pages/notifications-page";
import { SettingsPage } from "@/pages/settings-page";
import { SupportPage } from "@/pages/support-page";
import { DesignSystemPage } from "@/pages/design-system-page";

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <WalletProvider>
            <CartProvider>
              <RestaurantsProvider>
                <OrdersProvider>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<AuthPage mode="login" />} />
                    <Route path="/register" element={<AuthPage mode="register" />} />
                    <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />
                    <Route path="/home" element={<Dashboard />} />
                    <Route path="/restaurants" element={<RestaurantsPage />} />
                    <Route path="/restaurants/:id" element={<RestaurantDetailsPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/payment-success" element={<PaymentSuccessPage />} />
                    <Route path="/wallet" element={<WalletPage />} />
                    <Route path="/rewards" element={<RewardsPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/design-system" element={<DesignSystemPage />} />
                  </Routes>
                  <ToastContainer />
                </OrdersProvider>
              </RestaurantsProvider>
            </CartProvider>
          </WalletProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
