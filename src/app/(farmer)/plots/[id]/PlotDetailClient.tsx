"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdviceCard } from "@/components/AdviceCard";
import { StatusChip, statusColor } from "@/components/Chip";
import { Icon } from "@/components/Icon";
import { IRRIGATION_ADVICE } from "@/lib/data";
import { cropAge, thb } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import type { Plot } from "@/lib/types";

export function PlotDetailClient({ initialPlot }: { initialPlot: Plot }) {
  const { plots, irrigatePlot, fertilizePlot, deletePlot } = useAppStore();
  const plot = plots.find((p) => p.id.toUpperCase() === initialPlot.id.toUpperCase()) ?? initialPlot;
  const router = useRouter();

  const [isIrrigateModalOpen, setIsIrrigateModalOpen] = useState(false);
  const [irrigateMinutes, setIrrigateMinutes] = useState(30);
  const [irrigateSuccess, setIrrigateSuccess] = useState(false);

  const [isFertilizeModalOpen, setIsFertilizeModalOpen] = useState(false);
  const [fertilizerFormula, setFertilizerFormula] = useState("ปุ๋ยอินทรีย์ชีวภาพ + โดโลไมท์");
  const [fertilizeSuccess, setFertilizeSuccess] = useState(false);

  const advice = IRRIGATION_ADVICE.plotId === plot.id ? IRRIGATION_ADVICE : null;
  const moistureShort = plot.soilMoisture < plot.soilMoistureTarget;

  const handleConfirmIrrigation = () => {
    irrigatePlot(plot.id, irrigateMinutes);
    setIsIrrigateModalOpen(false);
    setIrrigateSuccess(true);
    setTimeout(() => setIrrigateSuccess(false), 4000);
  };

  const handleConfirmFertilizer = () => {
    fertilizePlot(plot.id, fertilizerFormula);
    setIsFertilizeModalOpen(false);
    setFertilizeSuccess(true);
    setTimeout(() => setFertilizeSuccess(false), 4000);
  };

  return (
    <>
      <header className="appbar">
        <Link href="/plots" className="back-btn" aria-label="กลับไปรายการแปลง">
          <Icon name="chevron" size={17} className="flip" />
        </Link>
        <div className="appbar-title">
          <div className="hi">แปลง {plot.id}</div>
          <div className="name">
            {plot.crop} · {plot.variety}
          </div>
        </div>
        <StatusChip status={plot.status} />
      </header>

      <main className="page">
        {/* Success Banners */}
        {irrigateSuccess && (
          <div
            style={{
              background: "var(--health-soft)",
              color: "var(--health)",
              padding: "10px 14px",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 13.5,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Icon name="check" size={16} />
            <span>อนุมัติคำสั่งเปิดวาล์วน้ำแปลง {plot.id} สำเร็จ เซนเซอร์ความชื้นอัปเดตแล้ว</span>
          </div>
        )}

        {fertilizeSuccess && (
          <div
            style={{
              background: "var(--health-soft)",
              color: "var(--health)",
              padding: "10px 14px",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 13.5,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Icon name="check" size={16} />
            <span>บันทึกการใส่ปุ๋ยแปลง {plot.id} เรียบร้อย คะแนนสุขภาพพืชเพิ่มขึ้น</span>
          </div>
        )}

        {/* Live Stat Grid */}
        <div className="stat-grid">
          <Stat k="สุขภาพพืช" v={`${plot.health}%`} color={statusColor(plot.status)} />
          <Stat
            k={`ความชื้นดิน (เป้า ${plot.soilMoistureTarget}%)`}
            v={`${plot.soilMoisture}%`}
            color={moistureShort ? "var(--warn)" : "var(--water)"}
          />
          <Stat k="พื้นที่" v={`${plot.rai} ไร่`} />
          <Stat k="อายุพืช" v={cropAge(plot.ageDays)} />
          <Stat k="ระยะการเติบโต" v={plot.stage} />
          <Stat k="ค่า pH ดิน" v={plot.ph.toFixed(1)} />
          <Stat k="ผลผลิตคาดการณ์" v={plot.yieldForecast} />
          <Stat k="กำไรคาดการณ์/ไร่" v={thb(plot.profitPerRai)} color="var(--health)" />
        </div>

        {/* Smart Actions Bar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button
            type="button"
            className="tap tap-ghost"
            onClick={() => setIsIrrigateModalOpen(true)}
            style={{
              border: "1.5px solid var(--water)",
              color: "var(--water)",
              background: "var(--water-soft)",
              borderRadius: 12,
              minHeight: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              fontSize: 14,
            }}
          >
            <Icon name="drop" size={18} color="var(--water)" />
            สั่งรดน้ำแปลงนี้
          </button>

          <button
            type="button"
            className="tap tap-ghost"
            onClick={() => setIsFertilizeModalOpen(true)}
            style={{
              border: "1.5px solid var(--laterite)",
              color: "var(--laterite)",
              background: "var(--laterite-soft)",
              borderRadius: 12,
              minHeight: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              fontSize: 14,
            }}
          >
            <Icon name="bag" size={18} color="var(--laterite)" />
            บันทึกใส่ปุ๋ย
          </button>
        </div>

        {advice ? <AdviceCard advice={advice} /> : null}

        <h2 className="section-title">บันทึกล่าสุด</h2>
        <div className="card">
          <Row label="ให้น้ำล่าสุด" value={plot.lastIrrigation} icon="drop" />
          <Row label="ใส่ปุ๋ยล่าสุด" value={plot.lastFertilizer} icon="bag" />
          <Row label="ภาพที่วิเคราะห์แล้ว" value={`${plot.photoCount} ภาพ`} icon="camera" />
        </div>

        <Link href={`/scan?plot=${plot.id}`} className="tap tap-primary" style={{ minHeight: 54 }}>
          <Icon name="camera" size={20} />
          ถ่ายรูปใบให้ AI ตรวจสอบแปลงนี้
        </Link>

        {/* 2-Step Human-in-the-Loop Irrigation Approval Modal */}
        {isIrrigateModalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(0,0,0,0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <div
              className="card"
              style={{
                width: "100%",
                maxWidth: 440,
                background: "var(--surface)",
                borderRadius: "var(--r-l)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 99,
                    background: "var(--water-soft)",
                    color: "var(--water)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="drop" size={20} />
                </span>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>อนุมัติการรดน้ำแปลง {plot.id}</h3>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>Human-in-the-Loop Approval</span>
                </div>
              </div>

              <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55, marginBottom: 14 }}>
                ความชื้นดินปัจจุบัน <strong>{plot.soilMoisture}%</strong> (เป้าหมาย {plot.soilMoistureTarget}%)
                ระบบจะส่งสัญญาณเปิดวาล์วน้ำโซน <strong>{plot.id}</strong> ตามระยะเวลาที่คุณกำหนด:
              </p>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>
                  ระยะเวลาให้น้ำ (นาที)
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setIrrigateMinutes(mins)}
                      style={{
                        flex: 1,
                        padding: "8px 0",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: irrigateMinutes === mins ? 700 : 400,
                        background: irrigateMinutes === mins ? "var(--water)" : "var(--surface-2)",
                        color: irrigateMinutes === mins ? "#fff" : "var(--ink)",
                        border: "1px solid var(--line-soft)",
                        cursor: "pointer",
                      }}
                    >
                      {mins} นาที
                    </button>
                  ))}
                </div>
              </div>

              <div className="guard" style={{ marginBottom: 16 }}>
                <Icon name="alert" size={15} color="var(--laterite)" />
                <span style={{ fontSize: 11.8 }}>
                  ระบบ IoT จะไม่สั่งเปิดปั๊มเองเด็ดขาดหากคุณไม่อนุมัติขั้นตอนที่ 2 นี้
                </span>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  className="tap tap-ghost"
                  onClick={() => setIsIrrigateModalOpen(false)}
                  style={{ flex: 1 }}
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  className="tap tap-primary"
                  onClick={handleConfirmIrrigation}
                  style={{ flex: 1, background: "var(--water)" }}
                >
                  ยืนยันเปิดวาล์วน้ำ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fertilizer Modal */}
        {isFertilizeModalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(0,0,0,0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <div
              className="card"
              style={{
                width: "100%",
                maxWidth: 440,
                background: "var(--surface)",
                borderRadius: "var(--r-l)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>
                บันทึกการใส่ปุ๋ยแปลง {plot.id}
              </h3>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>
                  สูตรปุ๋ยหรือชีวภัณฑ์ที่ใส่
                </label>
                <input
                  type="text"
                  value={fertilizerFormula}
                  onChange={(e) => setFertilizerFormula(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: 8,
                    border: "1px solid var(--line)",
                    background: "var(--surface-2)",
                    color: "var(--ink)",
                    fontSize: 13.5,
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  className="tap tap-ghost"
                  onClick={() => setIsFertilizeModalOpen(false)}
                  style={{ flex: 1 }}
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  className="tap tap-primary"
                  onClick={handleConfirmFertilizer}
                  style={{ flex: 1, background: "var(--laterite)" }}
                >
                  บันทึกลงแปลง
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 32, paddingBottom: 32 }}>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("คุณต้องการลบแปลงนี้ใช่หรือไม่?")) {
                deletePlot(plot.id);
                router.push("/plots");
              }
            }}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              border: "1px solid var(--crit)",
              background: "transparent",
              color: "var(--crit)",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            <Icon name="alert" size={16} color="var(--crit)" style={{ marginRight: 6 }} />
            ลบแปลงเพาะปลูกนี้
          </button>
        </div>
      </main>
    </>
  );
}

function Stat({ k, v, color }: { k: string; v: string; color?: string }) {
  return (
    <div className="stat">
      <span className="k">{k}</span>
      <span className="v" style={color ? { color } : undefined}>
        {v}
      </span>
    </div>
  );
}

function Row({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: "drop" | "bag" | "camera";
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
      <Icon name={icon} size={17} color="var(--muted)" />
      <span style={{ flex: 1, color: "var(--ink-2)" }}>{label}</span>
      <span className="num" style={{ fontWeight: 600 }}>
        {value}
      </span>
    </div>
  );
}
