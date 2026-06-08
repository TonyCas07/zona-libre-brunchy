import { clsx } from "clsx";
import { STATUS_LABELS } from "@/lib/constants";

export function StatusBadge({ status }: { status: keyof typeof STATUS_LABELS }) {
  const color = {
    pending: "bg-warning/15 text-warning",
    validated: "bg-success/15 text-success",
    rejected: "bg-danger/15 text-danger",
    suspended: "bg-secondary/15 text-secondary",
    inactive: "bg-muted text-foreground"
  }[status];

  return <span className={clsx("rounded-full px-2.5 py-1 text-xs font-semibold", color)}>{STATUS_LABELS[status]}</span>;
}
