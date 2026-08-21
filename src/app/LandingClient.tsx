"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { Icon } from "@/components/Icon";

const VALUE_PROPS = [
  {
    title: "🌱 ตรวจโรคพืชแม่นยำด้วย AI",
    description: "วิเคราะห์ภาพถ่ายใบไม้ ระบุโรคและศัตรูพืช พร้อมแนะนำการรักษาก่อนโรคลุกลาม",
    color: "var(--health)",
    bg: "var(--health-soft)",
  },
  {
    title: "💧 ลดต้นทุน เพิ่มผลกำไร",
    description: "ระบบคำนวณปริมาณน้ำและปุ๋ยที่พอดีกับความต้องการพืช ช่วยประหยัดค่าใช้จ่ายหลักหมื่นต่อปี",
    color: "var(--water)",
    bg: "var(--water-soft)",
  },
  {
    title: "📈 จัดการฟาร์มครบวงจร",
    description: "บันทึกรายรับ-รายจ่าย คาดการณ์ผลผลิตล่วงหน้า พร้อมดูราคาตลาดกลางอัปเดตรายวัน",
    color: "var(--warn)",
    bg: "var(--warn-soft)",
  },
  {
    title: "🤝 ใช้งานง่ายสุดๆ",
    description: "ออกแบบมาเพื่อเกษตรกรไทยโดยเฉพาะ หน้าตาแอปเรียบง่าย พร้อมผู้ช่วย AI สั่งงานด้วยเสียงได้",
    color: "var(--laterite)",
    bg: "var(--laterite-soft)",
  },
];

