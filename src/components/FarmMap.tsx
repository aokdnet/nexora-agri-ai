"use client";

import { useMemo, useState } from "react";
import { PLOTS } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { cropAge, num, thb } from "@/lib/format";
import { StatusChip } from "./Chip";
import type { Plot } from "@/lib/types";


/**
 * Digital Farm Twin — แผนที่แปลงแบบกดได้
 *
 * ตอนนี้ใช้ polygon บนระบบพิกัดคงที่ 640x340 เพื่อให้ Phase 1 เดินได้ก่อน
 * Phase 4 ค่อยเปลี่ยนเป็น GeoJSON จริงวางบนภาพดาวเทียม โดยที่ props ของ
 * component นี้ไม่ต้องเปลี่ยน
 */

type LayerKey = "health" | "water" | "profit";

const LAYERS: Record<LayerKey, { label: string; pick: (p: Plot) => number; scale: [number, string][] }> = {
  health: {
    label: "สุขภาพพืช",
    pick: (p) => p.health,
    scale: [
      [90, "#2E7D3A"],
      [80, "#6AAE4B"],
      [70, "#C9A227"],
      [0, "#C2673A"],
    ],
  },
  water: {
    label: "ความชื้นดิน",
    pick: (p) => p.soilMoisture,
    scale: [
      [40, "#1F6E80"],
      [34, "#3D97A8"],
      [28, "#7FBBC4"],
      [0, "#D3A15C"],
    ],
  },
  profit: {
    label: "กำไรต่อไร่",
    pick: (p) => p.profitPerRai,
    scale: [
      [8000, "#1F5C3C"],
      [3800, "#4A8C5B"],
      [2600, "#9CB374"],
      [0, "#C48F4A"],
    ],
  },
};

function colorFor(plot: Plot, layer: LayerKey): string {
  const { pick, scale } = LAYERS[layer];
  const value = pick(plot);
  for (const [threshold, color] of scale) {
    if (value >= threshold) return color;
  }
  return scale[scale.length - 1][1];
}

function centroid(points: string): [number, number] {
  const pairs = points
    .trim()
    .split(/\s+/)
    .map((pair) => pair.split(",").map(Number) as [number, number]);
  const x = pairs.reduce((sum, p) => sum + p[0], 0) / pairs.length;
  const y = pairs.reduce((sum, p) => sum + p[1], 0) / pairs.length;
  return [x, y];
}

