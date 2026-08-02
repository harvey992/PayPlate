import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { WalletPage } from "@/pages/wallet-page";

export const Route = createFileRoute("/wallet")({
  component: () => (
    <ProtectedRoute>
      <WalletPage />
    </ProtectedRoute>
  ),
});
