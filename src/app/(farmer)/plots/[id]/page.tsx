import { notFound } from "next/navigation";
import { PLOTS, getPlot } from "@/lib/data";
import { PlotDetailClient } from "./PlotDetailClient";

export function generateStaticParams() {
  return PLOTS.map((plot) => ({ id: plot.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plot = getPlot(id);
  return { title: plot ? `แปลง ${plot.id} ${plot.crop}` : "ไม่พบแปลง" };
}

export default async function PlotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plot = getPlot(id);
  if (!plot) notFound();

  return <PlotDetailClient initialPlot={plot} />;
}
