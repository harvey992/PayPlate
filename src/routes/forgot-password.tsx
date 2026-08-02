import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/pages/auth-page";

export const Route = createFileRoute("/forgot-password")({
  component: () => <AuthPage mode="forgot" />,
});
