import { Badge } from "@/components/ui/Badge";
import { ORDER_STATUS } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const meta = ORDER_STATUS[status] ?? { label: status, tone: "neutral" as const };
  const tone =
    meta.tone === "green"
      ? ("green" as const)
      : meta.tone === "amber"
        ? ("amber" as const)
        : meta.tone === "violet"
          ? ("violet" as const)
          : meta.tone === "red"
            ? ("red" as const)
            : ("blue" as const);
  return <Badge tone={tone}>{meta.label}</Badge>;
}
