import { TodayClient } from "../TodayClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "วันนี้" };

export default function TodayPage() {
  return <TodayClient />;
}
