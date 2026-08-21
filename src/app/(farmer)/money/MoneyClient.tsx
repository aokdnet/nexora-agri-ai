"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { MARKET_PRICES, SEASON } from "@/lib/data";
import { deltaPct, num, thb } from "@/lib/format";
import { useAppStore } from "@/lib/store";

export function MoneyClient() {
  const { plots, customCosts, addCost } = useAppStore();

  const totalRai = plots.reduce((sum, p) => sum + p.rai, 0);
  const cost = customCosts.reduce((sum, c) => sum + c.amount, 0);
  const net = SEASON.revenue - cost;
  const profitPerRai = totalRai > 0 ? Math.round(net / totalRai) : 0;
  const maxCost = Math.max(...customCosts.map((c) => c.amount), 1);

  // New Expense Modal State
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expenseLabel, setExpenseLabel] = useState("ค่าปุ๋ยชีวภาพเพิ่มเติม");
  const [expenseAmount, setExpenseAmount] = useState<number>(3500);

  // Profit Simulator State
  const [simCrop, setSimCrop] = useState<string>("ข้าว");
  const [simRai, setSimRai] = useState<number>(10);
  const [simYield, setSimYield] = useState<number>(850);
  const [simPrice, setSimPrice] = useState<number>(15.4);
  const [simFertilizerCost, setSimFertilizerCost] = useState<number>(1400);
  const [simLaborCost, setSimLaborCost] = useState<number>(1800);

  // Simulator Calculations
  const simRevenuePerRai = simYield * simPrice;
  const simCostPerRai = simFertilizerCost + simLaborCost;
  const simProfitPerRai = simRevenuePerRai - simCostPerRai;
  const simTotalProfit = simProfitPerRai * simRai;
  const simBreakEvenYield = simPrice > 0 ? Math.round(simCostPerRai / simPrice) : 0;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseLabel || expenseAmount <= 0) return;
    addCost(expenseLabel, Number(expenseAmount));
    setIsAddExpenseOpen(false);
  };

  const handleCropPresetChange = (crop: string) => {
    setSimCrop(crop);
    if (crop === "ข้าว") {
      setSimYield(850);
      setSimPrice(15.4);
      setSimFertilizerCost(1400);
      setSimLaborCost(1800);
    } else if (crop === "มันสำปะหลัง") {
      setSimYield(3500);
      setSimPrice(3.15);
      setSimFertilizerCost(1600);
      setSimLaborCost(2200);
    } else if (crop === "ข้าวโพดเลี้ยงสัตว์") {
      setSimYield(1200);
      setSimPrice(10.8);
      setSimFertilizerCost(1800);
      setSimLaborCost(2100);
    } else if (crop === "ทุเรียน") {
      setSimYield(1400);
      setSimPrice(165);
      setSimFertilizerCost(8500);
      setSimLaborCost(9500);
    }
  };

  return (
    <>
      <header className="appbar">
        <div className="appbar-title">
          <div className="hi">{SEASON.seasonLabel}</div>
          <div className="name">รวม {totalRai} ไร่ (12 แปลง)</div>
        </div>
        <OfflineIndicator />
      </header>

      <main className="page">
        {/* Money Hero KPI */}
        <section className="money-hero">
          <span className="k">กำไรสุทธิต่อไร่เฉลี่ย</span>
          <span className="v">{thb(profitPerRai)}</span>
          <span className="d">
            ฤดูก่อน {thb(SEASON.previousProfitPerRai)} ·{" "}
            <b>{deltaPct(profitPerRai, SEASON.previousProfitPerRai)} เทียบฤดูก่อน</b>
          </span>
        </section>

        <div className="stat-grid">
          <Stat k="รายได้รวม" v={thb(SEASON.revenue)} />
          <Stat k="ต้นทุนรวม" v={thb(cost)} color="var(--laterite)" />
          <Stat k="กำไรสุทธิ" v={thb(net)} color="var(--health)" />
          <Stat k="ผลผลิต/ไร่" v={`${num(SEASON.yieldPerRai)} กก.`} />
        </div>

        {/* Live Agricultural Market Prices Ticker */}
        <div style={{ marginTop: 4 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <h2 className="section-title" style={{ margin: 0 }}>
              <Icon name="coins" size={16} color="var(--accent)" />
              ราคาตลาดกลางสินค้าเกษตรไทย (Live)
            </h2>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>อัปเดตวันนี้ 08:30 น.</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: 8,
            }}
          >
            {MARKET_PRICES.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "var(--surface)",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid var(--line-soft)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <span style={{ fontSize: 11.5, color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.name}
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span className="num" style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)" }}>
                    {item.price > 1000 ? num(item.price) : item.price.toFixed(2)}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{item.unit}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                  <span
                    style={{
                      fontWeight: 600,
                      color: item.trend === "up" ? "var(--health)" : item.trend === "down" ? "var(--crit)" : "var(--muted)",
                    }}
                  >
                    {item.trend === "up" ? `▲ +${item.change}` : item.trend === "down" ? `▼ ${item.change}` : "— คงที่"}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--muted)" }}>({item.source})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Profit Simulator (ROI Calculator) */}
        <section
          className="card"
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--accent)",
            boxShadow: "var(--shadow)",
            marginTop: 4,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Icon name="sparkle" size={18} color="var(--accent)" />
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "var(--accent)" }}>
              เครื่องจำลองคำนวณกำไรต่อไร่ (ROI Simulator)
            </h2>
          </div>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 12, lineHeight: 1.5 }}>
            ปรับตัวเลขผลผลิต ราคาขาย และต้นทุนเพื่อวางแผนเพาะปลูกในฤดูกาลถัดไป
          </p>

          {/* Crop Selector */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto" }}>
            {["ข้าว", "มันสำปะหลัง", "ข้าวโพดเลี้ยงสัตว์", "ทุเรียน"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleCropPresetChange(c)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 99,
                  fontSize: 12,
                  fontWeight: simCrop === c ? 700 : 400,
                  background: simCrop === c ? "var(--accent)" : "var(--surface-2)",
                  color: simCrop === c ? "var(--accent-ink)" : "var(--ink)",
                  border: "1px solid var(--line-soft)",
                  cursor: "pointer",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Simulator Inputs Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 11.5, color: "var(--muted)", marginBottom: 3 }}>
                ผลผลิต (กก./ไร่)
              </label>
              <input
                type="number"
                value={simYield}
                onChange={(e) => setSimYield(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid var(--line)",
                  background: "var(--surface-2)",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11.5, color: "var(--muted)", marginBottom: 3 }}>
                ราคาขาย (บาท/กก.)
              </label>
              <input
                type="number"
                step="0.05"
                value={simPrice}
                onChange={(e) => setSimPrice(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid var(--line)",
                  background: "var(--surface-2)",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11.5, color: "var(--muted)", marginBottom: 3 }}>
                ค่าปุ๋ย/ยา (บาท/ไร่)
              </label>
              <input
                type="number"
                value={simFertilizerCost}
                onChange={(e) => setSimFertilizerCost(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid var(--line)",
                  background: "var(--surface-2)",
                  fontSize: 14,
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11.5, color: "var(--muted)", marginBottom: 3 }}>
                ค่าแรง/ไถ (บาท/ไร่)
              </label>
              <input
                type="number"
                value={simLaborCost}
                onChange={(e) => setSimLaborCost(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid var(--line)",
                  background: "var(--surface-2)",
                  fontSize: 14,
                }}
              />
            </div>
          </div>

          {/* Simulator Result Box */}
          <div
            style={{
              background: simProfitPerRai >= 0 ? "var(--health-soft)" : "var(--crit-soft)",
              padding: "14px",
              borderRadius: 10,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
                กำไรคาดการณ์/ไร่:
              </span>
              <span
                className="num"
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: simProfitPerRai >= 0 ? "var(--health)" : "var(--crit)",
                }}
              >
                {thb(simProfitPerRai)}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-2)" }}>
              <span>รายได้ {thb(Math.round(simRevenuePerRai))}/ไร่</span>
              <span>ต้นทุน {thb(simCostPerRai)}/ไร่</span>
            </div>

            <div style={{ fontSize: 11.5, color: "var(--muted)", borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 4 }}>
              💡 จุดคุ้มทุน: ต้องได้ผลผลิตไม่ต่ำกว่า <strong>{simBreakEvenYield} กก./ไร่</strong> ถึงจะไม่ขาดทุน
            </div>
          </div>
        </section>

        {/* Cost Breakdown & Add Expense Button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
          <h2 className="section-title" style={{ margin: 0 }}>โครงสร้างค่าใช้จ่ายในฟาร์ม</h2>
          <button
            type="button"
            onClick={() => setIsAddExpenseOpen(true)}
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--accent)",
              background: "var(--accent-soft)",
              padding: "4px 10px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            + บันทึกค่าใช้จ่าย
          </button>
        </div>

        <div className="stack" style={{ gap: 8 }}>
          {customCosts.map((line) => (
            <div key={line.label} className="cost-row">
              <span>{line.label}</span>
              <span className="cost-track">
                <i style={{ width: `${(line.amount / maxCost) * 100}%` }} />
              </span>
              <span className="cost-amt">{num(line.amount)}</span>
            </div>
          ))}
        </div>

        <div className="card card-soft" style={{ marginTop: 4 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>AI สรุปจุดประหยัดต้นทุน</h3>
          <p className="task-why">
            แปลง A-02 ใช้ปุ๋ยมากกว่า A-01 อยู่ 9% แต่ได้ผลผลิตน้อยกว่า 14% — ต้นเหตุคือ pH ดิน 5.2
            ทำให้พืชดูดฟอสฟอรัสได้ไม่เต็มที่ แนะนำใส่โดโลไมท์ปรับดินแทนการเพิ่มปุ๋ยเคมี ประหยัดได้ ~฿850/ไร่
          </p>
        </div>

        {/* ADD EXPENSE MODAL */}
        {isAddExpenseOpen && (
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
                maxWidth: 420,
                background: "var(--surface)",
                borderRadius: "var(--r-l)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 14px" }}>+ บันทึกค่าใช้จ่ายแปลงใหม่</h3>

              <form onSubmit={handleAddExpense} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>
                    รายการค่าใช้จ่าย
                  </label>
                  <input
                    type="text"
                    value={expenseLabel}
                    onChange={(e) => setExpenseLabel(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: 8,
                      border: "1px solid var(--line)",
                      background: "var(--surface-2)",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>
                    จำนวนเงิน (บาท)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: 8,
                      border: "1px solid var(--line)",
                      background: "var(--surface-2)",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <button
                    type="button"
                    className="tap tap-ghost"
                    onClick={() => setIsAddExpenseOpen(false)}
                    style={{ flex: 1 }}
                  >
                    ยกเลิก
                  </button>
                  <button type="submit" className="tap tap-primary" style={{ flex: 1 }}>
                    บันทึก
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
