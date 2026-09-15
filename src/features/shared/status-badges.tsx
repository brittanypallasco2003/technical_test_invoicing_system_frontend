import { Badge, type BadgeTone } from "@/components/ui/badge";
import { INVOICE_STATUS_LABELS, STATUS_LABELS } from "@/lib/labels";
import type { Status } from "@/types/common";
import type { InvoiceStatus } from "@/types/invoice";

export function RecordStatusBadge({ status }: { status: Status }) {
  return <Badge tone={status === "ACTIVE" ? "success" : "neutral"}>{STATUS_LABELS[status]}</Badge>;
}

const INVOICE_STATUS_TONES: Record<InvoiceStatus, BadgeTone> = {
  DRAFT: "neutral",
  QUEUED: "warning",
  PROCESSING: "warning",
  AUTHORIZED: "success",
  REJECTED: "danger",
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return <Badge tone={INVOICE_STATUS_TONES[status]}>{INVOICE_STATUS_LABELS[status]}</Badge>;
}
