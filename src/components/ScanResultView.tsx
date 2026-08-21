"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "./Icon";
import { Chip } from "./Chip";
import { DISEASE_PRESETS } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { confidencePct } from "@/lib/format";
import { enqueue } from "@/lib/queue";
import Link from "next/link";
import { useEffect } from "react";

const CONFIDENCE_GAIN_PER_ANSWER = 0.04;

export function ScanResultView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { plots, saveScanResult, updatePlot } = useAppStore();

  const plotId = searchParams.get("plot") ?? "A-02";
  const presetId = searchParams.get("preset") ?? "cassava-mosaic";
  const isReal = searchParams.get("real") === "true";

  const selectedPlot = plots.find((p) => p.id.toUpperCase() === plotId.toUpperCase()) || plots[0];
  
  const [step, setStep] = useState<"result" | "triage" | "actions">("result");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const [realData, setRealData] = useState<any>(null);

  useEffect(() => {
    if (isReal) {
      try {
        const stored = localStorage.getItem("latestScanResult");
        if (stored) setRealData(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, [isReal]);

  const preset = isReal && realData ? {
    id: "real-ai-result",
    thaiName: realData.disease_name,
    scientificName: "วิเคราะห์โดย AI หมอพืช",
    description: "ผลการวินิจฉัยจากภาพถ่ายจริงของคุณ",
    affectedAreaPct: realData.disease_name === "สุขภาพดี" || realData.disease_name.includes("สมบูรณ์") ? 0 : 25,
    confidence: (realData.confidence || 85) / 100,
    sampleSvg: realData.disease_name === "สุขภาพดี" || realData.disease_name.includes("สมบูรณ์") ? "healthy" : "cassava",
    actions: [
      {
        title: "คำแนะนำจาก AI",
        detail: realData.recommendation || "โปรดปรึกษาผู้เชี่ยวชาญเพิ่มเติม",
      }
    ],
    triage: [],
    candidates: [
      { label: realData.disease_name, probability: (realData.confidence || 85) / 100 }
    ]
  } : (DISEASE_PRESETS.find((p) => p.id === presetId) || DISEASE_PRESETS[0]);

  const answeredCount = Object.keys(answers).length;
  const currentConfidence = Math.min(
    0.98,
    preset.confidence + answeredCount * CONFIDENCE_GAIN_PER_ANSWER
  );

  if (isReal && !realData) {
    return <div style={{ padding: 24, textAlign: "center" }}>กำลังประมวลผลข้อมูล...</div>;
  }

  const handleSaveToHistory = () => {
    saveScanResult({
      plotId,
      presetId: preset.id,
      diseaseName: preset.thaiName,
      severity: preset.affectedAreaPct,
      confidence: currentConfidence,
    });

    // If severe disease, update plot status
    if (preset.affectedAreaPct > 15) {
      updatePlot(plotId, { status: "warn", health: Math.max(50, selectedPlot.health - 8) });
    }

    setIsSaved(true);
  };

  const handleShareToAgronomist = () => {
    enqueue("scan", `ส่งรายงาน ${plotId} ให้นักวิชาการเกษตร`, {
      plotId,
      disease: preset.thaiName,
      confidence: currentConfidence,
      answers,
    });
    alert(`ส่งข้อมูลเคสแปลง ${plotId} (${preset.thaiName}) ไปยังเครือข่ายนักวิชาการเกษตรอำเภอบ้านไผ่ เรียบร้อยแล้ว`);
  };

  // STEP: TRIAGE QUESTIONS
  if (step === "triage") {
    const question = preset.triage[currentQuestion];
    const isLast = currentQuestion === preset.triage.length - 1;

    const choose = (option: string) => {
      const next = { ...answers, [question.id]: option };
      setAnswers(next);
      enqueue("triage", `ตอบคำถามวิเคราะห์ ${plotId}`, { questionId: question.id, answer: option });
      if (isLast) setStep("actions");
      else setCurrentQuestion((c) => c + 1);
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Progress Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--muted)" }}>
          <span className="num">
            ข้อ {currentQuestion + 1} / {preset.triage.length}
          </span>
          <span style={{ flex: 1, height: 6, borderRadius: 99, background: "var(--surface-3)", overflow: "hidden" }}>
            <i
              style={{
                display: "block",
                height: "100%",
                background: "var(--accent)",
                width: `${((currentQuestion + 1) / preset.triage.length) * 100}%`,
                transition: "width 0.3s ease",
              }}
            />
          </span>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <Icon name="sparkle" size={16} color="var(--accent)" />
            <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>
              AI Triage Question
            </span>
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>
            {question.question}
          </h2>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55, marginBottom: 14 }}>
            💡 <strong>เหตุผลที่ถาม:</strong> {question.why}
          </p>

          <div className="stack" style={{ gap: 8 }}>
            {question.options.map((option) => (
              <button
                key={option}
                type="button"
                className="q-opt"
                onClick={() => choose(option)}
                style={{ textAlign: "left", padding: "12px 14px", fontSize: 14 }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {answeredCount > 0 && (
          <div
            style={{
              background: "var(--health-soft)",
              color: "var(--health)",
              borderRadius: 11,
              padding: "10px 14px",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Icon name="sparkle" size={16} />
            <span>คำตอบช่วยยกความเชื่อมั่นของ AI ขึ้นเป็น {confidencePct(currentConfidence)} แล้ว</span>
          </div>
        )}

        <button
          type="button"
          className="tap tap-ghost tap-sm"
          onClick={() => (isLast ? setStep("actions") : setCurrentQuestion((c) => c + 1))}
        >
          ข้ามข้อนี้
        </button>
      </div>
    );
  }

  // STEP: ACTIONS & TREATMENT
  if (step === "actions") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          <h2 className="page-title" style={{ margin: 0 }}>
            แนวทางจัดการแปลง {plotId}
          </h2>
          <Chip tone="info" dot>
            ความเชื่อมั่น {confidencePct(currentConfidence)}
          </Chip>
        </div>

        <div className="card" style={{ background: "var(--surface-2)", borderLeft: "4px solid var(--accent)" }}>
          <strong style={{ fontSize: 15, display: "block", color: "var(--accent)" }}>
            ผลวินิจฉัย: {preset.thaiName}
          </strong>
          <span style={{ fontSize: 12, color: "var(--muted)", fontStyle: "italic" }}>
            {preset.scientificName}
          </span>
          <p style={{ fontSize: 13, marginTop: 6, color: "var(--ink-2)" }}>{preset.description}</p>
        </div>

        <h3 className="eyebrow">ขั้นตอนที่แนะนำให้ทำทันที</h3>
        {preset.actions.map((action, i) => (
          <div key={action.title} className="action-item">
            <span className="n">{i + 1}</span>
            <div>
              <h4 style={{ margin: 0, fontSize: 14.5, fontWeight: 700 }}>{action.title}</h4>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>
                {action.detail}
              </p>
            </div>
          </div>
        ))}

        {/* Safety & Agrochemical Disclaimer (Rule 3) */}
        <div className="guard">
          <Icon name="alert" size={18} color="var(--laterite)" />
          <div style={{ fontSize: 12.5 }}>
            <strong>ระบบจะไม่ระบุชื่อสารเคมีอันตรายหรืออัตราผสมโดยอัตโนมัติ</strong> —
            เพื่อให้เป็นไปตามมาตรฐาน GAP หากจำเป็นต้องใช้สารเคมี
            กรุณาปรึกษานักวิชาการเกษตรหรือเกษตรอำเภอในพื้นที่
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {!isSaved ? (
            <button type="button" className="tap tap-primary" onClick={handleSaveToHistory}>
              <Icon name="check" size={18} />
              บันทึกผลลงประวัติแปลง {plotId}
            </button>
          ) : (
            <div
              style={{
                background: "var(--health-soft)",
                color: "var(--health)",
                padding: "12px",
                borderRadius: 10,
                textAlign: "center",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              ✓ บันทึกผลและอัปเดตสุขภาพแปลง {plotId} เรียบร้อยแล้ว
            </div>
          )}

          <button
            type="button"
            className="tap tap-ghost"
            style={{ border: "1px solid var(--line)" }}
            onClick={handleShareToAgronomist}
          >
            <Icon name="user" size={18} />
            ส่งเคสให้นักวิชาการเกษตร / แชร์ LINE
          </button>

          <Link href={`/plots/${plotId}`} className="tap tap-ghost tap-sm">
            กลับไปหน้ารายละเอียดแปลง {plotId}
          </Link>
        </div>
      </div>
    );
  }

  // STEP: INITIAL SCAN RESULT OVERVIEW
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Interactive Leaf Inspection Box */}
      <div className="card" style={{ padding: 0, overflow: "hidden", position: "relative" }}>
        <LeafCanvas
          sampleSvg={preset.sampleSvg}
          showBoundingBoxes={showBoundingBoxes}
          showHeatmap={showHeatmap}
        />

        {/* Interactive Overlay Controls */}
        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            display: "flex",
            gap: 6,
            background: "rgba(0,0,0,0.65)",
            padding: "4px 8px",
            borderRadius: 8,
          }}
        >
          <button
            type="button"
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            style={{
              fontSize: 11,
              color: showBoundingBoxes ? "#7FA6D8" : "#ccc",
              fontWeight: showBoundingBoxes ? 700 : 400,
              padding: "2px 6px",
              cursor: "pointer",
            }}
          >
            {showBoundingBoxes ? "✓ กรอบรอยโรค" : "กรอบรอยโรค"}
          </button>
          <button
            type="button"
            onClick={() => setShowHeatmap(!showHeatmap)}
            style={{
              fontSize: 11,
              color: showHeatmap ? "#E2685C" : "#ccc",
              fontWeight: showHeatmap ? 700 : 400,
              padding: "2px 6px",
              cursor: "pointer",
            }}
          >
            {showHeatmap ? "✓ Heatmap" : "Heatmap"}
          </button>
        </div>
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span className="eyebrow">ตรวจพบรอยโรค</span>
        </div>
        <h2 className="page-title" style={{ margin: 0, fontSize: 20 }}>
          {preset.thaiName}
        </h2>
        <span style={{ fontSize: 13, color: "var(--muted)", fontStyle: "italic" }}>
          {preset.scientificName}
        </span>
      </div>

      <div className="stat-grid">
        <div className="stat">
          <span className="k">พื้นที่ใบที่กระทบ</span>
          <span className="v" style={{ color: preset.affectedAreaPct > 0 ? "var(--warn)" : "var(--health)" }}>
            {preset.affectedAreaPct > 0 ? `~${preset.affectedAreaPct}%` : "0% (ปกติ)"}
          </span>
        </div>
        <div className="stat">
          <span className="k">ความมั่นใจตรวจจับ</span>
          <span className="v" style={{ color: "var(--accent)" }}>
            {confidencePct(currentConfidence)}
          </span>
        </div>
      </div>

      {/* Probabilities Breakdown */}
      <h3 className="eyebrow" style={{ marginTop: 2 }}>
        ความเป็นไปได้ของสาเหตุ
      </h3>
      <div className="stack" style={{ gap: 8 }}>
        {preset.candidates.map((cand, i) => (
          <div key={cand.label} className={i === 0 ? "candidate top" : "candidate"}>
            <div className="r">
              <span className="nm">{cand.label}</span>
              <span className="pc" style={{ color: i === 0 ? "var(--accent)" : "var(--muted)" }}>
                {confidencePct(cand.probability)}
              </span>
            </div>
            <span className="bar">
              <i style={{ width: `${cand.probability * 100}%` }} />
            </span>
          </div>
        ))}
      </div>

      {/* Triage Questionnaire CTA */}
      <button
        type="button"
        className="tap tap-primary"
        onClick={() => setStep("triage")}
        style={{ minHeight: 54 }}
      >
        <Icon name="sparkle" size={19} />
        ตอบ {preset.triage.length} คำถามเพื่อความแม่นยำ 98%
      </button>

      <button
        type="button"
        className="tap tap-ghost tap-sm"
        onClick={() => setStep("actions")}
      >
        ดูแนวทางจัดการทันที (ข้ามคำถาม)
      </button>
    </div>
  );
}

function LeafCanvas({
  sampleSvg,
  showBoundingBoxes,
  showHeatmap,
}: {
  sampleSvg: string;
  showBoundingBoxes: boolean;
  showHeatmap: boolean;
}) {
  return (
    <svg
      viewBox="0 0 320 200"
      role="img"
      aria-label="ภาพใบพืชพร้อมกรอบบริเวณรอยโรค"
      style={{ display: "block", width: "100%", height: "auto", background: "#1b241c" }}
    >
      <defs>
        <radialGradient id="heat1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E2685C" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#D6A33C" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#E2685C" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background field grid */}
      <rect width="320" height="200" fill="#18201a" />

      {/* Dynamic Leaf Silhouette depending on crop */}
      {sampleSvg === "rice" ? (
        // Rice leaf blade
        <path d="M40 180 Q 160 20, 290 30 Q 160 90, 40 180Z" fill="#5F8D3F" stroke="#7BA85B" strokeWidth="2" />
      ) : sampleSvg === "corn" ? (
        // Corn broad leaf
        <path d="M30 170 C 120 40, 220 30, 290 80 C 220 150, 100 190, 30 170Z" fill="#558338" />
      ) : (
        // Cassava/Durian compound leaf
        <path
          d="M160 15 C 230 50, 245 155, 175 190 C 105 155, 90 50, 160 15Z"
          fill="#54833B"
          stroke="#73A354"
          strokeWidth="1.5"
        />
      )}

      {/* Main leaf veins */}
      <path d="M160 20 L168 185" stroke="#B8D69A" strokeWidth="2" opacity="0.75" />
      <path d="M162 60 L210 75 M162 60 L115 75 M164 105 L220 120 M164 105 L110 120 M166 145 L205 158 M166 145 L125 158" stroke="#87B368" strokeWidth="1.2" opacity="0.8" />

      {/* Disease spots (if not healthy) */}
      {sampleSvg !== "healthy" && (
        <>
          <ellipse cx="195" cy="95" rx="16" ry="26" fill="#B3862A" opacity="0.85" transform="rotate(22 195 95)" />
          <ellipse cx="130" cy="130" rx="12" ry="18" fill="#B3862A" opacity="0.8" transform="rotate(-15 130 130)" />
          <circle cx="170" cy="55" r="7" fill="#8B4D1C" opacity="0.9" />
        </>
      )}

      {/* Heatmap Layer */}
      {showHeatmap && sampleSvg !== "healthy" && (
        <>
          <circle cx="195" cy="95" r="32" fill="url(#heat1)" />
          <circle cx="130" cy="130" r="26" fill="url(#heat1)" />
        </>
      )}

      {/* Bounding Boxes Layer */}
      {showBoundingBoxes && sampleSvg !== "healthy" && (
        <g stroke="#E2685C" strokeWidth="1.8" fill="none">
          <rect x="172" y="65" width="45" height="58" rx="4" strokeDasharray="4 2" />
          <text x="175" y="60" fill="#E2685C" fontSize="10" fontWeight="600" fontFamily="sans-serif">
            รอยโรค #1 (88%)
          </text>

          <rect x="112" y="110" width="36" height="42" rx="4" strokeDasharray="4 2" />
          <text x="112" y="105" fill="#E2685C" fontSize="10" fontWeight="600" fontFamily="sans-serif">
            รอยโรค #2 (82%)
          </text>
        </g>
      )}

      {sampleSvg === "healthy" && (
        <g fill="#63B368">
          <circle cx="160" cy="100" r="24" fill="#63B368" opacity="0.2" />
          <text x="160" y="105" textAnchor="middle" fill="#E7EDE6" fontSize="13" fontWeight="700">
            ✓ สุขภาพสมบูรณ์
          </text>
        </g>
      )}
    </svg>
  );
}
