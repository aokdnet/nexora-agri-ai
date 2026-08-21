"use client";

/**
 * คิวงานออฟไลน์
 *
 * กลางแปลงมักไม่มีสัญญาณ ทุกอย่างที่ผู้ใช้ "ทำ" (ถ่ายรูป, บันทึกค่าใช้จ่าย,
 * ตอบคำถาม triage) ต้องถูกเก็บลงเครื่องก่อนเสมอ แล้วค่อยส่งเมื่อกลับมาออนไลน์
 * ผู้ใช้ต้องเห็นเสมอว่ามีกี่รายการที่ยังไม่ได้ส่ง — ห้ามเงียบหาย
 *
 * ตอนนี้ใช้ localStorage เพื่อให้ Phase 1 เดินได้ก่อน
 * Phase 3 ค่อยย้ายไป IndexedDB + Background Sync API เมื่อต้องเก็บไฟล์ภาพจริง
 */

const KEY = "nexora.queue.v1";

export type QueuedKind = "scan" | "expense" | "triage" | "approval";

export interface QueuedItem {
  id: string;
  kind: QueuedKind;
  label: string;
  createdAt: number;
  payload: unknown;
}

function read(): QueuedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as QueuedItem[]) : [];
  } catch {
    // localStorage อาจถูกปิดในโหมดส่วนตัว — ไม่ควรทำให้แอปพัง
    return [];
  }
}

function write(items: QueuedItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("nexora:queue"));
  } catch {
    /* เต็มหรือถูกปิด — ข้ามไป */
  }
}

export function listQueue(): QueuedItem[] {
  return read();
}

export function queueCount(): number {
  return read().length;
}

export function enqueue(kind: QueuedKind, label: string, payload: unknown): QueuedItem {
  const item: QueuedItem = {
    id: `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    kind,
    label,
    createdAt: Date.now(),
    payload,
  };
  write([...read(), item]);
  return item;
}

export function dequeue(id: string): void {
  write(read().filter((i) => i.id !== id));
}

export function clearQueue(): void {
  write([]);
}

/**
 * พยายามส่งคิวทั้งหมด
 * ยังไม่มี backend จริง จึงจำลองว่าส่งสำเร็จเมื่อออนไลน์
 * เมื่อมี API แล้วให้แทน body ของ loop นี้ด้วย fetch จริง
 */
export async function flushQueue(): Promise<number> {
  if (typeof navigator !== "undefined" && !navigator.onLine) return 0;
  const items = read();
  let sent = 0;
  for (const item of items) {
    // TODO: แทนที่ด้วย await fetch(`/api/${item.kind}`, { method: "POST", body: ... })
    dequeue(item.id);
    sent += 1;
  }
  return sent;
}
