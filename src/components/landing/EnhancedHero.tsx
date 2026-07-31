import React, { Suspense } from "react";
const Hero3D = React.lazy(() => import("@/components/3d/Hero3D"));
import { Card } from "@/components/ui/card";
import "@/styles/3d.css";

export function EnhancedHero() {
  return (
    <section className="mx-auto grid min-h-screen max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1fr_420px] lg:items-center">
      <div className="space-y-7">
        <div>
          <h1 className="font-heading text-5xl font-black tracking-tight md:text-7xl">
            Pay, eat, and earn around campus.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            A premium wallet and restaurant platform for university students to discover meals, unlock
            discounts, pay securely, and collect rewards.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a href="/home" className="no-underline">
            <button className="inline-flex items-center gap-2 rounded-2xl bg-primary text-white px-5 py-3 font-extrabold">Open dashboard</button>
          </a>
          <a href="/register" className="no-underline">
            <button className="inline-flex items-center gap-2 rounded-2xl bg-card text-text px-5 py-3 font-extrabold">Create account</button>
          </a>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Card>
            <p className="mt-3 font-black">Digital wallet</p>
          </Card>
          <Card>
            <p className="mt-3 font-black">Secure checkout</p>
          </Card>
          <Card>
            <p className="mt-3 font-black">Student rewards</p>
          </Card>
        </div>
      </div>

      <div className="hidden lg:block">
        <Suspense fallback={<div className="rounded-[2rem] border border-border bg-card p-6 shadow-soft">Loading preview...</div>}>
          <Hero3D />
        </Suspense>
      </div>
    </section>
  );
}
