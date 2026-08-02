import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { RewardsPage } from "@/pages/rewards-page";

export const Route = createFileRoute("/rewards")({
  component: () => (
    <ProtectedRoute>
      <RewardsPage />
    </ProtectedRoute>
  ),
});
