import Link from "next/link";
import { Suspense } from "react";
import { Icon } from "@/components/Icon";
import { ScanResultView } from "@/components/ScanResultView";

export const metadata = { title: "ผลวิเคราะห์โรคพืช" };

export default async function ScanResultPage({
  searchParams,
}: {
  searchParams: Promise<{ plot?: string; preset?: string }>;
}) {
  const { plot } = await searchParams;
  const plotId = plot ?? "A-02";

  return (
    <>
      <header className="appbar">
        <Link href="/scan" className="back-btn" aria-label="กลับไปหน้าถ่ายรูป">
          <Icon name="chevron" size={17} className="flip" />
        </Link>
        <div className="appbar-title">
          <div className="hi">แปลง {plotId}</div>
          <div className="name">AI Plant Doctor</div>
        </div>
        <span className="chip chip-plain num">AI Vision v2</span>
      </header>

      <main className="page">
        <Suspense fallback={<div className="card">กำลังโหลดผลวิเคราะห์...</div>}>
          <ScanResultView />
        </Suspense>
      </main>
    </>
  );
}
