import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans_Thai, Noto_Serif_Thai } from "next/font/google";
import { Sprite } from "@/components/Icon";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

/**
 * คู่ฟอนต์ของแบรนด์
 * - Noto Serif Thai  : หัวเรื่อง ให้น้ำหนักแบบสิ่งพิมพ์ ไม่ใช่หน้าตา SaaS ทั่วไป
 * - IBM Plex Sans Thai: ตัวเนื้อหาและ UI อ่านง่ายบนจอเล็กกลางแดด
 * - IBM Plex Mono     : ตัวเลขล้วน เพื่อให้หลักตรงกันเวลาเทียบค่าเป็นคอลัมน์
 *
 * ตั้งใจเลี่ยง Kanit/Prompt ที่กลายเป็นค่าเริ่มต้นของงาน Thai SaaS ไปแล้ว
 */
const sansThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-thai",
  display: "swap",
});

const serifThai = Noto_Serif_Thai({
  subsets: ["thai", "latin"],
  weight: ["600", "700"],
  variable: "--font-serif-thai",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NEXORA AGRI AI",
    template: "%s · NEXORA AGRI AI",
  },
  description: "ผู้ช่วยเกษตรกร ตั้งแต่ดินจนถึงตลาด",
  manifest: "/manifest.webmanifest",
  applicationName: "NEXORA AGRI",
  appleWebApp: {
    capable: true,
    title: "NEXORA AGRI",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // ห้ามใส่ maximumScale หรือ userScalable: false
  // ผู้ใช้กลุ่มเป้าหมายจำนวนหนึ่งสายตายาว การซูมคือสิ่งจำเป็น ไม่ใช่ทางเลือก
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#edf0ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1311" },
  ],
};

import { AppStoreProvider } from "@/lib/store";
import { NavigationBanner } from "@/components/NavigationBanner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${sansThai.variable} ${serifThai.variable} ${mono.variable}`}>
      <body>
        <AppStoreProvider>
          <Sprite />
          <ServiceWorkerRegister />
          <NavigationBanner />
          {children}
        </AppStoreProvider>
      </body>
    </html>
  );
}