export function FarmMap({ initialPlotId = "A-02" }: { initialPlotId?: string }) {
  const { plots } = useAppStore();
  const [layer, setLayer] = useState<LayerKey>("health");
  const [selectedId, setSelectedId] = useState(initialPlotId);

  const selected = useMemo(
    () => plots.find((p) => p.id === selectedId) ?? plots[0] ?? PLOTS[0],
    [selectedId, plots],
  );


  return (
    <section className="panel">
      <div className="panel-head">
        <span style={{ color: "var(--accent)", display: "flex" }}>
          <svg className="icon">
            <use href="#i-map" />
          </svg>
        </span>
        <h2>Digital Farm Twin</h2>
        <span className="sub">แตะที่แปลงเพื่อดูรายละเอียด</span>
        <span className="spacer" />
        <div role="group" aria-label="ชั้นข้อมูลแผนที่" style={{ display: "flex", gap: 2, background: "var(--surface-2)", borderRadius: 8, padding: 2 }}>
          {(Object.keys(LAYERS) as LayerKey[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={layer === key}
              onClick={() => setLayer(key)}
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: layer === key ? 600 : 400,
                color: layer === key ? "var(--ink)" : "var(--muted)",
                background: layer === key ? "var(--surface)" : "transparent",
              }}
            >
              {LAYERS[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="map-wrap">
        <svg viewBox="0 0 640 340" role="img" aria-label={`แผนที่แปลงเกษตร ${PLOTS.length} แปลง แสดงชั้นข้อมูล${LAYERS[layer].label}`}>
          <defs>
            <pattern id="fieldgrid" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M16 0H0V16" fill="none" stroke="var(--line-soft)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="640" height="340" fill="url(#fieldgrid)" />

          {/* คลองส่งน้ำและถนนในแปลง — เป็นของจริงในพื้นที่ ไม่ใช่ลายตกแต่ง */}
          <path
            d="M0 196 C 120 186, 180 214, 300 206 S 520 190, 640 200"
            fill="none"
            stroke="var(--water)"
            strokeWidth="5"
            opacity="0.33"
            strokeLinecap="round"
          />
          <path d="M312 0 L 300 340" fill="none" stroke="var(--line)" strokeWidth="8" opacity="0.85" />
          <path d="M312 0 L 300 340" fill="none" stroke="var(--surface)" strokeWidth="1.5" strokeDasharray="8 8" />

          {plots.map((plot) => {
            const [cx, cy] = centroid(plot.mapPoints);
            return (
              <g
                key={plot.id}
                className="plot-g"
                data-selected={plot.id === selectedId}
                tabIndex={0}
                role="button"
                aria-label={`แปลง ${plot.id} ${plot.crop} ${plot.rai} ไร่`}
                onClick={() => setSelectedId(plot.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedId(plot.id);
                  }
                }}
              >
                <polygon points={plot.mapPoints} fill={colorFor(plot, layer)} className="plot-shape" />
                <text x={cx} y={cy - 1} textAnchor="middle" className="plot-code">
                  {plot.id}
                </text>
                <text x={cx} y={cy + 9} textAnchor="middle" className="plot-area">
                  {plot.rai} ไร่ · {plot.crop}
                </text>
              </g>
            );
          })}

          {/* หมุดเตือนวางทับสีพื้น เพื่อให้เห็นปัญหาโดยไม่ต้องอ่านตัวเลข */}
          {plots.filter((p) => p.status !== "ok").map((plot) => {
            const [cx, cy] = centroid(plot.mapPoints);
            const color = plot.status === "crit" ? "#B7362C" : "#A97110";

            return (
              <g key={`pin-${plot.id}`} pointerEvents="none">
                <circle cx={cx + 40} cy={cy - 26} r="8" fill={color} />
                <text
                  x={cx + 40}
                  y={cy - 22.6}
                  textAnchor="middle"
                  fontFamily="var(--font-mono), monospace"
                  fontSize="9"
                  fontWeight="600"
                  fill="#fff"
                >
                  !
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="legend">
        <span className="eyebrow" style={{ marginRight: 2 }}>
          {LAYERS[layer].label}
        </span>
        {LAYERS[layer].scale.map(([threshold, color]) => (
          <span key={color}>
            <i className="swatch" style={{ background: color }} />
            {layer === "profit" ? `≥ ${num(threshold)} บาท` : `≥ ${threshold}%`}
          </span>
        ))}
      </div>

      <div style={{ borderTop: "1px solid var(--line-soft)", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <h3 className="serif" style={{ fontSize: 17 }}>
            แปลง {selected.id} · {selected.crop}
          </h3>
          <StatusChip status={selected.status} />
          <span className="chip chip-plain num">{selected.variety}</span>
        </div>

        <div className="detail-grid">
          <Stat k="พื้นที่" v={`${selected.rai} ไร่`} />
          <Stat k="อายุพืช" v={cropAge(selected.ageDays)} />
          <Stat k="ระยะการเจริญเติบโต" v={selected.stage} />
          <Stat k="สุขภาพพืช" v={`${selected.health}%`} />
          <Stat k="ความชื้นดิน" v={`${selected.soilMoisture}%`} />
          <Stat k="ค่า pH ดิน" v={selected.ph.toFixed(1)} />
          <Stat k="ผลผลิตคาดการณ์" v={selected.yieldForecast} />
          <Stat k="ต้นทุนสะสม/ไร่" v={thb(selected.costPerRai)} />
          <Stat k="กำไรคาดการณ์/ไร่" v={thb(selected.profitPerRai)} />
          <Stat k="ให้น้ำล่าสุด" v={selected.lastIrrigation} />
          <Stat k="ใส่ปุ๋ยล่าสุด" v={selected.lastFertilizer} />
          <Stat k="ภาพวิเคราะห์" v={`${selected.photoCount} ภาพ`} />
        </div>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="stat">
      <span className="k">{k}</span>
      <span className="v">{v}</span>
    </div>
  );
}
