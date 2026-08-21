/**
 * มาร์กแบรนด์ NEXORA AGRI AI — ต้นกล้าข้าว 3 ใบแทงขึ้นจากคันดิน
 *
 * ใช้ไฟล์เดียวกับที่ rasterize เป็นไอคอนแอป (public/icons/logo-mark.svg)
 * เพื่อให้โลโก้ในหน้าเว็บกับไอคอนบนหน้าจอโฮมเป็นมาร์กเดียวกันเป๊ะ ๆ
 *
 * ไม่ใช้กับไอคอน UI ทั่วไป (เช่น sparkle แทนผู้ช่วย AI) — ใช้เฉพาะจุดที่สื่อ
 * ตัวตนแบรนด์จริง ๆ เช่น หัวแอปหน้าแรกและแถบนำทางของหน้าการตลาด
 */
export function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.26,
        overflow: "hidden",
        flex: "none",
        display: "block",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/logo-mark.svg"
        alt="NEXORA AGRI AI"
        width={size}
        height={size}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </span>
  );
}
