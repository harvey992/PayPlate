import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { RestaurantsPage } from "@/pages/restaurants-page";

export const Route = createFileRoute("/restaurants/")({
  component: () => (
    <ProtectedRoute>
      <RestaurantsPage />
    </ProtectedRoute>
  ),
});
