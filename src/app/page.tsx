import { LandingClient } from "./LandingClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEXORA AGRI AI - แพลตฟอร์มเกษตรอัจฉริยะ",
  description: "อนาคตของการเกษตรไทย จัดการฟาร์ม ลดต้นทุน เพิ่มผลผลิตด้วย AI",
};

export default function LandingPage() {
  return <LandingClient />;
}
