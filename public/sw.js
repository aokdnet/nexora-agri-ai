/**
 * NEXORA AGRI AI — service worker
 *
 * เป้าหมายเดียวของไฟล์นี้: เกษตรกรที่อยู่กลางแปลงและไม่มีสัญญาณ
 * ต้องยังเปิดแอปได้ และเห็นข้อมูลที่เคยโหลดไว้แล้ว
 *
 * กลยุทธ์:
 * - หน้าเว็บ (navigate)  : network-first แล้ว fallback ไปหน้าที่แคชไว้
 *                          เพราะข้อมูลฟาร์มต้องสดที่สุดเท่าที่ทำได้
 * - ไฟล์ static/ฟอนต์     : cache-first เพราะไม่เปลี่ยนและมีขนาดใหญ่
 * - request ที่ไม่ใช่ GET : ปล่อยผ่าน ไม่แตะ (การส่งข้อมูลจัดการโดยคิวในแอป)
 *
 * เมื่อแก้ไฟล์นี้ ให้เพิ่มเลข VERSION เสมอ มิฉะนั้นผู้ใช้จะติดอยู่กับเวอร์ชันเก่า
 */

const VERSION = "v3";
const SHELL_CACHE = `nexora-shell-${VERSION}`;
const RUNTIME_CACHE = `nexora-runtime-${VERSION}`;

const SHELL_ASSETS = ["/", "/plots", "/scan", "/money", "/manifest.webmanifest", "/icons/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      // ถ้ามีสักไฟล์โหลดไม่ได้ addAll จะล้มทั้งชุด จึงใส่ทีละไฟล์แบบยอมพลาดได้
      .then((cache) => Promise.allSettled(SHELL_ASSETS.map((url) => cache.add(url))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== SHELL_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // หน้าเว็บ: เอาของสดก่อน ถ้าไม่ได้ค่อยใช้ของที่แคชไว้
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const home = await caches.match("/");
          if (home) return home;
          return new Response(
            "<h1>ออฟไลน์</h1><p>ยังไม่มีข้อมูลหน้านี้ในเครื่อง ลองเปิดใหม่เมื่อมีสัญญาณ</p>",
            { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 503 },
          );
        }),
    );
    return;
  }

  // ไฟล์ static: ใช้ของในเครื่องก่อนเพื่อประหยัดเน็ตของผู้ใช้
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.endsWith(".woff2")
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(request, copy));
            return response;
          }),
      ),
    );
  }
});
