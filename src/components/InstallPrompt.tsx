"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * ชวนติดตั้งลงหน้าจอหลัก
 *
 * ตั้งใจไม่ใช้ Play Store ในเฟสแรก เพราะผู้ใช้กลุ่มเป้าหมายจำนวนมาก
 * ไม่มีบัญชี Google ที่ใช้งานได้ หรือเครื่องเต็มจนติดตั้งแอปใหม่ไม่ได้
 * PWA เปิดจากลิงก์ที่ส่งทาง LINE ได้ทันที
 */
export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!deferred || dismissed) return null;

  const install = async () => {
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  return (
    <div className="install-bar">
      <Icon name="download" size={20} color="var(--accent)" />
      <div className="t">
        ติดตั้งลงหน้าจอหลัก เปิดใช้ได้เร็วขึ้นและใช้ได้แม้สัญญาณไม่ดี
      </div>
      <button type="button" onClick={install}>
        ติดตั้ง
      </button>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="ปิดคำแนะนำการติดตั้ง"
        style={{ background: "transparent", color: "var(--muted)", minHeight: 42, padding: "0 4px" }}
      >
        <Icon name="close" size={18} />
      </button>
    </div>
  );
}
