"use client";

import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { FarmMap } from "@/components/FarmMap";
import { Icon } from "@/components/Icon";
import {
  FARM,
  SEASON,
  WEATHER_ALERT,
  WEATHER_WEEK,
} from "@/lib/data";
import { deltaPct, num, thb, thaiDate, thbShort } from "@/lib/format";
import { useAppStore } from "@/lib/store";

export function DashboardClient() {
  const { plots, customCosts } = useAppStore();

  const totalRai = plots.reduce((sum, p) => sum + p.rai, 0);
  const weightedHealth = totalRai > 0
    ? Math.round((plots.reduce((sum, p) => sum + p.health * p.rai, 0) / totalRai) * 10) / 10
    : 0;
  const averageMoisture = totalRai > 0
    ? Math.round(plots.reduce((sum, p) => sum + p.soilMoisture * p.rai, 0) / totalRai)
    : 0;

  const alerts = plots.filter((p) => p.status !== "ok");
  const cost = customCosts.reduce((sum, c) => sum + c.amount, 0);
  const net = SEASON.revenue - cost;
  const maxCost = Math.max(...customCosts.map((c) => c.amount), 1);
  const dryPlots = plots.filter((p) => p.soilMoisture < p.soilMoistureTarget).length;
  const profitPerRai = totalRai > 0 ? Math.round(net / totalRai) : 0;

  return (
    <main className="dash">
      <header className="dash-head">
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <BrandMark size={40} />
          <div>
            <h1 style={{ fontSize: 22 }}>
              {FARM.name} — วันนี้มี {alerts.length + 1} เรื่องต้องตัดสินใจ
            </h1>
            <p style={{ marginTop: 4 }}>
              {FARM.district} · {FARM.province} · สรุปจากอากาศ ความชื้นดิน ภาพถ่ายล่าสุด ต้นทุนสะสม และราคาตลาด
            </p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="eyebrow">ข้อมูลล่าสุด</div>
          <div className="num">{thaiDate()} · 06:40</div>
          <Link href="/farmer" className="chip chip-info" style={{ marginTop: 6, display: "inline-flex", textDecoration: "none" }}>
            <Icon name="chevron" size={13} />
            เปิดหน้าจอเกษตรกร (Field View)
          </Link>
        </div>
      </header>

      {/* KPI Section */}
      <section className="kpis" aria-label="ตัวชี้วัดรวม">
        <article className="kpi">
          <span className="eyebrow">แปลงเพาะปลูก</span>
          <span className="v">
            {plots.length}
            <small>แปลง</small>
          </span>
          <span className="foot">
            รวม <span className="num">{totalRai}</span> ไร่
          </span>
        </article>

        <article className="kpi">
          <span className="eyebrow">สุขภาพพืชเฉลี่ย</span>
          <span className="v" style={{ color: "var(--health)" }}>
            {weightedHealth.toFixed(0)}
            <small>%</small>
          </span>
          <span className="meter">
            <i style={{ width: `${weightedHealth}%`, background: "var(--health)" }} />
          </span>
          <span className="foot">ถ่วงน้ำหนักตามพื้นที่แปลงจริง</span>
        </article>

        <article className="kpi">
          <span className="eyebrow">ความชื้นดินเฉลี่ย</span>
          <span className="v" style={{ color: "var(--water)" }}>
            {averageMoisture}
            <small>%</small>
          </span>
          <span className="meter">
            <i style={{ width: `${averageMoisture}%`, background: "var(--water)" }} />
          </span>
          <span className="foot">{dryPlots} แปลงต่ำกว่าเป้าหมาย</span>
        </article>

        <article className="kpi alerting">
          <span className="eyebrow">เรื่องที่ต้องตัดสินใจ</span>
          <span className="v" style={{ color: "var(--crit)" }}>
            {alerts.length + 1}
          </span>
          <span className="foot" style={{ color: "var(--crit)" }}>
            <Icon name="alert" size={13} />
            {alerts.filter((p) => p.status === "crit").length} เร่งด่วน ·{" "}
            {alerts.filter((p) => p.status === "warn").length + 1} เฝ้าระวัง
          </span>
        </article>

        <article className="kpi">
          <span className="eyebrow">ผลผลิตคาดการณ์</span>
          <span className="v">
            {num(SEASON.yieldPerRai)}
            <small>กก./ไร่</small>
          </span>
          <span className="foot">
            ช่วง <span className="num">780–850</span> · ความเชื่อมั่น 71%
          </span>
        </article>

        <article className="kpi">
          <span className="eyebrow">กำไรฤดูกาลนี้</span>
          <span className="v" style={{ color: "var(--laterite)" }}>
            {thbShort(net)}
          </span>
          <span className="foot">
            {thb(profitPerRai)}/ไร่ · {deltaPct(profitPerRai, SEASON.previousProfitPerRai)} เทียบฤดูก่อน
          </span>
        </article>
      </section>

      <div className="dash-grid">
        <FarmMap />

        <section className="panel">
          <div className="panel-head">
            <Icon name="cloud" size={18} color="var(--water)" />
            <h2>Weather Intelligence</h2>
            <span className="sub">
              พิกัดจริงแปลง · {FARM.lat}°N, {FARM.lon}°E
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0,1fr))" }}>
            {WEATHER_WEEK.map((day) => (
              <div
                key={day.label}
                style={{
                  padding: "12px 6px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                  alignItems: "center",
                  background: day.risk ? "var(--warn-soft)" : undefined,
                  borderRight: "1px solid var(--line-soft)",
                }}
              >
                <span style={{ fontSize: 11, color: "var(--muted)" }}>{day.label}</span>
                <Icon
                  name={day.icon === "sun" ? "thermo" : day.icon === "alert" ? "alert" : "cloud"}
                  size={20}
                  color={day.icon === "cloud" ? "var(--water)" : "var(--warn)"}
                />
                <span className="num" style={{ fontSize: 13, fontWeight: 600 }}>
                  {day.tempMax}°/{day.tempMin}°
                </span>
                <span className="num" style={{ fontSize: 10.5, color: "var(--water)", fontWeight: 600 }}>
                  ฝน {day.rainChance}%
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              padding: "13px 16px",
              background: "var(--warn-soft)",
              borderTop: "1px solid var(--line-soft)",
            }}
          >
            <Icon name="alert" size={19} color="var(--warn)" />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 13.4, fontWeight: 600, color: "var(--warn)" }}>
                {WEATHER_ALERT.headline}
              </h3>
              <p style={{ fontSize: 12.7, color: "var(--ink-2)", marginTop: 3, lineHeight: 1.55 }}>
                กระทบ {WEATHER_ALERT.affectedPlotIds.length} แปลง — {WEATHER_ALERT.detail}
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-head">
          <Icon name="coins" size={18} color="var(--laterite)" />
          <h2>กำไรต่อไร่และโครงสร้างการเงิน</h2>
          <span className="sub">
            {SEASON.seasonLabel} · รวม {totalRai} ไร่
          </span>
        </div>
        <div className="panel-body">
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 24 }}>
            <div>
              <h3 className="eyebrow" style={{ marginBottom: 10 }}>
                โครงสร้างต้นทุน
              </h3>
              <div className="stack" style={{ gap: 9 }}>
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
            </div>

            <div className="stack" style={{ gap: 10 }}>
              <BigLine label="รายได้รวม" value={thb(SEASON.revenue)} />
              <BigLine label="ต้นทุนรวม" value={thb(cost)} color="var(--laterite)" />
              <BigLine label="กำไรสุทธิ" value={thb(net)} color="var(--health)" />

              <h3 className="eyebrow" style={{ marginTop: 4 }}>
                เฉลี่ยต่อไร่ ({totalRai} ไร่)
              </h3>
              <div className="stat-grid">
                <div className="stat">
                  <span className="k">ต้นทุน/ไร่</span>
                  <span className="v">{thb(totalRai > 0 ? Math.round(cost / totalRai) : 0)}</span>
                </div>
                <div className="stat">
                  <span className="k">รายได้/ไร่</span>
                  <span className="v">{thb(totalRai > 0 ? Math.round(SEASON.revenue / totalRai) : 0)}</span>
                </div>
                <div className="stat">
                  <span className="k">กำไร/ไร่</span>
                  <span className="v" style={{ color: "var(--health)" }}>
                    {thb(profitPerRai)}
                  </span>
                </div>
                <div className="stat">
                  <span className="k">ผลผลิต/ไร่</span>
                  <span className="v">{num(SEASON.yieldPerRai)} กก.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.7, maxWidth: "80ch", marginTop: 8 }}>
        🔒 ข้อมูลวิเคราะห์ทั้งหมดเชื่อมโยงกับเซนเซอร์ IoT และโมเดลสภาพอากาศรายชั่วโมง · การควบคุมปั๊มและวาล์วทุกครั้งต้องผ่านการอนุมัติของผู้ใช้ (Human-in-the-Loop) เพื่อความปลอดภัยสูงสุด
      </p>
    </main>
  );
}

function BigLine({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 10,
        paddingBottom: 9,
        borderBottom: "1px solid var(--line-soft)",
      }}
    >
      <span style={{ fontSize: 12.8, color: "var(--muted)" }}>{label}</span>
      <span className="num" style={{ fontSize: 21, fontWeight: 600, color }}>
        {value}
      </span>
    </div>
  );
}
