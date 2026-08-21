import { TabBar } from "@/components/TabBar";

/**
 * เปลือกของฝั่งมือถือ
 *
 * จำกัดความกว้างไว้ที่ 520px แม้เปิดบนจอใหญ่ เพราะหน้าจอชุดนี้ออกแบบมา
 * สำหรับคนที่ยืนอยู่ในแปลง ไม่ใช่คนที่นั่งหน้าคอม — ฝั่งนั้นไปที่ /dashboard
 */
export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      {children}
      <TabBar />
    </div>
  );
}
