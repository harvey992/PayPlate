import { TopNavigation } from "@/components/navigation/top-navigation";
import { AppShell as Shell } from "@/components/layout/app-shell";
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "@/pages/dashboard";
import { LandingPage } from "@/pages/landing-page";
import { DesignSystemPage } from "@/pages/design-system-page";

export function App() {
  return (
    <div>
      <TopNavigation />
      <Shell>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
        </Routes>
      </Shell>
    </div>
  );
}
