import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { CartPage } from "@/pages/cart-page";

export const Route = createFileRoute("/cart")({
  component: () => (
    <ProtectedRoute>
      <CartPage />
    </ProtectedRoute>
  ),
});
