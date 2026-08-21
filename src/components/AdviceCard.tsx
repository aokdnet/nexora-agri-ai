"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { confidencePct } from "@/lib/format";
import { enqueue } from "@/lib/queue";
import type { AiAdvice } from "@/lib/types";

/**
 * คำแนะนำของ AI พร้อมประตูอนุมัติ
 *
 * ข้อกำหนดของโครงการ (ห้ามแก้โดยไม่คุยกันก่อน):
 * 1. ต้องแสดงระดับความมั่นใจเสมอ ห้ามนำเสนอเป็นคำตอบที่แน่นอน
 * 2. ต้องกางเหตุผลให้ดูได้ ผู้ใช้มีสิทธิ์รู้ว่าระบบคิดจากอะไร
 * 3. ปุ่มปฏิเสธต้องเด่นพอ ๆ กับปุ่มรับ ไม่ออกแบบให้หลอกกดตาม
 * 4. ระบบไม่สั่งการอุปกรณ์เอง คนต้องกดยืนยันทุกครั้ง
 */
export function AdviceCard({ advice }: { advice: AiAdvice }) {
  const [decision, setDecision] = useState<"accepted" | "declined" | null>(null);

  const decide = (choice: "accepted" | "declined") => {
    setDecision(choice);
    enqueue("approval", `${advice.plotId} · ${choice === "accepted" ? "รับคำแนะนำ" : "ทำต่างจากคำแนะนำ"}`, {
      adviceId: advice.id,
      plotId: advice.plotId,
      choice,
      decidedAt: new Date().toISOString(),
    });
  };

  return (
    <section className="advice">
      <h2 className="advice-title">{advice.title}</h2>
      <p className="advice-body">{advice.body}</p>

      <div className="confidence">
        <span>ความมั่นใจ</span>
        <span className="confidence-track">
          <i style={{ width: `${Math.round(advice.confidence * 100)}%` }} />
        </span>
        <span className="num">{confidencePct(advice.confidence)}</span>
      </div>

      <details className="why">
        <summary>ทำไมถึงแนะนำแบบนี้</summary>
        <ul>
          {advice.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </details>

      {decision === null ? (
        <div className="tap-row">
          <button type="button" className="tap tap-primary" onClick={() => decide("accepted")}>
            <Icon name="check" size={19} />
            {advice.acceptLabel}
          </button>
          <button type="button" className="tap tap-ghost" onClick={() => decide("declined")}>
            {advice.declineLabel}
          </button>
        </div>
      ) : (
        <div className="tap tap-done">
          <Icon name="check" size={19} />
          {decision === "accepted" ? "บันทึกแล้ว · จะเตือนอีกครั้ง 15:00 น." : "บันทึกว่าคุณเลือกทำต่างจากคำแนะนำ"}
        </div>
      )}

      {advice.requiresApproval ? (
        <div className="guard">
          <Icon name="alert" size={16} color="var(--laterite)" />
          <div>
            ระบบจะไม่เปิดปั๊มหรือวาล์วเองโดยอัตโนมัติ ทุกครั้งต้องมีคนกดยืนยันก่อนเสมอ
          </div>
        </div>
      ) : null}
    </section>
  );
}
