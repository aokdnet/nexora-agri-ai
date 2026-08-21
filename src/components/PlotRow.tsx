import Link from "next/link";
import { statusColor } from "./Chip";
import { cropAge } from "@/lib/format";
import type { Plot } from "@/lib/types";

/**
 * แถวรายการแปลง
 * แถบสีด้านซ้ายทำให้ผู้ใช้เห็นสถานะก่อนอ่านตัวเลข — สำคัญมากตอนอยู่กลางแดด
 */
export function PlotRow({ plot }: { plot: Plot }) {
  const color = statusColor(plot.status);

  return (
    <Link
      href={`/plots/${plot.id}`}
      className="plot-row"
      style={plot.status !== "ok" ? { borderColor: color } : undefined}
    >
      <i className="stripe" style={{ background: color }} />
      <div className="info">
        <div className="nm">
          {plot.id} {plot.crop}
        </div>
        <div className="sub">
          {plot.rai} ไร่ · {plot.stage} · อายุ {cropAge(plot.ageDays)}
        </div>
      </div>
      <div className="val">
        <div className="n" style={{ color }}>
          {plot.health}
        </div>
        <div className="u">สุขภาพ %</div>
      </div>
    </Link>
  );
}
