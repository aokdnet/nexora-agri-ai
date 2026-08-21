"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Icon } from "./Icon";

export function NavigationBanner() {
  const pathname = usePathname();
  const { subscription, iotMode, setIotMode } = useAppStore();
  const [collapsed, setCollapsed] = useState(false);

  const isFarmerRoute = !pathname.startsWith("/dashboard") && !pathname.startsWith("/pricing") && pathname !== "/";
  const isDashboard = pathname.startsWith("/dashboard");
  const isPricing = pathname.startsWith("/pricing");
  const isLanding = pathname === "/";

  if (collapsed) {
    return (
      <aside aria-label="แถบควบคุมมุมมองและจำลองระบบ" style={{ position: "fixed", top: 12, right: 12, zIndex: 999 }}>
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="tap tap-ghost tap-sm"
          style={{
            background: "var(--surface)",
            boxShadow: "var(--shadow)",
            borderRadius: 999,
            padding: "6px 14px",
            fontSize: 12,
            border: "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Icon name="sparkle" size={14} color="var(--accent)" />
          <span style={{ fontWeight: 600 }}>โหมดสลับมุมมอง</span>
          <span style={{ fontSize: 10, color: "var(--muted)" }}>▼</span>
        </button>
      </aside>
    );
  }

  return (
    <aside
      aria-label="แถบควบคุมมุมมองและจำลองระบบ"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 900,
        background: "var(--surface)",
        borderBottom: "1px solid var(--line-soft)",
        padding: "6px 14px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
            fontWeight: 600,
            color: "var(--accent)",
            background: "var(--accent-soft)",
            padding: "3px 9px",
            borderRadius: 99,
          }}
        >
          <Icon name="sparkle" size={13} />
          {subscription.tierName}
        </span>

        {/* View switcher links */}
        <div style={{ display: "flex", background: "var(--surface-2)", borderRadius: 8, padding: 2, gap: 2 }}>
          <Link
            href="/"
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: isLanding ? 600 : 400,
              color: isLanding ? "var(--ink)" : "var(--muted)",
              background: isLanding ? "var(--surface)" : "transparent",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            🏠 หน้าแรก
          </Link>
          <Link
            href="/farmer"
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: isFarmerRoute ? 600 : 400,
              color: isFarmerRoute ? "var(--ink)" : "var(--muted)",
              background: isFarmerRoute ? "var(--surface)" : "transparent",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            📱 จอมือถือเกษตรกร
          </Link>
          <Link
            href="/dashboard"
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: isDashboard ? 600 : 400,
              color: isDashboard ? "var(--ink)" : "var(--muted)",
              background: isDashboard ? "var(--surface)" : "transparent",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            🖥️ จอผู้จัดการฟาร์ม
          </Link>
          <Link
            href="/pricing"
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: isPricing ? 600 : 400,
              color: isPricing ? "var(--ink)" : "var(--muted)",
              background: isPricing ? "var(--surface)" : "transparent",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            💎 แพ็กเกจราคา
          </Link>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* IoT Mode Simulator */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "var(--muted)" }}>
          <span>จำลองเซนเซอร์:</span>
          <select
            value={iotMode}
            onChange={(e) => setIotMode(e.target.value as any)}
            style={{
              fontSize: 11.5,
              padding: "3px 6px",
              borderRadius: 6,
              background: "var(--surface-2)",
              border: "1px solid var(--line)",
              color: "var(--ink)",
              cursor: "pointer",
            }}
          >
            <option value="normal">⛅ ปกติ (ความชื้น 35%)</option>
            <option value="rain">🌧️ ฝนตก (+15% ชื้น)</option>
            <option value="drought">☀️ แล้ง (-12% แห้ง)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => setCollapsed(true)}
          title="ย่อแถบนี้"
          style={{
            padding: "4px 8px",
            fontSize: 11,
            color: "var(--muted)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ✕ ซ่อน
        </button>
      </div>
    </aside>
  );
}
