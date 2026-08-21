import { Suspense } from "react";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ScanStarter } from "@/components/ScanStarter";
import { getPlot } from "@/lib/data";

export const metadata = { title: "ถ่ายรูปให้ AI ดู" };

export default async function ScanPage({
  searchParams,
}: {
  searchParams: Promise<{ plot?: string }>;
}) {
  const { plot } = await searchParams;
  const initial = plot && getPlot(plot) ? getPlot(plot)!.id : undefined;

  return (
    <>
      <header className="appbar">
        <div className="appbar-title">
          <div className="hi">AI Plant Doctor</div>
          <div className="name">วินิจฉัยโรคและแมลงศัตรูพืช</div>
        </div>
        <OfflineIndicator />
      </header>

      <main className="page">
        <Suspense fallback={<div className="card">กำลังเตรียมกล้องและชุดข้อมูล...</div>}>
          <ScanStarter initialPlotId={initial} />
        </Suspense>
      </main>
    </>
  );
}
