/**
 * การจัดรูปแบบตัวเลขและวันที่แบบไทย
 *
 * ใช้ locale "th-TH" ทุกที่ แต่บังคับ latin digits (๑๒๓ อ่านยากบนหน้าจอเล็ก
 * และผู้ใช้กลุ่มเป้าหมายคุ้นกับเลขอารบิกมากกว่า)
 */

const BAHT = new Intl.NumberFormat("th-TH-u-nu-latn", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

const PLAIN = new Intl.NumberFormat("th-TH-u-nu-latn", { maximumFractionDigits: 0 });

/** ฿624,000 */
export function thb(amount: number): string {
  return BAHT.format(amount);
}

/** ย่อเป็น ฿428K สำหรับ KPI ที่พื้นที่จำกัด */
export function thbShort(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) return `฿${(amount / 1_000_000).toFixed(1)}M`;
  if (Math.abs(amount) >= 1_000) return `฿${Math.round(amount / 1_000)}K`;
  return thb(amount);
}

/** 3,547 */
export function num(value: number): string {
  return PLAIN.format(value);
}

/** 84% */
export function pct(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`;
}

/** 0.73 -> 73% */
export function confidencePct(value: number): string {
  return `${Math.round(value * 100)}%`;
}

/** อายุพืชเป็นภาษาที่คนอ่านแล้วเข้าใจทันที */
export function cropAge(days: number): string {
  if (days >= 365) {
    const years = Math.floor(days / 365);
    return `${years} ปี`;
  }
  return `${num(days)} วัน`;
}

/** 21 ส.ค. 2568 — พ.ศ. เพราะผู้ใช้ไทยอ่าน ค.ศ. แล้วต้องแปลงในหัว */
export function thaiDate(date: Date = new Date()): string {
  const months = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
}

/** 06:40 */
export function clock(date: Date = new Date()): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** เปลี่ยนแปลงเทียบฐาน เช่น +19% */
export function deltaPct(current: number, previous: number): string {
  if (previous === 0) return "—";
  const change = ((current - previous) / previous) * 100;
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toFixed(0)}%`;
}
