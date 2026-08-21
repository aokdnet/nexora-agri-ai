import Link from "next/link";
import { Icon } from "@/components/Icon";

export const metadata = { title: "ไม่พบหน้านี้" };

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 24,
        textAlign: "center",
      }}
    >
      <Icon name="map" size={40} color="var(--muted)" />
      <h1 className="serif" style={{ fontSize: 22 }}>
        ไม่พบหน้าที่คุณเปิด
      </h1>
      <p style={{ color: "var(--muted)", maxWidth: "40ch", lineHeight: 1.7 }}>
        อาจเป็นเพราะแปลงนี้ถูกลบไปแล้ว หรือลิงก์พิมพ์ผิด ลองกลับไปหน้าแรกแล้วเลือกจากรายการแปลงอีกครั้ง
      </p>
      <Link href="/farmer" className="tap tap-primary" style={{ maxWidth: 260 }}>
        กลับสู่หน้าหลัก
      </Link>
    </main>
  );
}