export function LandingClient() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <style>{`
        .landing-shell {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          background: var(--ground);
        }
        .landing-nav {
          display: flex;
          align-items: center;
          padding: 16px 24px;
          background: var(--surface);
          border-bottom: 1px solid var(--line-soft);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .landing-hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 80px 24px;
          background: linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%);
        }
        .hero-title {
          font-size: clamp(32px, 5vw, 56px);
          line-height: 1.1;
          margin-bottom: 24px;
          color: var(--ink);
          max-width: 800px;
        }
        .hero-subtitle {
          font-size: clamp(16px, 2vw, 20px);
          color: var(--muted);
          margin-bottom: 40px;
          max-width: 600px;
          line-height: 1.5;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .btn-primary {
          background: var(--accent);
          color: var(--accent-ink);
          padding: 14px 28px;
          border-radius: 99px;
          font-weight: 600;
          font-size: 16px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(38, 69, 111, 0.3);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(38, 69, 111, 0.4);
        }
        .btn-secondary {
          background: var(--surface);
          color: var(--ink);
          padding: 14px 28px;
          border-radius: 99px;
          font-weight: 600;
          font-size: 16px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--line);
          transition: background 0.2s;
        }
        .btn-secondary:hover {
          background: var(--surface-2);
        }
        
        /* Value Props Section */
        .value-section {
          padding: 80px 24px;
          background: var(--surface);
        }
        .value-container {
          max-width: 1000px;
          margin: 0 auto;
        }
        .section-title {
          text-align: center;
          font-size: 32px;
          margin-bottom: 48px;
          color: var(--ink);
        }
        .value-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
        }
        .value-card {
          padding: 32px;
          border-radius: 24px;
          background: var(--surface-2);
          border: 1px solid var(--line-soft);
          transition: transform 0.2s;
        }
        .value-card:hover {
          transform: translateY(-4px);
        }
        .value-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin-bottom: 24px;
        }
        .value-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 12px;
          color: var(--ink);
        }
        .value-desc {
          color: var(--muted);
          font-size: 15px;
          line-height: 1.6;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(23, 33, 31, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 24px;
          opacity: 0;
          animation: fadeIn 0.2s forwards;
        }
        .modal-content {
          background: var(--surface);
          width: 100%;
          max-width: 400px;
          border-radius: 24px;
          padding: 32px;
          box-shadow: var(--shadow);
          position: relative;
          transform: translateY(20px);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px; height: 32px;
          border-radius: 99px;
          background: var(--surface-2);
          display: flex; align-items: center; justify-content: center;
          color: var(--muted);
          cursor: pointer;
        }
        .login-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid var(--line);
          background: var(--surface-2);
          font-size: 15px;
          margin-bottom: 16px;
          color: var(--ink);
        }
        .login-input:focus {
          outline: 2px solid var(--accent);
          outline-offset: -1px;
        }
        .login-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          background: var(--accent);
          color: var(--accent-ink);
          font-weight: 700;
          font-size: 16px;
          text-align: center;
          border: none;
          cursor: pointer;
          margin-bottom: 24px;
        }
        .social-btn {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--line);
          color: var(--ink);
          font-weight: 600;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          margin-bottom: 12px;
        }
        .social-btn.line {
          background: #06C755;
          color: #fff;
          border: none;
        }

        /* Developer Section */
        .dev-section {
          padding: 80px 24px;
          background: var(--surface-2);
          text-align: center;
          border-top: 1px solid var(--line-soft);
        }
        .dev-card {
          background: var(--surface);
          border-radius: 24px;
          padding: 40px;
          max-width: 600px;
          margin: 0 auto;
          box-shadow: var(--shadow);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .dev-photo {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid var(--surface-2);
          box-shadow: 0 4px 14px rgba(0,0,0,0.1);
        }
        .dev-role {
          font-family: var(--font-mono), monospace;
          color: var(--accent);
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .dev-name {
          font-size: 24px;
          color: var(--ink);
        }
        
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes slideUp {
          to { transform: translateY(0); }
        }
      `}</style>

      <div className="landing-shell">
        {/* Navigation */}
        <nav className="landing-nav">
          <BrandMark size={32} />
          <span className="serif" style={{ fontSize: 18, fontWeight: 700, marginLeft: 12, color: "var(--accent)" }}>
            NEXORA AGRI AI
          </span>
          <div style={{ flex: 1 }} />
          <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: 14 }} onClick={() => setIsLoginModalOpen(true)}>
            เข้าสู่ระบบ
          </button>
        </nav>

        {/* Hero Section */}
        <header className="landing-hero">
          <img 
            src="/images/nexora-logo.jpg" 
            alt="NEXORA AGRI AI" 
            style={{ width: 120, height: 120, objectFit: "contain", marginBottom: 24, borderRadius: 24, boxShadow: "var(--shadow)" }} 
          />
          <div style={{ display: "inline-block", background: "var(--health-soft)", color: "var(--health)", padding: "6px 16px", borderRadius: 99, fontSize: 13, fontWeight: 700, marginBottom: 24 }}>
            ✨ อัปเดตใหม่: AI Plant Doctor ตรวจโรคแม่นยำ 98%
          </div>
          <h1 className="hero-title serif">
            อนาคตของการเกษตรไทย <br />
            <span style={{ color: "var(--accent)" }}>จัดการฟาร์มด้วย AI</span>
          </h1>
          <p className="hero-subtitle">
            ลดต้นทุน เพิ่มผลผลิต วางแผนแม่นยำ พร้อมที่ปรึกษาส่วนตัว 24 ชั่วโมง 
            ออกแบบมาเพื่อเกษตรกรไทย ใช้งานง่ายบนมือถือเครื่องเดียว
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setIsLoginModalOpen(true)}>
              เริ่มใช้งานฟรี 1 แปลง
              <Icon name="chevron" size={18} />
            </button>
            <Link href="/pricing" className="btn-secondary">
              ดูแพ็กเกจราคา
            </Link>
          </div>
        </header>

        {/* Value Propositions */}
        <section className="value-section">
          <div className="value-container">
            <h2 className="section-title serif">ทำไมถึงต้องใช้ NEXORA AGRI AI?</h2>
            <div className="value-grid">
              {VALUE_PROPS.map((prop, idx) => (
                <div key={idx} className="value-card">
                  <div className="value-icon" style={{ background: prop.bg, color: prop.color }}>
                    {prop.title.split(" ")[0]}
                  </div>
                  <h3 className="value-title">{prop.title.substring(prop.title.indexOf(" ") + 1)}</h3>
                  <p className="value-desc">{prop.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Developer Section */}
        <section className="dev-section">
          <h2 className="section-title serif" style={{ marginBottom: 40 }}>พัฒนาโดยคนไทย เพื่อเกษตรกรไทย</h2>
          <div className="dev-card">
            <img src="/images/developer-narng.png" alt="Narng Preedarat" className="dev-photo" />
            <div style={{ textAlign: "center" }}>
              <div className="dev-role">ผู้พัฒนา (Lead Developer)</div>
              <h3 className="dev-name serif">Narng Preedarat</h3>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6, maxWidth: 400 }}>
              "เป้าหมายของผมคือการนำเทคโนโลยีระดับโลก มาสร้างเครื่องมือที่ใช้งานง่ายและเข้าถึงได้จริง เพื่อยกระดับคุณภาพชีวิตเกษตรกรไทยอย่างยั่งยืน"
            </p>
          </div>
        </section>
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="modal-overlay" onClick={() => setIsLoginModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsLoginModalOpen(false)}>✕</button>
            
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ margin: "0 auto 16px", display: "inline-block" }}>
                <BrandMark size={48} />
              </div>
              <h2 className="serif" style={{ fontSize: 24, marginBottom: 8 }}>เข้าสู่ระบบ</h2>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>กรุณาเข้าสู่ระบบเพื่อเข้าจัดการฟาร์มของคุณ</p>
            </div>

            {/* Mock Login Form */}
            <input type="text" placeholder="เบอร์โทรศัพท์ หรือ อีเมล" className="login-input" />
            <input type="password" placeholder="รหัสผ่าน" className="login-input" />
            
            <Link href="/farmer" className="login-btn" style={{ display: "block", textDecoration: "none" }}>
              เข้าสู่ระบบ
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "24px 0", color: "var(--muted)", fontSize: 13 }}>
              <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
              <span>หรือเข้าสู่ระบบด้วย</span>
              <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
            </div>

            <Link href="/farmer" className="social-btn line" style={{ textDecoration: "none" }}>
              เข้าสู่ระบบด้วย LINE
            </Link>
            <Link href="/farmer" className="social-btn" style={{ textDecoration: "none" }}>
              เข้าสู่ระบบด้วย Facebook
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
