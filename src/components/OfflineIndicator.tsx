"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { flushQueue, queueCount } from "@/lib/queue";

/**
 * บอกสถานะการเชื่อมต่อและจำนวนงานที่ยังไม่ได้ส่ง
 *
 * ผู้ใช้ต้องเห็นเสมอว่างานที่เพิ่งทำไป "ยังอยู่" แม้เน็ตหลุด
 * ความเงียบคือสิ่งที่ทำให้คนไม่เชื่อใจแอปและเลิกใช้
 */
export function OfflineIndicator() {
  const [online, setOnline] = useState(true);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const sync = () => setPending(queueCount());
    const goOnline = () => {
      setOnline(true);
      void flushQueue().then(sync);
    };
    const goOffline = () => setOnline(false);

    setOnline(navigator.onLine);
    sync();

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    window.addEventListener("nexora:queue", sync);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("nexora:queue", sync);
    };
  }, []);

  if (online && pending === 0) return null;

  if (!online) {
    return (
      <span className="offline-pill">
        <Icon name="wifi-off" size={12} />
        ออฟไลน์{pending > 0 ? ` · รอส่ง ${pending}` : ""}
      </span>
    );
  }

  return (
    <span className="offline-pill">
      <Icon name="clock" size={12} />
      รอส่ง {pending}
    </span>
  );
}
