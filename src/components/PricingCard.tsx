"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { num } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import type { PricingTier } from "@/lib/types";

export function PricingCard({
  tier,
  billingCycle = "monthly",
  onSelect,
}: {
  tier: PricingTier;
  billingCycle?: "monthly" | "annual";
  onSelect?: (tier: PricingTier) => void;
}) {
  const { subscription } = useAppStore();
  const isCurrentPlan = subscription.tierId === tier.id;

  const rawPrice = tier.priceMin;
  const displayPrice =
    rawPrice === undefined
      ? undefined
      : rawPrice === 0
      ? 0
      : billingCycle === "annual"
      ? Math.round(rawPrice * 12 * 0.8)
      : rawPrice;

  const unitLabel = billingCycle === "annual" ? "/ปี" : "/เดือน";

  return (
    <article className={tier.featured ? "price-card featured" : "price-card"}>
      {tier.featured ? <span className="badge">แนะนำมากที่สุด</span> : null}

      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="tier-name">{tier.name}</div>
          {isCurrentPlan && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--health)",
                background: "var(--health-soft)",
                padding: "2px 8px",
                borderRadius: 99,
              }}
            >
              แพ็กเกจปัจจุบัน
            </span>
          )}
        </div>
        <p className="tier-tagline">{tier.tagline}</p>
      </div>

      <div className="price-row">
        {displayPrice === undefined ? (
          <span className="price-talk">ติดต่อฝ่ายขาย</span>
        ) : displayPrice === 0 ? (
          <>
            <span className="price-amount">฿0</span>
            <span className="price-unit">{unitLabel}</span>
          </>
        ) : (
          <>
            <span className="price-amount">
              ฿{num(displayPrice)}
              {tier.priceOpenEnded ? "+" : ""}
            </span>
            <span className="price-unit">{unitLabel}</span>
          </>
        )}
      </div>
      <p className="price-note">
        {billingCycle === "annual" && rawPrice && rawPrice > 0
          ? `(ประหยัด 20% จากราคาปกติ ฿${num(rawPrice * 12)})`
          : tier.priceNote}
      </p>

      {tier.hasTrial ? (
        <span className="trial-tag">
          <Icon name="clock" size={12} />
          ทดลองฟรี 30 วัน
        </span>
      ) : (
        <span className="trial-tag" style={{ visibility: "hidden" }}>
          spacer
        </span>
      )}

      <ul className="feature-list">
        {tier.features.map((feature) => (
          <li key={feature}>
            <Icon name="check" size={15} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={tier.featured ? "tap tap-primary" : "tap tap-ghost"}
        onClick={() => onSelect?.(tier)}
        style={{ width: "100%", cursor: "pointer" }}
      >
        {isCurrentPlan ? "แพ็กเกจที่กำลังใช้งาน" : tier.ctaLabel}
      </button>
    </article>
  );
}
