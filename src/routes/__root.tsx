import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import { WalletProvider } from "@/contexts/wallet-context";
import { CreditProvider } from "@/contexts/credit-context";
import { RestaurantsProvider } from "@/contexts/restaurants-context";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { OrdersProvider } from "@/contexts/orders-context";
import { RewardsProvider } from "@/contexts/rewards-context";
import { SettingsProvider } from "@/contexts/settings-context";
import { ToastProvider } from "@/contexts/toast-context";
import { ToastContainer } from "@/components/ui/toast";
import { TopNavigation } from "@/components/navigation/top-navigation";
import { SplashWrapper } from "@/components/layout/splash-screen";

function RootComponent() {
  return (
    <ThemeProvider>
      <SplashWrapper>
        <ToastProvider>
          <AuthProvider>
            <RestaurantsProvider>
              <FavoritesProvider>
                <WalletProvider>
                  <CreditProvider>
                    <OrdersProvider>
                      <RewardsProvider>
                        <CartProvider>
                          <SettingsProvider>
                            <TopNavigation />
                            <Outlet />
                            <ToastContainer />
                          </SettingsProvider>
                        </CartProvider>
                      </RewardsProvider>
                    </OrdersProvider>
                  </CreditProvider>
                </WalletProvider>
              </FavoritesProvider>
            </RestaurantsProvider>
          </AuthProvider>
        </ToastProvider>
      </SplashWrapper>
    </ThemeProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
