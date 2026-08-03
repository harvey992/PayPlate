import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { RepaymentPage } from "@/pages/repayment-page";

export const Route = createFileRoute("/repayment")({
  component: () => (
    <ProtectedRoute>
      <RepaymentPage />
    </ProtectedRoute>
  ),
});
