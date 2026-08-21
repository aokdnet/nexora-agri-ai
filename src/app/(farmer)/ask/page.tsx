import { Icon } from "@/components/Icon";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { VoiceAsk } from "@/components/VoiceAsk";

export const metadata = { title: "ถามผู้ช่วย" };

/**
 * ผู้ช่วยเสียง
 *
 * Phase 1 รับคำถามและแสดงคำถามยอดฮิตให้กดได้ก่อน ยังไม่ต่อโมเดลจริง
 * ตำแหน่งของหน้านี้อยู่กลาง tab bar ตั้งแต่วันแรก เพราะถ้าย้ายทีหลัง
 * ผู้ใช้ที่ชินแล้วจะกดผิด — ตำแหน่งปุ่มคือสิ่งที่เปลี่ยนยากที่สุด
 */
export default function AskPage() {
  return (
    <>
      <header className="appbar">
        <span className="logo-mark">
          <Icon name="sparkle" size={19} />
        </span>
        <div className="appbar-title">
          <div className="hi">AI Farm Assistant</div>
          <div className="name">ถามเป็นภาษาไทยได้เลย</div>
        </div>
        <OfflineIndicator />
      </header>

      <main className="page">
        <VoiceAsk />
      </main>
    </>
  );
}
