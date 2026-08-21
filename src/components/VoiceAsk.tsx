"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Icon } from "./Icon";
import Link from "next/link";

const COMMON_QUESTIONS = [
  "วันนี้ต้องรดน้ำแปลงไหนไหม",
  "ใบมันสำปะหลังเป็นโรคใบด่างรักษายังไง",
  "ต้นทุนข้าวแปลง A-01 ตอนนี้เท่าไหร่แล้ว",
  "ดินค่า pH 5.2 ในแปลง A-02 ต้องใส่ปุ๋ยอะไร",
  "ฤดูหน้าแปลง A-01 ควรปลูกพืชอะไรบำรุงดิน",
];

export function VoiceAsk() {
  const { chatMessages, sendChatMessage, clearChat, plots } = useAppStore();
  const [inputQuery, setInputQuery] = useState("");
  const [selectedPlot, setSelectedPlot] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isSending]);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = "th-TH";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsListening(true);
          setSpeechError(null);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputQuery(transcript);
            handleSubmit(transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
          if (event.error === "not-allowed") {
            setSpeechError("กรุณาอนุญาตการใช้ไมโครโฟนในเบราว์เซอร์");
          } else {
            setSpeechError("ไม่สามารถจับเสียงได้ กรุณาลองพูดใหม่อีกครั้ง หรือพิมพ์คำถาม");
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [selectedPlot]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      // Speech recognition not supported fallback
      const fallbackPrompt = prompt("เบราว์เซอร์ไม่รองรับ Web Speech API กรุณาพิมพ์คำถามของคุณที่นี่:");
      if (fallbackPrompt) {
        handleSubmit(fallbackPrompt);
      }
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        setSpeechError(null);
        recognitionRef.current.start();
      } catch (err) {
        console.error("Start speech error:", err);
      }
    }
  };

  const speakText = (id: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("เบราว์เซอร์ของคุณไม่รองรับการออกเสียงข้อความ (Text-to-Speech)");
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[*_#`~]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "th-TH";
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async (queryText?: string) => {
    const q = (queryText ?? inputQuery).trim();
    if (!q || isSending) return;

    setInputQuery("");
    setIsSending(true);
    try {
      await sendChatMessage(q, selectedPlot || undefined);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Context Plot Selector */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "var(--surface-2)",
          padding: "8px 12px",
          borderRadius: "var(--r-m)",
          border: "1px solid var(--line-soft)",
          fontSize: 13,
        }}
      >
        <Icon name="pin" size={15} color="var(--accent)" />
        <span style={{ color: "var(--muted)" }}>บริบทแปลง:</span>
        <select
          value={selectedPlot}
          onChange={(e) => setSelectedPlot(e.target.value)}
          style={{
            flex: 1,
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: 6,
            padding: "4px 8px",
            fontSize: 13,
            color: "var(--ink)",
          }}
        >
          <option value="">ภาพรวมทั้งฟาร์ม (12 แปลง)</option>
          {plots.map((p) => (
            <option key={p.id} value={p.id}>
              แปลง {p.id} ({p.crop} - {p.variety})
            </option>
          ))}
        </select>
        {chatMessages.length > 1 && (
          <button
            type="button"
            onClick={clearChat}
            style={{ fontSize: 12, color: "var(--muted)", padding: "4px 6px" }}
            title="ล้างบทสนทนา"
          >
            ล้างแชท
          </button>
        )}
      </div>

      {/* Voice Mic Hero Action */}
      <div style={{ textAlign: "center" }}>
        <button
          type="button"
          className="tap tap-primary"
          style={{
            minHeight: 66,
            borderRadius: 999,
            fontSize: 17,
            width: "100%",
            background: isListening
              ? "linear-gradient(135deg, #B7362C, #D98255)"
              : "linear-gradient(135deg, var(--accent), #1E375B)",
            boxShadow: isListening ? "0 0 20px rgba(183, 54, 44, 0.5)" : "var(--shadow)",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
          onClick={toggleListening}
        >
          <Icon name="mic" size={24} />
          {isListening ? (
            <span>กำลังฟังเสียงพูดของคุณ... (แตะเพื่อหยุด)</span>
          ) : (
            <span>แตะแล้วพูดคำถามเป็นภาษาไทย</span>
          )}
        </button>

        {isListening && (
          <div
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "center",
              gap: 4,
              alignItems: "center",
            }}
          >
            <span className="pulse-bar" style={{ animationDelay: "0s" }} />
            <span className="pulse-bar" style={{ animationDelay: "0.2s" }} />
            <span className="pulse-bar" style={{ animationDelay: "0.4s" }} />
            <span className="pulse-bar" style={{ animationDelay: "0.1s" }} />
            <span className="pulse-bar" style={{ animationDelay: "0.3s" }} />
          </div>
        )}

        {speechError && (
          <div
            style={{
              marginTop: 8,
              fontSize: 12.5,
              color: "var(--crit)",
              background: "var(--crit-soft)",
              padding: "6px 12px",
              borderRadius: 8,
            }}
          >
            {speechError}
          </div>
        )}
      </div>

      {/* Chat Messages Stream */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          minHeight: 180,
          maxHeight: 480,
          overflowY: "auto",
          padding: "4px 2px",
        }}
      >
        {chatMessages.map((msg) => {
          const isAssistant = msg.sender === "assistant";
          const isSpeaking = speakingId === msg.id;

          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isAssistant ? "flex-start" : "flex-end",
                maxWidth: isAssistant ? "94%" : "82%",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div
                style={{
                  background: isAssistant ? "var(--surface)" : "var(--accent)",
                  color: isAssistant ? "var(--ink)" : "var(--accent-ink)",
                  padding: "12px 16px",
                  borderRadius: isAssistant ? "14px 14px 14px 2px" : "14px 14px 2px 14px",
                  boxShadow: "var(--shadow)",
                  border: isAssistant ? "1px solid var(--line-soft)" : "none",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {/* Assistant Header Badge */}
                {isAssistant && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                      marginBottom: 8,
                      borderBottom: "1px solid var(--line-soft)",
                      paddingBottom: 6,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 99,
                          background: "var(--accent-soft)",
                          color: "var(--accent)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon name="sparkle" size={13} />
                      </span>
                      <strong style={{ fontSize: 12.5, color: "var(--accent)" }}>NEXORA AI Farm Agent</strong>
                    </div>

                    {msg.confidence !== undefined && (
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: "var(--health)",
                          background: "var(--health-soft)",
                          padding: "2px 7px",
                          borderRadius: 99,
                        }}
                      >
                        มั่นใจ {(msg.confidence * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                )}

                {/* Message Body */}
                <div style={{ whiteSpace: "pre-line" }}>{msg.text}</div>

                {/* Why & Reasons Block (Rule 1 compliance) */}
                {isAssistant && msg.reasons && msg.reasons.length > 0 && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: "8px 12px",
                      background: "var(--surface-2)",
                      borderRadius: 8,
                      fontSize: 12.5,
                      borderLeft: "3px solid var(--accent)",
                    }}
                  >
                    <div style={{ fontWeight: 600, color: "var(--ink-2)", marginBottom: 4 }}>
                      ที่มาและเหตุผลวิเคราะห์:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 16, color: "var(--muted)", lineHeight: 1.5 }}>
                      {msg.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Citations & Action Links */}
                {isAssistant && (
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                      flexWrap: "wrap",
                      paddingTop: 6,
                    }}
                  >
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {msg.citations?.map((c, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: 11,
                            color: "var(--muted)",
                            background: "var(--surface-3)",
                            padding: "2px 8px",
                            borderRadius: 4,
                          }}
                        >
                          อ้างอิง: {c.plotId ? `แปลง ${c.plotId} · ` : ""}
                          {c.topic}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {msg.actionLink && (
                        <Link
                          href={msg.actionLink.href}
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "var(--accent)",
                            textDecoration: "none",
                            padding: "3px 9px",
                            borderRadius: 6,
                            background: "var(--accent-soft)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          {msg.actionLink.label} →
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => speakText(msg.id, msg.text)}
                        style={{
                          background: isSpeaking ? "var(--accent-soft)" : "transparent",
                          color: isSpeaking ? "var(--accent)" : "var(--muted)",
                          padding: "4px 8px",
                          borderRadius: 6,
                          fontSize: 12,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          border: "1px solid var(--line-soft)",
                        }}
                        title={isSpeaking ? "หยุดอ่าน" : "ฟังเสียงอ่านภาษาไทย"}
                      >
                        <Icon name="mic" size={14} />
                        {isSpeaking ? "กำลังอ่าน..." : "ฟังเสียง"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: "var(--muted)",
                  alignSelf: isAssistant ? "flex-start" : "flex-end",
                  padding: "0 4px",
                }}
              >
                {msg.timestamp}
              </div>
            </div>
          );
        })}

        {isSending && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "var(--surface)",
              padding: "10px 16px",
              borderRadius: "14px 14px 14px 2px",
              boxShadow: "var(--shadow)",
              fontSize: 13,
              color: "var(--muted)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Icon name="sparkle" size={15} color="var(--accent)" />
            <span>AI กำลังวิเคราะห์ข้อมูลสภาพอากาศและประวัติแปลงของคุณ...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Questions Grid */}
      <div>
        <h2 className="eyebrow" style={{ marginBottom: 6 }}>
          หรือแตะคำถามด่วน
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {COMMON_QUESTIONS.map((question) => (
            <button
              key={question}
              type="button"
              className="pick"
              style={{ minHeight: 46, borderRadius: 999, padding: "8px 16px" }}
              onClick={() => handleSubmit(question)}
            >
              <Icon name="sparkle" size={15} color="var(--accent)" />
              <span style={{ flex: 1, fontSize: 13.2, textAlign: "left" }}>“{question}”</span>
              <Icon name="chevron" size={14} color="var(--muted)" />
            </button>
          ))}
        </div>
      </div>

      {/* Text Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        style={{
          display: "flex",
          gap: 8,
          position: "sticky",
          bottom: 74,
          background: "var(--ground)",
          paddingTop: 8,
        }}
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="พิมพ์คำถามถึงผู้ช่วยฟาร์มที่นี่..."
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: 999,
            border: "1.5px solid var(--line)",
            background: "var(--surface)",
            color: "var(--ink)",
            fontSize: 14,
            outline: "none",
          }}
        />
        <button
          type="submit"
          className="tap tap-primary"
          disabled={!inputQuery.trim() || isSending}
          style={{
            width: "auto",
            minHeight: 48,
            padding: "0 20px",
            borderRadius: 999,
            fontSize: 14,
          }}
        >
          ส่ง
        </button>
      </form>
    </div>
  );
}
