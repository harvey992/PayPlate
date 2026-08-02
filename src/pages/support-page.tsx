import { LifeBuoy, Mail, MessageCircle, Phone, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";

const faqs = [
  { q: "How do I verify my student status?", a: "Go to Profile and tap 'Verify student status'. Enter your university and student number." },
  { q: "How does the wallet work?", a: "Top up your wallet with card or bank transfer, then pay at any campus restaurant with QR or direct payment." },
  { q: "How do I earn rewards?", a: "Every order earns reward points — 1 point per R2 spent. Points unlock tiers and redeemable rewards." },
  { q: "What if my order is cancelled?", a: "You'll receive a full refund to your wallet within 24 hours." },
];

const contactOptions = [
  { icon: Mail, label: "Email us", desc: "support@payplate.co.za", to: "mailto:support@payplate.co.za" },
  { icon: MessageCircle, label: "Live chat", desc: "Mon–Fri 8am–6pm", to: "#" },
  { icon: Phone, label: "Call us", desc: "+27 21 123 4567", to: "tel:+27211234567" },
];

export function SupportPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="font-heading text-2xl font-black">Help & Support</h1>
          <p className="mt-1 text-sm text-muted-foreground">We're here to help</p>
        </div>

        <div className="space-y-1">
          {contactOptions.map(({ icon: Icon, label, desc, to }) => (
            <a key={label} href={to}>
              <Card className="flex items-center gap-3 p-4">
                <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon size={18} /></div>
                <div className="flex-1"><h3 className="font-bold">{label}</h3><p className="text-sm text-muted-foreground">{desc}</p></div>
                <ChevronRight size={18} className="text-muted-foreground" />
              </Card>
            </a>
          ))}
        </div>

        <div>
          <h2 className="mb-3 font-heading text-sm font-black uppercase tracking-wide text-muted-foreground">FAQ</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Card key={i} className="p-4">
                <h3 className="font-heading text-sm font-black">{faq.q}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
