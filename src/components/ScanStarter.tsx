"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "./Icon";
import { Chip, statusColor } from "./Chip";
import { DISEASE_PRESETS } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { cropAge } from "@/lib/format";
import { enqueue } from "@/lib/queue";

const REQUIRED_SHOTS = ["ใบด้านบน", "ใต้ใบ", "ทั้งต้น"];

export function ScanStarter({ initialPlotId }: { initialPlotId?: string }) {
  const router = useRouter();
  const { plots } = useAppStore();

  const [plotId, setPlotId] = useState(initialPlotId ?? plots[0]?.id ?? "A-02");
  const [selectedPreset, setSelectedPreset] = useState<string>("cassava-mosaic");
  const [captured, setCaptured] = useState<string[]>([]);
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const selectedPlot = plots.find((p) => p.id === plotId) || plots[0];

  const onCapture = (angle: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setCustomImagePreview(url);
    setCaptured((prev) => (prev.includes(angle) ? prev : [...prev, angle]));
  };

  const selectPresetCase = (presetId: string) => {
    setSelectedPreset(presetId);
    setCaptured(REQUIRED_SHOTS); // Auto complete shots for demo preset
  };

  const submit = () => {
    setIsAnalyzing(true);
    // Queue offline event
    enqueue("scan", `วิเคราะห์ภาพแปลง ${plotId}`, {
      plotId,
      presetId: selectedPreset,
      angles: captured,
      capturedAt: new Date().toISOString(),
    });

    setTimeout(() => {
      router.push(`/scan/result?plot=${plotId}&preset=${selectedPreset}`);
    }, 600);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Chip tone="info">
        <Icon name="pin" size={13} />
        เลือกแปลงก่อน เพื่อให้ภาพและผลวิเคราะห์ถูกเก็บเข้าประวัติแปลง
      </Chip>

      {/* Plots Selection List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {plots.map((plot) => (
          <button
            key={plot.id}
            type="button"
            className={plot.id === plotId ? "pick selected" : "pick"}
            onClick={() => {
              setPlotId(plot.id);
              // Auto-match crop preset if matches
              if (plot.crop === "มันสำปะหลัง") setSelectedPreset("cassava-mosaic");
              else if (plot.crop === "ข้าว") setSelectedPreset("rice-blast");
              else if (plot.crop === "ข้าวโพดหวาน") setSelectedPreset("corn-armyworm");
              else if (plot.crop === "ทุเรียน") setSelectedPreset("durian-canker");
            }}
            aria-pressed={plot.id === plotId}
          >
            <span className="radio" />
            <span style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
              <span style={{ display: "block", fontSize: 15, fontWeight: 600 }}>
                แปลง {plot.id} ({plot.crop} - {plot.variety})
              </span>
              <span style={{ display: "block", fontSize: 12.4, color: "var(--muted)" }}>
                {plot.rai} ไร่ · อายุ {cropAge(plot.ageDays)} · {plot.stage}
              </span>
            </span>
            <span className="num" style={{ fontWeight: 600, color: statusColor(plot.status) }}>
              สุขภาพ {plot.health}%
            </span>
          </button>
        ))}
      </div>

      {/* Preset Disease Case Gallery for immediate test */}
      <div className="card" style={{ background: "var(--surface-2)", border: "1.5px dashed var(--accent)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Icon name="sparkle" size={17} color="var(--accent)" />
          <h2 style={{ fontSize: 14.5, fontWeight: 700, margin: 0, color: "var(--accent)" }}>
            ชุดตัวอย่างโรคพืชไทย (ทดลองสแกนได้ทันที)
          </h2>
        </div>
        <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 12, lineHeight: 1.5 }}>
          แตะเลือกเคสตัวอย่างโรคพืชไทยเพื่อดูการทำงานของ AI Diagnostic Engine ได้ทันทีโดยไม่ต้องใช้ภาพจริง
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 }}>
          {DISEASE_PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => selectPresetCase(preset.id)}
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  textAlign: "left",
                  fontSize: 12,
                  fontWeight: isSelected ? 600 : 400,
                  background: isSelected ? "var(--surface)" : "var(--surface-3)",
                  border: isSelected ? "2px solid var(--accent)" : "1px solid var(--line-soft)",
                  color: isSelected ? "var(--ink)" : "var(--ink-2)",
                  boxShadow: isSelected ? "var(--shadow)" : "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 11, color: "var(--muted)" }}>พืช: {preset.crop}</span>
                <span style={{ fontWeight: 600, lineHeight: 1.3 }}>{preset.name}</span>
                <span
                  style={{
                    fontSize: 10.5,
                    color: preset.id === "healthy-crop" ? "var(--health)" : "var(--warn)",
                    marginTop: "auto",
                  }}
                >
                  {preset.id === "healthy-crop" ? "✓ สมบูรณ์" : `⚠️ กระทบ ~${preset.affectedAreaPct}%`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Camera Capture Angles */}
      <h3 className="eyebrow">หรือถ่ายภาพ 3 มุมจริงกลางแปลง</h3>
      <div className="shots">
        {REQUIRED_SHOTS.map((angle) => {
          const done = captured.includes(angle);
          return (
            <label key={angle} className={done ? "shot done" : "shot"}>
              <Icon name={done ? "check" : "camera"} size={20} />
              {angle}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={onCapture(angle)}
              />
            </label>
          );
        })}
      </div>

      {customImagePreview && (
        <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: "1px solid var(--line)" }}>
          <img
            src={customImagePreview}
            alt="ตัวอย่างภาพที่ถ่าย"
            style={{ width: "100%", maxHeight: 220, objectFit: "cover", display: "block" }}
          />
          <span
            style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              background: "rgba(0,0,0,0.7)",
              color: "#fff",
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 4,
            }}
          >
            ภาพจากกล้องคุณ
          </span>
        </div>
      )}

      <p style={{ fontSize: 12.4, color: "var(--muted)", lineHeight: 1.55 }}>
        💡 ใต้ใบสำคัญที่สุด เพราะสปอร์เชื้อราและแมลงหวี่ขาวมักอยู่ด้านล่าง — ถ่ายห่าง 1 ฝ่ามือและหลบเงาตัวเอง
      </p>

      {/* Submit Action */}
      <button
        type="button"
        className="tap tap-primary"
        onClick={submit}
        disabled={isAnalyzing}
        style={{
          minHeight: 56,
          fontSize: 16,
          background: isAnalyzing ? "var(--muted)" : "linear-gradient(135deg, var(--accent), #1E375B)",
        }}
      >
        <Icon name="sparkle" size={20} />
        {isAnalyzing ? "กำลังประมวลผลโมเดล AI..." : `ส่งภาพแปลง ${plotId} ให้ AI วิเคราะห์`}
      </button>
    </div>
  );
}
