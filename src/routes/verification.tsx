import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { VerificationPage } from "@/pages/verification-page";

export const Route = createFileRoute("/verification")({
  component: () => (
    <ProtectedRoute>
      <VerificationPage />
    </ProtectedRoute>
  ),
});
