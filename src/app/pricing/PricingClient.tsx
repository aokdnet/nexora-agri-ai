"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { Icon } from "@/components/Icon";
import { PricingCard } from "@/components/PricingCard";
import { FEATURE_MATRIX, PRICING_TIERS } from "@/lib/data";
import { num } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import type { FeatureAvailability, PricingTier } from "@/lib/types";

const FAQ: { q: string; a: string }[] = [
  {
    q: "ทดลองใช้ 30 วัน ต้องผูกบัตรเครดิตไหม",
    a: "ไม่ต้องครับ กดเริ่มทดลองใช้ได้ทันที ใช้งานได้ครบทุกฟีเจอร์ของแพ็กเกจที่เลือกตลอด 30 วัน หมดเวลาแล้วระบบจะแจ้งก่อนเสมอ ไม่มีการตัดเงินอัตโนมัติหากยังไม่ได้เลือกวิธีชำระเงิน",
  },
  {
    q: "นับ \"แปลง\" ยังไง ถ้าที่ดินแปลงเดียวปลูกพืชหลายชนิด",
    a: "นับตามพื้นที่ที่คุณแบ่งไว้ในระบบ (1 พื้นที่ = 1 แปลง) ไม่ใช่ตามโฉนด ถ้าแปลงเดิมปลูกพืชสลับกันตามฤดู ยังนับเป็น 1 แปลงเหมือนเดิม",
  },
  {
    q: "เปลี่ยนแพ็กเกจภายหลังได้ไหม",
    a: "ได้ครับ อัปเกรดหรือดาวน์เกรดได้ทุกเมื่อ ระบบจะคิดเงินตามสัดส่วนวันที่ใช้งานจริงในรอบบิลนั้น",
  },
  {
    q: "ยกเลิกแล้วข้อมูลฟาร์มจะหายไหม",
    a: "ข้อมูลแปลง ภาพถ่าย และประวัติทั้งหมดยังอยู่ในระบบ 90 วันหลังยกเลิก ดาวน์โหลดออกเป็นไฟล์ Excel ได้ตลอดช่วงนี้ก่อนข้อมูลจะถูกลบถาวร",
  },
  {
    q: "แพ็กเกจ FREE ใช้ได้จำกัดแค่ไหน",
    a: "ใช้ได้ตลอดไปไม่มีวันหมดอายุ จำกัดที่ 1 แปลง (สูงสุด 10 ไร่) และวิเคราะห์รูปภาพได้ 3 ครั้งต่อเดือน เหมาะสำหรับลองระบบก่อนตัดสินใจอัปเกรด",
  },
  {
    q: "Smart Farm ควบคุมปั๊มน้ำให้อัตโนมัติเลยหรือเปล่า",
    a: "ไม่ครับ ระบบจะวิเคราะห์และเสนอคำแนะนำพร้อมเหตุผลเสมอ แต่การเปิดปั๊มหรือวาล์วทุกครั้งต้องมีคนกดอนุมัติก่อน (Human-in-the-Loop) เพื่อความปลอดภัยของแปลงคุณ",
  },
];

function AvailabilityMark({ value }: { value: FeatureAvailability }) {
  if (value === "yes") return <Icon name="check" size={16} color="var(--health)" label="มีให้ใช้" />;
  if (value === "add-on")
    return (
      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--laterite)" }}>+เสริม</span>
    );
  return (
    <span aria-label="ไม่มีในแพ็กเกจนี้" style={{ color: "var(--line)" }}>
      —
    </span>
  );
}

