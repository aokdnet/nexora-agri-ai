"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { PlotRow } from "@/components/PlotRow";
import { FARM } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import type { CropKind } from "@/lib/types";

export default function PlotsPage() {
  const { plots, addPlot } = useAppStore();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Plot Form State
  const [newCrop, setNewCrop] = useState<CropKind>("ข้าว");
  const [newVariety, setNewVariety] = useState("กข43");
  const [newRai, setNewRai] = useState<number>(5);
  const [newTargetMoisture, setNewTargetMoisture] = useState<number>(35);
  const [newStage, setNewStage] = useState("แตกกอ");
  const [newPh, setNewPh] = useState<number>(6.2);

  const totalRaiCount = plots.reduce((sum, p) => sum + p.rai, 0);

  const filteredPlots = plots.filter((plot) => {
    const matchesSearch =
      plot.id.toLowerCase().includes(search.toLowerCase()) ||
      plot.crop.toLowerCase().includes(search.toLowerCase()) ||
      plot.variety.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === "attention") return plot.status !== "ok";
    if (filterType === "healthy") return plot.status === "ok";
    if (filterType !== "all") return plot.crop === filterType;
    return true;
  });

  const attentionList = filteredPlots.filter((p) => p.status !== "ok");
  const healthyList = filteredPlots.filter((p) => p.status === "ok");

  const handleCreatePlot = (e: React.FormEvent) => {
    e.preventDefault();
    addPlot({
      crop: newCrop,
      variety: newVariety,
      rai: Number(newRai),
      health: 90,
      soilMoisture: Number(newTargetMoisture),
      soilMoistureTarget: Number(newTargetMoisture),
      ph: Number(newPh),
      ageDays: 30,
      stage: newStage,
      status: "ok",
      yieldForecast: newCrop === "ข้าว" ? "820 กก./ไร่" : newCrop === "มันสำปะหลัง" ? "3,200 กก./ไร่" : "1,200 กก./ไร่",
      costPerRai: 3500,
      profitPerRai: 4000,
    });
    setIsAddModalOpen(false);
  };

  return (
    <>
      <header className="appbar">
        <div className="appbar-title">
          <div className="hi">{FARM.name}</div>
          <div className="name">
            {plots.length} แปลง · {totalRaiCount} ไร่
          </div>
        </div>
        <OfflineIndicator />
      </header>

      <main className="page">
        {/* Top Controls: Search + Add Plot Button */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--surface)",
              padding: "8px 12px",
              borderRadius: "var(--r-m)",
              border: "1px solid var(--line)",
            }}
          >
            <Icon name="search" size={16} color="var(--muted)" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาแปลง, พืช, พันธุ์..."
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                width: "100%",
                fontSize: 13.5,
                color: "var(--ink)",
              }}
            />
          </div>

          <button
            type="button"
            className="tap tap-primary"
            onClick={() => setIsAddModalOpen(true)}
            style={{
              width: "auto",
              minHeight: 42,
              padding: "0 14px",
              fontSize: 13,
              borderRadius: "var(--r-m)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icon name="plus" size={16} />
            + เพิ่มแปลง
          </button>
        </div>

        {/* Filter Chips */}
        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            paddingBottom: 4,
            WebkitOverflowScrolling: "touch",
          }}
        >
          {[
            { id: "all", label: "ทั้งหมด" },
            { id: "attention", label: "⚠️ ต้องดูก่อน" },
            { id: "healthy", label: "✓ ปกติ" },
            { id: "ข้าว", label: "ข้าว" },
            { id: "มันสำปะหลัง", label: "มันสำปะหลัง" },
            { id: "ทุเรียน", label: "ทุเรียน" },
            { id: "อ้อย", label: "อ้อย" },
            { id: "ข้าวโพดหวาน", label: "ข้าวโพด" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              style={{
                whiteSpace: "nowrap",
                padding: "6px 12px",
                borderRadius: 99,
                fontSize: 12,
                fontWeight: filterType === tab.id ? 600 : 400,
                background: filterType === tab.id ? "var(--accent)" : "var(--surface)",
                color: filterType === tab.id ? "var(--accent-ink)" : "var(--muted)",
                border: filterType === tab.id ? "none" : "1px solid var(--line-soft)",
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Attention Plots Section */}
        {attentionList.length > 0 && (
          <>
            <h2 className="section-title">
              <Icon name="alert" size={15} color="var(--crit)" />
              ต้องดูแลก่อน ({attentionList.length})
            </h2>
            {attentionList.map((plot) => (
              <PlotRow key={plot.id} plot={plot} />
            ))}
          </>
        )}

        {/* Healthy Plots Section */}
        {healthyList.length > 0 && (
          <>
            <h2 className="section-title">
              <Icon name="check" size={15} color="var(--health)" />
              ปกติ ({healthyList.length})
            </h2>
            {healthyList.map((plot) => (
              <PlotRow key={plot.id} plot={plot} />
            ))}
          </>
        )}

        {filteredPlots.length === 0 && (
          <div className="card card-soft" style={{ textAlign: "center", padding: "30px 20px" }}>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>
              ไม่พบแปลงเพาะปลูกที่ตรงกับเงื่อนไขการค้นหา
            </p>
          </div>
        )}

        {/* ADD PLOT MODAL */}
        {isAddModalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(0,0,0,0.6)",
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
                maxWidth: 480,
                maxHeight: "90vh",
                overflowY: "auto",
                background: "var(--surface)",
                borderRadius: "var(--r-l)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                  borderBottom: "1px solid var(--line-soft)",
                  paddingBottom: 10,
                }}
              >
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>+ เพิ่มแปลงเพาะปลูกใหม่</h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ fontSize: 18, color: "var(--muted)", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreatePlot} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>
                    ชนิดพืช
                  </label>
                  <select
                    value={newCrop}
                    onChange={(e) => {
                      const c = e.target.value as CropKind;
                      setNewCrop(c);
                      if (c === "ข้าว") setNewVariety("กข43");
                      else if (c === "มันสำปะหลัง") setNewVariety("ระยอง 72");
                      else if (c === "ทุเรียน") setNewVariety("หมอนทอง");
                      else if (c === "อ้อย") setNewVariety("ขอนแก่น 3");
                      else if (c === "ข้าวโพดหวาน") setNewVariety("ไฮบริกซ์ 3");
                    }}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: 8,
                      border: "1px solid var(--line)",
                      background: "var(--surface-2)",
                      color: "var(--ink)",
                    }}
                  >
                    <option value="ข้าว">ข้าว</option>
                    <option value="มันสำปะหลัง">มันสำปะหลัง</option>
                    <option value="ทุเรียน">ทุเรียน</option>
                    <option value="อ้อย">อ้อย</option>
                    <option value="ข้าวโพดหวาน">ข้าวโพดหวาน</option>
                    <option value="ถั่วเขียว">ถั่วเขียว</option>
                    <option value="ผักสวนครัว">ผักสวนครัว</option>
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>
                      ชื่อสายพันธุ์
                    </label>
                    <input
                      type="text"
                      value={newVariety}
                      onChange={(e) => setNewVariety(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid var(--line)",
                        background: "var(--surface-2)",
                        color: "var(--ink)",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>
                      ขนาดพื้นที่ (ไร่)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={newRai}
                      onChange={(e) => setNewRai(Number(e.target.value))}
                      required
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid var(--line)",
                        background: "var(--surface-2)",
                        color: "var(--ink)",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>
                      ระยะการเติบโต
                    </label>
                    <input
                      type="text"
                      value={newStage}
                      onChange={(e) => setNewStage(e.target.value)}
                      placeholder="เช่น แตกกอ, สร้างหัว"
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid var(--line)",
                        background: "var(--surface-2)",
                        color: "var(--ink)",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>
                      ความชื้นเป้าหมาย (%)
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={90}
                      value={newTargetMoisture}
                      onChange={(e) => setNewTargetMoisture(Number(e.target.value))}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid var(--line)",
                        background: "var(--surface-2)",
                        color: "var(--ink)",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button
                    type="button"
                    className="tap tap-ghost"
                    onClick={() => setIsAddModalOpen(false)}
                    style={{ flex: 1 }}
                  >
                    ยกเลิก
                  </button>
                  <button type="submit" className="tap tap-primary" style={{ flex: 1 }}>
                    บันทึกแปลงใหม่
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
