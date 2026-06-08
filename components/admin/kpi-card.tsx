import { Card } from "@/components/ui/card";

export function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <p className="text-sm text-foreground/65">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </Card>
  );
}