export function PricingClient() {
  const { subscription, upgradeSubscription } = useAppStore();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  const handleSelectTier = async (tier: PricingTier) => {
    setSelectedTier(tier);

    // If Free or Enterprise, handle locally (no payment)
    if (tier.id === "free" || tier.id === "enterprise") {
      upgradeSubscription(tier.id as any, billingCycle);
      setIsPaymentSuccess(true);
      setIsCheckoutOpen(true); // Show success screen
      return;
    }

    // Call Stripe Checkout API
    try {
      const price = billingCycle === "annual" 
        ? Math.round((tier.priceMin || 0) * 12 * 0.8) 
        : (tier.priceMin || 0);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tierId: tier.id,
          name: tier.name,
          price: price,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      } else {
        alert(data.error || "Failed to initiate checkout");
      }
    } catch (err) {
      console.error(err);
      alert("Error starting checkout");
    }
  };

  const handleConfirmPayment = () => {
    if (!selectedTier) return;
    const tierKey =
      selectedTier.id === "free"
        ? "free"
        : selectedTier.id === "pro"
        ? "pro"
        : selectedTier.id === "smart"
        ? "smart"
        : "enterprise";

    upgradeSubscription(tierKey, billingCycle);
    setIsPaymentSuccess(true);
  };

  const calculateAmount = () => {
    if (!selectedTier || !selectedTier.priceMin) return 0;
    return billingCycle === "annual"
      ? Math.round(selectedTier.priceMin * 12 * 0.8)
      : selectedTier.priceMin;
  };

  return (
    <>
      <nav className="market-nav">
        <BrandMark size={34} />
        <span className="name">NEXORA AGRI AI</span>
        <span style={{ flex: 1 }} />
        <Link href="/farmer" className="tap tap-ghost tap-sm" style={{ width: "auto", padding: "0 16px" }}>
          เข้าสู่แอป
        </Link>
      </nav>

      <main className="market-shell">
        <section className="price-hero">
          <span className="trial-banner">
            <Icon name="clock" size={15} />
            ทดลองฟรี 30 วัน ทุกแพ็กเกจ ไม่ต้องผูกบัตรเครดิต
          </span>
          <h1>ราคาที่เกษตรกรไทยจับต้องได้จริง</h1>
          <p className="lede">
            เริ่มต้นฟรี 1 แปลง แล้วอัปเกรดเมื่อฟาร์มของคุณเติบโต — ทุกแพ็กเกจทดลองใช้ได้ 30 วัน
            เต็มรูปแบบ ยกเลิกได้ทุกเมื่อ ไม่มีสัญญาผูกมัด
          </p>

          {/* Billing Cycle Switcher */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--surface)",
              padding: "4px",
              borderRadius: 999,
              border: "1px solid var(--line)",
              boxShadow: "var(--shadow)",
              marginTop: 16,
            }}
          >
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              style={{
                padding: "8px 18px",
                borderRadius: 999,
                fontSize: 13.5,
                fontWeight: billingCycle === "monthly" ? 700 : 400,
                background: billingCycle === "monthly" ? "var(--accent)" : "transparent",
                color: billingCycle === "monthly" ? "var(--accent-ink)" : "var(--muted)",
                border: "none",
                cursor: "pointer",
              }}
            >
              ชำระรายเดือน
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              style={{
                padding: "8px 18px",
                borderRadius: 999,
                fontSize: 13.5,
                fontWeight: billingCycle === "annual" ? 700 : 400,
                background: billingCycle === "annual" ? "var(--accent)" : "transparent",
                color: billingCycle === "annual" ? "var(--accent-ink)" : "var(--muted)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>ชำระรายปี</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#fff",
                  background: "var(--laterite)",
                  padding: "2px 6px",
                  borderRadius: 99,
                }}
              >
                ประหยัด 20%
              </span>
            </button>
          </div>
        </section>

        {/* Pricing Tiers Grid */}
        <section className="pricing-grid" aria-label="แพ็กเกจทั้งหมด">
          {PRICING_TIERS.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              billingCycle={billingCycle}
              onSelect={handleSelectTier}
            />
          ))}
        </section>

        {/* Feature Comparison Table */}
        <section aria-labelledby="compare-heading" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <h2 id="compare-heading" className="serif" style={{ fontSize: 20 }}>
              เทียบสิทธิ์การใช้งานแบบละเอียด
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 4 }}>
              12 เครื่องมือหลักของ NEXORA AGRI AI สำหรับเกษตรกรยุคดิจิทัล
            </p>
          </div>

          <div className="compare-scroll">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">เครื่องมือและฟีเจอร์</th>
                  {PRICING_TIERS.map((tier) => (
                    <th key={tier.id} scope="col" className={tier.featured ? "featured-col" : undefined}>
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_MATRIX.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" style={{ fontWeight: 500 }}>
                      {row.label}
                    </th>
                    {row.availability.map((value, i) => (
                      <td key={PRICING_TIERS[i].id}>
                        <AvailabilityMark value={value} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section aria-labelledby="faq-heading" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h2 id="faq-heading" className="serif" style={{ fontSize: 20 }}>
            คำถามที่พบบ่อย (FAQ)
          </h2>
          <div className="faq-grid">
            {FAQ.map((item) => (
              <details key={item.q} className="faq-item">
                <summary>
                  {item.q}
                  <Icon name="close" size={16} className="plus" />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Contact Enterprise */}
        <section id="contact" className="contact-block">
          <span className="icon-wrap">
            <Icon name="user" size={22} />
          </span>
          <div className="body">
            <h3>สหกรณ์ สมาคมเกษตรกร หรือองค์กรขนาดใหญ่</h3>
            <p>
              ทีมผู้เชี่ยวชาญจะช่วยประเมินการวางระบบ IoT เชื่อมเซนเซอร์สถานีอากาศ และจัดอบรมเกษตรกรสมาชิกในพื้นที่
              ติดต่อสายด่วน: 02-888-AGRI (2474) หรือ LINE: @nexora-agri
            </p>
          </div>
          <span className="chip chip-plain">ฝ่ายบริการองค์กร</span>
        </section>

        {/* PROMPTPAY CHECKOUT MODAL */}
        {isCheckoutOpen && selectedTier && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99999,
              background: "rgba(0,0,0,0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <div
              className="card"
              style={{
                width: "100%",
                maxWidth: 460,
                background: "var(--surface)",
                borderRadius: "var(--r-l)",
                boxShadow: "0 15px 50px rgba(0,0,0,0.35)",
              }}
            >
              {!isPaymentSuccess ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: "1px solid var(--line-soft)",
                      paddingBottom: 10,
                      marginBottom: 14,
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>
                        ชำระเงินแพ็กเกจ {selectedTier.name}
                      </h3>
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>
                        รอบบิล: {billingCycle === "annual" ? "รายปี (ประหยัด 20%)" : "รายเดือน"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCheckoutOpen(false)}
                      style={{ fontSize: 18, color: "var(--muted)", cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Price Summary */}
                  <div
                    style={{
                      background: "var(--surface-2)",
                      padding: "12px 16px",
                      borderRadius: 10,
                      marginBottom: 14,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12.5, color: "var(--muted)" }}>ยอดที่ต้องชำระ</div>
                      <div className="num" style={{ fontSize: 24, fontWeight: 700, color: "var(--accent)" }}>
                        ฿{num(calculateAmount())}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: "center", padding: "16px 8px" }}>
                    <div style={{ marginBottom: 16 }}>
                      กำลังพาดำเนินการไปยังระบบชำระเงินของ Stripe...
                    </div>
                  </div>
                </>
              ) : (
                /* Celebration Confirmation Screen */
                <div style={{ textAlign: "center", padding: "16px 8px" }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 99,
                      background: "var(--health-soft)",
                      color: "var(--health)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Icon name="check" size={30} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>
                    อัปเกรดแพ็กเกจ {selectedTier.name} สำเร็จ!
                  </h3>
                  <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6, marginBottom: 18 }}>
                    ระบบเปิดสิทธิ์การใช้งานฟีเจอร์ AI ครบวงจรสำหรับฟาร์มของคุณเรียบร้อยแล้ว
                    สามารถกลับเข้าสู่หน้าจอแปลงและทดลองใช้งานได้ทันที
                  </p>

                  <Link href="/farmer" className="tap tap-primary" onClick={() => setIsCheckoutOpen(false)}>
                    เริ่มใช้งานฟาร์ม
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
