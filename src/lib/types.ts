/**
 * โครงสร้างข้อมูลหลักของ NEXORA AGRI AI
 *
 * หลักการที่ยึดไว้ตั้งแต่ต้น:
 * 1. ทุกอย่างผูกกับ "แปลง" (Plot) เพราะข้อมูลสะสมรายแปลงคือ moat ของแพลตฟอร์ม
 * 2. คำแนะนำของ AI ต้องมี confidence + reasons เสมอ ห้ามมีคำแนะนำลอย ๆ
 * 3. การกระทำที่กระทบของจริง (เปิดปั๊ม/วาล์ว) ต้องผ่าน approval ของคนก่อน
 */

export type PlotStatus = "ok" | "warn" | "crit";

export type CropKind =
  | "ข้าว"
  | "มันสำปะหลัง"
  | "ทุเรียน"
  | "อ้อย"
  | "ข้าวโพดหวาน"
  | "ถั่วเขียว"
  | "ผักสวนครัว";

export interface Plot {
  id: string;
  crop: CropKind;
  variety: string;
  rai: number;
  /** 0–100 คะแนนสุขภาพพืชโดยรวม */
  health: number;
  /** ความชื้นดิน % */
  soilMoisture: number;
  /** ความชื้นดินเป้าหมายของพืชชนิดนี้ในระยะปัจจุบัน */
  soilMoistureTarget: number;
  ph: number;
  ageDays: number;
  /** ระยะการเจริญเติบโต เช่น แตกกอ / สร้างหัว */
  stage: string;
  status: PlotStatus;
  /** ผลผลิตคาดการณ์ พร้อมหน่วย เพราะแต่ละพืชใช้หน่วยต่างกัน */
  yieldForecast: string;
  costPerRai: number;
  profitPerRai: number;
  lastIrrigation: string;
  lastFertilizer: string;
  photoCount: number;
  /** polygon points บนระบบพิกัดแผนที่ 640x340 (mock — ของจริงใช้ GeoJSON) */
  mapPoints: string;
}

export type TaskUrgency = "urgent" | "decide" | "log";

export interface DailyTask {
  id: string;
  urgency: TaskUrgency;
  /** สิ่งที่ต้องทำ เขียนเป็นประโยคสั้นที่คนอ่านแล้วลงมือได้ */
  what: string;
  /** เหตุผล — ห้ามว่าง ผู้ใช้ต้องรู้เสมอว่าทำไมระบบถึงบอกแบบนี้ */
  why: string;
  plotId?: string;
  actionLabel?: string;
  actionHref?: string;
}

export interface AiAdvice {
  id: string;
  plotId: string;
  title: string;
  body: string;
  /** 0–1 */
  confidence: number;
  reasons: string[];
  /** true = ต้องให้คนกดยืนยันก่อนระบบถึงจะทำอะไรต่อ */
  requiresApproval: boolean;
  acceptLabel: string;
  declineLabel: string;
}

export interface WeatherDay {
  label: string;
  tempMax: number;
  tempMin: number;
  rainChance: number;
  /** true = วันที่ระบบมองว่าเสี่ยงพอจะเตือน */
  risk: boolean;
  icon: "cloud" | "sun" | "alert";
}

export interface WeatherAlert {
  headline: string;
  detail: string;
  affectedPlotIds: string[];
  withinHours: number;
}

export interface CostLine {
  label: string;
  amount: number;
}

export interface SeasonFinance {
  seasonLabel: string;
  totalRai: number;
  revenue: number;
  costs: CostLine[];
  /** ผลผลิตเฉลี่ยต่อไร่ ใช้หน่วย กก. */
  yieldPerRai: number;
  previousProfitPerRai: number;
}

export interface DiagnosisCandidate {
  label: string;
  probability: number;
}

export interface ScanResult {
  plotId: string;
  takenAt: string;
  photoCount: number;
  headline: string;
  affectedAreaPct: number;
  /** ความมั่นใจว่า "ผิดปกติจริง" ไม่ใช่ความมั่นใจในสาเหตุ */
  abnormalityConfidence: number;
  candidates: DiagnosisCandidate[];
  /** คำถามที่ระบบใช้ถามกลับเพื่อลดความไม่แน่นอน */
  triage: TriageQuestion[];
  actions: { title: string; detail: string }[];
}

export interface TriageQuestion {
  id: string;
  question: string;
  /** อธิบายว่าถามไปทำไม — ทำให้ผู้ใช้เชื่อใจระบบมากขึ้น */
  why: string;
  options: string[];
}

export interface ScanHistoryEntry {
  date: string;
  daysAgo: number;
  health: number;
  status: PlotStatus;
  note: string;
}

/**
 * แพ็กเกจราคา
 *
 * ราคาเป็นตัวเลขคงที่ต่อแพ็กเกจ ไม่ผูกกับจำนวนแปลง — ยกเว้น Smart Farm
 * ที่ยังเป็น "เริ่มต้นที่" เพราะขึ้นกับจำนวนเซนเซอร์ IoT ที่ต่อเพิ่ม (priceOpenEnded)
 */
export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  /** undefined = ติดต่อฝ่ายขาย (ไม่แสดงตัวเลข) */
  priceMin?: number;
  /** true = แสดง "+" ต่อท้ายราคา หมายถึง "เริ่มต้นที่" ไม่ใช่ราคาสุดท้าย */
  priceOpenEnded?: boolean;
  priceNote: string;
  /** true = มีทดลองใช้ฟรี 30 วัน */
  hasTrial: boolean;
  featured?: boolean;
  ctaLabel: string;
  ctaHref: string;
  features: string[];
}

export type FeatureAvailability = "yes" | "no" | "add-on";

export interface FeatureRow {
  label: string;
  /** เรียงตามลำดับ tier ใน PRICING_TIERS */
  availability: FeatureAvailability[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  confidence?: number;
  reasons?: string[];
  citations?: { plotId?: string; topic?: string }[];
  actionLink?: { label: string; href: string };
  audioAvailable?: boolean;
}

export interface MarketPrice {
  id: string;
  name: string;
  category: "พืชไร่" | "พืชสวน" | "ผลไม้" | "ปศุสัตว์/ประมง";
  price: number;
  unit: string;
  change: number;
  changePct: number;
  trend: "up" | "down" | "flat";
  source: string;
  updatedAt: string;
}

export interface DiseasePreset {
  id: string;
  name: string;
  thaiName: string;
  scientificName: string;
  crop: CropKind;
  description: string;
  affectedAreaPct: number;
  confidence: number;
  sampleSvg: string;
  candidates: DiagnosisCandidate[];
  triage: TriageQuestion[];
  actions: { title: string; detail: string }[];
}

export interface SubscriptionStatus {
  tierId: "free" | "pro" | "smart" | "enterprise";
  tierName: string;
  billingCycle: "monthly" | "annual";
  isActive: boolean;
  expiresAt: string;
  trialDaysLeft: number;
}

