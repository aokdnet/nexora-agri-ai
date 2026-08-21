"use client";

import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { Icon } from "@/components/Icon";
import { InstallPrompt } from "@/components/InstallPrompt";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { TaskCard } from "@/components/TaskCard";
import { FARM, WEATHER_WEEK } from "@/lib/data";
import { useAppStore } from "@/lib/store";

export function TodayClient() {
  const { tasks } = useAppStore();
  const today = WEATHER_WEEK[0];

  return (
    <>
      <header className="appbar">
        <BrandMark size={38} />
        <div className="appbar-title">
          <div className="hi">สวัสดีครับ</div>
          <div className="name">{FARM.ownerNickname}</div>
        </div>
        <OfflineIndicator />
      </header>

      <main className="page">
        <InstallPrompt />

        <h1 className="page-title">
          {tasks.length > 0 ? `วันนี้มี ${tasks.length} เรื่องต้องทำ` : "✓ วันนี้ไม่มีงานค้างแล้ว เยี่ยมมาก!"}
        </h1>

        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {tasks.length === 0 && (
          <div className="card card-soft" style={{ textAlign: "center", padding: "24px 16px" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 99,
                background: "var(--health-soft)",
                color: "var(--health)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <Icon name="check" size={24} />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px" }}>จัดการงานวันนี้ครบถ้วนแล้ว</h3>
            <p style={{ fontSize: 12.8, color: "var(--muted)" }}>
              ระบบ AI ยังคงเฝ้าระวังเซนเซอร์ความชื้นและสภาพอากาศให้คุณอย่างต่อเนื่อง
            </p>
          </div>
        )}

        <div className="weather-bar">
          <Icon name="cloud" size={22} color="var(--water)" />
          <div className="t">
            บ่ายนี้ <b>ฝน {today.rainChance}%</b> · {today.tempMax}° / {today.tempMin}° — เลื่อนงานที่ใช้รถไถออกไปก่อน
          </div>
        </div>

        <Link href="/dashboard" className="tap tap-ghost tap-sm" style={{ marginTop: 4 }}>
          <Icon name="grid" size={18} />
          ดูภาพรวมทั้งฟาร์ม (Command Center)
        </Link>
      </main>
    </>
  );
}
