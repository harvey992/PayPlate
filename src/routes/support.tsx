import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { SupportPage } from "@/pages/support-page";

export const Route = createFileRoute("/support")({
  component: () => (
    <ProtectedRoute>
      <SupportPage />
    </ProtectedRoute>
  ),
});
