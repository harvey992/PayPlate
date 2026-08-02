import { Card } from "@/components/ui/card";

export function Feedback({ message }: { message: string }) {
  return (
    <Card className="rounded-xl bg-primary/10"> 
      <p className="font-bold text-primary">{message}</p>
    </Card>
  );
}
