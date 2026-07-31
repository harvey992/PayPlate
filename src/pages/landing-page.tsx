import { EnhancedHero } from "@/components/landing/EnhancedHero";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function LandingPage() {
  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1fr_420px] lg:items-center">
      <EnhancedHero />
    </main>
  );
}
