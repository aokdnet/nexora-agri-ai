import type { PlotStatus } from "@/lib/types";

type Tone = "ok" | "warn" | "crit" | "water" | "info" | "plain";

interface ChipProps {
  tone?: Tone;
  dot?: boolean;
  children: React.ReactNode;
}

export function Chip({ tone = "plain", dot = false, children }: ChipProps) {
  return (
    <span className={`chip chip-${tone}`}>
      {dot ? <i className="dot" /> : null}
      {children}
    </span>
  );
}

const STATUS_LABEL: Record<PlotStatus, string> = {
  ok: "ปกติ",
  warn: "เฝ้าระวัง",
  crit: "ต้องตรวจด่วน",
};

const STATUS_TONE: Record<PlotStatus, Tone> = {
  ok: "ok",
  warn: "warn",
  crit: "crit",
};

export function StatusChip({ status }: { status: PlotStatus }) {
  return (
    <Chip tone={STATUS_TONE[status]} dot>
      {STATUS_LABEL[status]}
    </Chip>
  );
}

/** สีที่ใช้กับแถบสถานะและตัวเลข — ดึงจาก token เดียวกับ chip */
export function statusColor(status: PlotStatus): string {
  return status === "ok" ? "var(--health)" : status === "warn" ? "var(--warn)" : "var(--crit)";
}
