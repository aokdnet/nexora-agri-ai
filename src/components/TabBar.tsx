"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./Icon";

/**
 * ปลายทางของทั้งแอปมีแค่ 5 ที่
 *
 * ปุ่มไมค์อยู่ตรงกลางและอยู่ตำแหน่งเดิมทุกหน้า เพราะผู้ใช้กลุ่มเป้าหมาย
 * จำนวนมากพิมพ์ภาษาไทยบนมือถือไม่ถนัด เสียงจึงเป็นช่องทางหลัก ไม่ใช่ลูกเล่น
 */
const TABS: { href: string; label?: string; icon: IconName; center?: boolean }[] = [
  { href: "/", label: "วันนี้", icon: "sun" },
  { href: "/plots", label: "แปลง", icon: "map" },
  { href: "/ask", icon: "mic", center: true },
  { href: "/scan", label: "ถ่ายรูป", icon: "camera" },
  { href: "/money", label: "เงิน", icon: "coins" },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="tabbar" aria-label="เมนูหลัก">
      {TABS.map((tab) => {
        const active =
          tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={tab.center ? "center" : undefined}
            aria-current={active ? "page" : undefined}
            aria-label={tab.center ? "ถามด้วยเสียง" : undefined}
          >
            <Icon name={tab.icon} size={tab.center ? 30 : 18} />
            {tab.label ? <span>{tab.label}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
