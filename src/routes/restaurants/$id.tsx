import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { RestaurantDetailsPage } from "@/pages/restaurant-details-page";

export const Route = createFileRoute("/restaurants/$id")({
  component: () => (
    <ProtectedRoute>
      <RestaurantDetailsPage />
    </ProtectedRoute>
  ),
});
