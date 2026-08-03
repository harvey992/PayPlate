import { useState } from "react";
import { LifeBuoy, MessageCircle, Mail, CircleHelp as HelpCircle, ChevronDown } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "How do I verify my student status?", a: "Go to Profile → Student Verification, enter your university and student number. Verification usually takes 1–2 business days." },
  { q: "How does the wallet work?", a: "Top up your wallet using any amount. Your balance is deducted when you place orders. You earn reward points on every purchase." },
  { q: "Can I get a refund?", a: "Yes. If your order is cancelled or there's an issue, the amount is refunded to your wallet within 24 hours." },
  { q: "How do reward points work?", a: "You earn 1 point per R1 spent. Points unlock tiers (Bronze → Silver → Gold → Diamond) and can be redeemed for free food and wallet credit." },
  { q: "Is my payment information secure?", a: "PayPlate uses bank-grade encryption. We never store your card details — payments are processed through secure payment gateways." },
];

export function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-black lg:text-3xl">Help & Support</h1>
          <p className="mt-1 text-sm text-muted-foreground">We're here to help you</p>
        </div>

        {/* Contact options */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <MessageCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold">Live chat</h3>
              <p className="text-sm text-muted-foreground">Mon–Fri, 8am–8pm</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold">Email us</h3>
              <p className="text-sm text-muted-foreground">support@payplate.app</p>
            </div>
          </Card>
        </div>

        {/* FAQs */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <HelpCircle size={18} className="text-primary" />
            <h2 className="font-heading text-lg font-black">Frequently asked questions</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <Card key={i} className="p-0">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left"
                >
                  <span className="font-bold">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={cn("shrink-0 text-muted-foreground transition-transform", openFaq === i && "rotate-180")}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Contact form */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <LifeBuoy size={18} className="text-primary" />
            <h3 className="font-heading font-black">Send us a message</h3>
          </div>
          <div className="space-y-3">
            <Input label="Subject" placeholder="What do you need help with?" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <div className="space-y-1.5">
              <label className="block text-sm font-bold">Message</label>
              <textarea
                className="h-32 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Describe your issue…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              disabled={!subject.trim() || !message.trim()}
              onClick={() => { setSubject(""); setMessage(""); }}
            >
              Send message
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
