import { useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import { motion } from "framer-motion";
import { GraduationCap, CircleCheck as CheckCircle2, Clock, Circle as XCircle, Upload, ArrowLeft, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/contexts/toast-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

const timelineSteps = [
  { label: "Account created", desc: "Your PayPlate account is ready.", status: "complete" },
  { label: "Submit verification", desc: "Enter your student details.", status: "current" },
  { label: "Under review", desc: "We verify your student status.", status: "pending" },
  { label: "Verified", desc: "Unlock student discounts.", status: "pending" },
];

export function VerificationPage() {
  const { user, verifyStudent } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();

  const [university, setUniversity] = useState(user?.university ?? "");
  const [studentNumber, setStudentNumber] = useState(user?.studentNumber ?? "");
  const [faculty, setFaculty] = useState("");
  const [campus, setCampus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const verificationStatus = user?.verificationStatus ?? "unverified";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!university.trim() || !studentNumber.trim() || !faculty.trim() || !campus.trim()) {
      showToast("Please fill in all fields", "error");
      return;
    }
    setIsSubmitting(true);
    await verifyStudent(university, studentNumber, faculty, campus);
    setIsSubmitting(false);
    showToast("Verification submitted! We'll review it shortly.", "success");
  }

  const statusConfig = {
    unverified: { label: "Not verified", color: "bg-muted text-muted-foreground", icon: GraduationCap },
    pending: { label: "Under review", color: "bg-warning/10 text-warning", icon: Clock },
    verified: { label: "Verified student", color: "bg-success/10 text-success", icon: CheckCircle2 },
    rejected: { label: "Rejected", color: "bg-danger/10 text-danger", icon: XCircle },
  };

  const currentStatus = statusConfig[verificationStatus];

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/profile")} className="grid size-10 place-items-center rounded-xl bg-card ring-1 ring-border">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-heading text-2xl font-black">Student verification</h1>
            <p className="text-sm text-muted-foreground">Unlock exclusive campus discounts</p>
          </div>
        </div>

        {/* Status card */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={cn("flex items-center gap-4", currentStatus.color)}>
            <div className={cn("grid size-14 place-items-center rounded-2xl", currentStatus.color)}>
              <currentStatus.icon size={26} />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-black">Status: {currentStatus.label}</h3>
              <p className="text-sm text-muted-foreground">
                {verificationStatus === "verified"
                  ? "You have access to all student-exclusive discounts."
                  : verificationStatus === "pending"
                  ? "Your verification is being reviewed. This usually takes 1–2 business days."
                  : "Submit your details below to start the verification process."}
              </p>
            </div>
            <Badge className={cn("shrink-0", currentStatus.color)}>{currentStatus.label}</Badge>
          </Card>
        </motion.div>

        {/* Timeline */}
        <Card>
          <h3 className="font-heading font-black">Verification timeline</h3>
          <div className="mt-4 space-y-1">
            {timelineSteps.map((step, i) => {
              const isLast = i === timelineSteps.length - 1;
              const iconMap = {
                complete: <CheckCircle2 size={16} className="text-success" />,
                current: <Clock size={16} className="text-warning" />,
                pending: <div className="size-3 rounded-full border-2 border-muted-foreground/30" />,
              };
              return (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="grid size-8 place-items-center rounded-full bg-card ring-1 ring-border">
                      {iconMap[step.status as keyof typeof iconMap]}
                    </div>
                    {!isLast && <div className="h-8 w-px bg-border" />}
                  </div>
                  <div className="pb-4">
                    <p className="font-bold text-sm">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Verification form — only show if unverified */}
        {verificationStatus === "unverified" && (
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" />
              <h3 className="font-heading font-black">Your details</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="University"
                placeholder="e.g. University of Cape Town"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              />
              <Input
                label="Student number"
                placeholder="e.g. STU2026001"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
              />
              <Input
                label="Faculty"
                placeholder="e.g. Engineering"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
              />
              <Input
                label="Campus"
                placeholder="e.g. Main Campus"
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
              />

              {/* Upload placeholder */}
              <div>
                <label className="mb-1.5 block text-sm font-bold">Student card upload</label>
                <div className="rounded-2xl border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary">
                  <Upload size={28} className="mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm font-bold">Upload your student card</p>
                  <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, or PDF — max 5MB</p>
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting…" : "Submit for verification"}
              </Button>
            </form>
          </Card>
        )}

        {verificationStatus === "pending" && (
          <Card className="bg-warning/5">
            <div className="flex items-center gap-3">
              <Clock size={24} className="text-warning" />
              <div>
                <h3 className="font-heading font-black">Verification in progress</h3>
                <p className="text-sm text-muted-foreground">We'll notify you once your status is confirmed. This usually takes 1–2 business days.</p>
              </div>
            </div>
          </Card>
        )}

        {verificationStatus === "verified" && (
          <Card className="bg-success/5">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} className="text-success" />
              <div>
                <h3 className="font-heading font-black">You're verified!</h3>
                <p className="text-sm text-muted-foreground">You now have access to student-exclusive discounts at every restaurant.</p>
              </div>
            </div>
            <Button className="mt-4 w-full" onClick={() => navigate("/restaurants")}>
              Browse restaurants with discounts
            </Button>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
