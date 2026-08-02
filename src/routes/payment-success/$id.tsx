import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { PaymentSuccessPage } from "@/pages/payment-success-page";

export const Route = createFileRoute("/payment-success/$id")({
  component: () => (
    <ProtectedRoute>
      <PaymentSuccessPage />
    </ProtectedRoute>
  ),
});
