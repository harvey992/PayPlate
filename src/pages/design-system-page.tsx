import { Card } from "@/components/ui/card";
import { tokens, animations } from "@/design-system";
import { motion } from "framer-motion";

export function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="font-heading text-3xl font-black">Design system</h1>
      <section className="mt-6">
        <h2 className="font-bold">Tokens</h2>
        <Card className="mt-3">
          <pre className="text-sm">{JSON.stringify(tokens, null, 2)}</pre>
        </Card>
      </section>
      <section className="mt-6">
        <h2 className="font-bold">Animations</h2>
        <motion.div animate={animations.float} className="mt-3 inline-block">
          <Card className="p-6">Floating card</Card>
        </motion.div>
      </section>
    </main>
  );
}
