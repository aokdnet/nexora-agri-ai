"use client";

import { useEffect } from "react";

/**
 * ลงทะเบียน service worker
 *
 * ลงทะเบียนเฉพาะ production เพราะตอน dev การแคชจะทำให้แก้โค้ดแล้วไม่เห็นผล
 * และเป็นสาเหตุอันดับหนึ่งของ "ทำไมแก้แล้วไม่เปลี่ยน" ตอนพัฒนา PWA
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* ลงทะเบียนไม่ได้ก็ให้แอปทำงานต่อแบบออนไลน์ปกติ */
      });
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register);

    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
