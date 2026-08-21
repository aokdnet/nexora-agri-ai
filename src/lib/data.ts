/**
 * ข้อมูลตัวอย่างของฟาร์มบ้านหนองแวง (86 ไร่ · 12 แปลง)
 *
 * ชุดนี้เป็นชุดเดียวกับที่ใช้ใน mockup ทั้งสามหน้า เพื่อให้ตัวเลขตรงกันทุกที่
 * เมื่อต่อ backend จริง ให้แทนที่ไฟล์นี้ด้วย data layer ที่คืนค่า type เดียวกัน
 */

import type {
  AiAdvice,
  DailyTask,
  FeatureRow,
  Plot,
  PricingTier,
  ScanHistoryEntry,
  ScanResult,
  SeasonFinance,
  WeatherAlert,
  WeatherDay,
} from "./types";

export const FARM = {
  name: "ฟาร์มบ้านหนองแวง",
  district: "อ.บ้านไผ่",
  province: "ขอนแก่น",
  lat: 16.05,
  lon: 102.73,
  ownerNickname: "ลุงประดิษฐ์",
};

export const PLOTS: Plot[] = [
  {
    id: "A-01", crop: "ข้าว", variety: "กข43", rai: 12,
    health: 87, soilMoisture: 36, soilMoistureTarget: 35, ph: 6.1,
    ageDays: 62, stage: "แตกกอ", status: "ok",
    yieldForecast: "810 กก./ไร่", costPerRai: 3420, profitPerRai: 3860,
    lastIrrigation: "2 วันก่อน", lastFertilizer: "10 วันก่อน", photoCount: 6,
    mapPoints: "22,18 138,14 146,86 28,92",
  },
  {
    id: "A-02", crop: "มันสำปะหลัง", variety: "ระยอง 72", rai: 18,
    health: 74, soilMoisture: 24, soilMoistureTarget: 35, ph: 5.2,
    ageDays: 84, stage: "สร้างหัว", status: "warn",
    yieldForecast: "3,100 กก./ไร่", costPerRai: 3980, profitPerRai: 3140,
    lastIrrigation: "3 วันก่อน", lastFertilizer: "12 วันก่อน", photoCount: 11,
    mapPoints: "152,14 286,20 280,96 148,88",
  },
  {
    id: "A-03", crop: "ข้าว", variety: "ปทุมธานี 1", rai: 9,
    health: 93, soilMoisture: 38, soilMoistureTarget: 35, ph: 6.4,
    ageDays: 58, stage: "แตกกอ", status: "ok",
    yieldForecast: "860 กก./ไร่", costPerRai: 3280, profitPerRai: 4120,
    lastIrrigation: "1 วันก่อน", lastFertilizer: "8 วันก่อน", photoCount: 4,
    mapPoints: "24,100 146,96 150,168 30,172",
  },
  {
    id: "B-01", crop: "ทุเรียน", variety: "หมอนทอง", rai: 7,
    health: 91, soilMoisture: 41, soilMoistureTarget: 40, ph: 6.0,
    ageDays: 2190, stage: "หลังเก็บเกี่ยว", status: "ok",
    yieldForecast: "1,150 กก./ไร่", costPerRai: 8600, profitPerRai: 14200,
    lastIrrigation: "วันนี้", lastFertilizer: "5 วันก่อน", photoCount: 18,
    mapPoints: "330,16 452,20 448,92 328,88",
  },
  {
    id: "B-02", crop: "ทุเรียน", variety: "หมอนทอง", rai: 4,
    health: 88, soilMoisture: 39, soilMoistureTarget: 40, ph: 5.9,
    ageDays: 1460, stage: "หลังเก็บเกี่ยว", status: "ok",
    yieldForecast: "640 กก./ไร่", costPerRai: 7900, profitPerRai: 8600,
    lastIrrigation: "วันนี้", lastFertilizer: "5 วันก่อน", photoCount: 12,
    mapPoints: "462,20 606,26 600,90 458,92",
  },
  {
    id: "C-01", crop: "อ้อย", variety: "ขอนแก่น 3", rai: 11,
    health: 82, soilMoisture: 31, soilMoistureTarget: 32, ph: 5.7,
    ageDays: 112, stage: "ย่างปล้อง", status: "ok",
    yieldForecast: "12.4 ตัน/ไร่", costPerRai: 4100, profitPerRai: 2950,
    lastIrrigation: "4 วันก่อน", lastFertilizer: "20 วันก่อน", photoCount: 5,
    mapPoints: "332,100 452,96 456,170 330,174",
  },
  {
    id: "C-02", crop: "อ้อย", variety: "ขอนแก่น 3", rai: 6,
    health: 95, soilMoisture: 37, soilMoistureTarget: 32, ph: 6.2,
    ageDays: 110, stage: "ย่างปล้อง", status: "ok",
    yieldForecast: "13.8 ตัน/ไร่", costPerRai: 3900, profitPerRai: 3480,
    lastIrrigation: "3 วันก่อน", lastFertilizer: "20 วันก่อน", photoCount: 3,
    mapPoints: "466,98 604,102 598,172 460,172",
  },
  {
    id: "D-01", crop: "ข้าวโพดหวาน", variety: "ไฮบริกซ์ 3", rai: 5,
    health: 68, soilMoisture: 29, soilMoistureTarget: 34, ph: 5.5,
    ageDays: 46, stage: "ออกดอก", status: "crit",
    yieldForecast: "1,420 กก./ไร่", costPerRai: 4460, profitPerRai: 1780,
    lastIrrigation: "2 วันก่อน", lastFertilizer: "9 วันก่อน", photoCount: 14,
    mapPoints: "26,214 128,210 134,286 32,292",
  },
  {
    id: "D-02", crop: "ถั่วเขียว", variety: "ชัยนาท 84-1", rai: 3,
    health: 90, soilMoisture: 34, soilMoistureTarget: 32, ph: 6.3,
    ageDays: 38, stage: "ติดฝัก", status: "ok",
    yieldForecast: "210 กก./ไร่", costPerRai: 2100, profitPerRai: 2640,
    lastIrrigation: "2 วันก่อน", lastFertilizer: "14 วันก่อน", photoCount: 2,
    mapPoints: "140,210 226,214 222,288 136,286",
  },
  {
    id: "E-01", crop: "ข้าว", variety: "กข43", rai: 6,
    health: 89, soilMoisture: 35, soilMoistureTarget: 35, ph: 6.0,
    ageDays: 60, stage: "แตกกอ", status: "ok",
    yieldForecast: "830 กก./ไร่", costPerRai: 3390, profitPerRai: 3910,
    lastIrrigation: "2 วันก่อน", lastFertilizer: "10 วันก่อน", photoCount: 3,
    mapPoints: "236,216 292,218 288,290 232,288",
  },
  {
    id: "E-02", crop: "ผักสวนครัว", variety: "ผสม 5 ชนิด", rai: 2,
    health: 96, soilMoisture: 44, soilMoistureTarget: 42, ph: 6.6,
    ageDays: 22, stage: "เก็บต่อเนื่อง", status: "ok",
    yieldForecast: "—", costPerRai: 5200, profitPerRai: 9800,
    lastIrrigation: "วันนี้", lastFertilizer: "3 วันก่อน", photoCount: 7,
    mapPoints: "332,214 428,218 424,290 328,288",
  },
  {
    id: "F-01", crop: "มันสำปะหลัง", variety: "ระยอง 9", rai: 3,
    health: 79, soilMoisture: 27, soilMoistureTarget: 35, ph: 5.4,
    ageDays: 80, stage: "สร้างหัว", status: "warn",
    yieldForecast: "2,700 กก./ไร่", costPerRai: 3760, profitPerRai: 2380,
    lastIrrigation: "4 วันก่อน", lastFertilizer: "15 วันก่อน", photoCount: 1,
    mapPoints: "438,218 604,222 598,292 434,290",
  },
];

export const DAILY_TASKS: DailyTask[] = [
  {
    id: "t1",
    urgency: "urgent",
    what: "ไปดูใบข้าวโพด D-01",
    why: "รูปเมื่อวานเจอรอยแผลที่ใบ ~12% ของใบที่ถ่าย ถ้าลามขึ้นใบบนภายใน 3 วันจะกระทบผลผลิต",
    plotId: "D-01",
    actionLabel: "ถ่ายรูปใบเพิ่ม",
    actionHref: "/scan?plot=D-01",
  },
  {
    id: "t2",
    urgency: "decide",
    what: "ยังไม่ต้องรดน้ำ A-02",
    why: "ดินแห้งจริง แต่บ่ายนี้ฝนน่าจะตก 18–26 มม. รอถึงบ่าย 3 โมงค่อยตัดสินใจ ประหยัดค่าไฟสูบน้ำ ~฿420",
    plotId: "A-02",
    actionLabel: "ดูรายละเอียด",
    actionHref: "/plots/A-02",
  },
  {
    id: "t3",
    urgency: "log",
    what: "ลงค่าแรงเมื่อวาน",
    why: "จ้างคนตัดหญ้า 3 คน ยังไม่ได้บันทึก",
    actionLabel: "บันทึกค่าใช้จ่าย",
    actionHref: "/money",
  },
];

export const IRRIGATION_ADVICE: AiAdvice = {
  id: "adv-a02-water",
  plotId: "A-02",
  title: "AI แนะนำ: ยังไม่ต้องรดน้ำตอนนี้",
  body:
    "ดินแห้งจริง แต่บ่ายนี้ฝนน่าจะตก 18–26 มม. ซึ่งพอกับที่แปลงขาด แนะนำให้เดินดูโซน C ก่อน " +
    "แล้วรอถึง 15:00 น. ถ้าฝนไม่มาค่อยเปิดน้ำ",
  confidence: 0.73,
  reasons: [
    "โซน C อ่านได้ 24% แต่โซน A/B อยู่ที่ 33–36% — แห้งเฉพาะจุด ไม่ใช่ทั้งแปลง",
    "พยากรณ์ฝน 2 แหล่งตรงกันที่ 65–71%",
    "มันสำปะหลังอายุ 84 วัน ยังไม่ถึงช่วงลงหัวที่กลัวขาดน้ำ",
    "ถ้ารดแล้วฝนตกซ้ำ เสี่ยงน้ำขัง + ค่าไฟสูบน้ำ ~฿420",
  ],
  requiresApproval: true,
  acceptLabel: "ทำตามนี้",
  declineLabel: "เปิดน้ำเลย",
};

export const WEATHER_WEEK: WeatherDay[] = [
  { label: "วันนี้ พฤ.", tempMax: 31, tempMin: 24, rainChance: 68, risk: true, icon: "cloud" },
  { label: "ศ. 22", tempMax: 30, tempMin: 24, rainChance: 45, risk: false, icon: "cloud" },
  { label: "ส. 23", tempMax: 34, tempMin: 25, rainChance: 10, risk: false, icon: "sun" },
  { label: "อา. 24", tempMax: 35, tempMin: 26, rainChance: 5, risk: false, icon: "sun" },
  { label: "จ. 25", tempMax: 32, tempMin: 25, rainChance: 35, risk: false, icon: "cloud" },
  { label: "อ. 26", tempMax: 29, tempMin: 24, rainChance: 85, risk: true, icon: "alert" },
  { label: "พ. 27", tempMax: 30, tempMin: 24, rainChance: 50, risk: false, icon: "cloud" },
];

export const WEATHER_ALERT: WeatherAlert = {
  headline: "ฝนหนักมีความเป็นไปได้ใน 6 ชั่วโมงข้างหน้า (18–26 มม.)",
  detail:
    "AI แนะนำให้ทบทวนแผนให้น้ำวันนี้ และเลื่อนกิจกรรมภาคสนามที่ต้องใช้เครื่องจักรหนักออกไปก่อน " +
    "เพื่อลดการอัดแน่นของดินขณะเปียก",
  affectedPlotIds: ["A-01", "A-02", "A-03", "C-01", "C-02"],
  withinHours: 6,
};

export const SEASON: SeasonFinance = {
  seasonLabel: "ฤดูกาล 2567/68",
  totalRai: 86,
  revenue: 624000,
  costs: [
    { label: "ค่าแรง", amount: 96000 },
    { label: "ปุ๋ย", amount: 86000 },
    { label: "เมล็ดพันธุ์", amount: 42000 },
    { label: "เครื่องจักร", amount: 38000 },
    { label: "จัดการศัตรูพืช", amount: 24000 },
    { label: "ค่าน้ำ", amount: 19000 },
  ],
  yieldPerRai: 812,
  previousProfitPerRai: 3120,
};

export const SCAN_RESULT: ScanResult = {
  plotId: "D-01",
  takenAt: "20 ส.ค. 2568 · 17:22",
  photoCount: 3,
  headline: "พบรอยแผลผิดปกติที่ใบล่าง–ใบกลาง",
  affectedAreaPct: 12,
  abnormalityConfidence: 0.82,
  candidates: [
    { label: "กลุ่มโรคใบไหม้ในข้าวโพด", probability: 0.64 },
    { label: "ขาดธาตุอาหารรอง", probability: 0.19 },
    { label: "แผลจากสภาพอากาศ/ลมแดด", probability: 0.11 },
  ],
  triage: [
    {
      id: "q1",
      question: "7 วันที่ผ่านมา ฝนตกติดกันกี่วัน",
      why: "ถามเพราะ: ใบที่เปียกต่อเนื่องหลายวันคือเงื่อนไขที่เชื้อราต้องการ ถ้าไม่มีฝนเลย โอกาสเป็นโรคจากเชื้อราจะลดลงมาก",
      options: ["ไม่ตกเลย", "ตก 1–2 วัน", "ตก 3 วันขึ้นไป", "จำไม่ได้"],
    },
    {
      id: "q2",
      question: "แผลเริ่มจากใบล่างแล้วค่อยลามขึ้นบน หรือขึ้นพร้อมกันทั้งต้น",
      why: "ถามเพราะ: โรคจากเชื้อรามักเริ่มจากใบล่างที่ใกล้ดินและชื้นที่สุด ส่วนอาการขาดธาตุอาหารมักขึ้นพร้อมกันตามอายุใบ",
      options: ["เริ่มจากใบล่างก่อน", "ขึ้นพร้อมกันทั้งต้น", "ไม่แน่ใจ / ไม่ได้สังเกต"],
    },
    {
      id: "q3",
      question: "แปลงข้างเคียงที่ปลูกพันธุ์เดียวกันมีอาการแบบนี้ไหม",
      why: "ถามเพราะ: ถ้าลามข้ามแปลง แนวโน้มจะเป็นเชื้อที่แพร่ได้ ไม่ใช่ปัญหาเฉพาะจุดของดินแปลงนี้",
      options: ["มีเหมือนกัน", "ไม่มี", "ยังไม่ได้ไปดู"],
    },
  ],
  actions: [
    {
      title: "เลิกให้น้ำแบบสปริงเกลอร์ตอนเย็น",
      detail: "ใบเปียกข้ามคืนคือเงื่อนไขที่เชื้อราชอบที่สุด — ย้ายไปให้น้ำตอนเช้าแทน",
    },
    {
      title: "เก็บใบที่เป็นแผลออกนอกแปลง",
      detail: "อย่าทิ้งไว้ตามร่อง เพราะเป็นแหล่งสะสมเชื้อของฤดูถัดไป",
    },
    {
      title: "ถ่ายซ้ำจุดเดิมอีก 3 วัน",
      detail: "ระบบจะเตือนเอง และเทียบให้ว่าแผลลามขึ้นหรือหยุด",
    },
  ],
};

export const SCAN_HISTORY: ScanHistoryEntry[] = [
  { date: "24 ก.ค.", daysAgo: 28, health: 96, status: "ok", note: "ไม่พบความผิดปกติ" },
  { date: "6 ส.ค.", daysAgo: 15, health: 91, status: "ok", note: "จุดเล็ก 1 จุด ยังไม่ถึงเกณฑ์แจ้งเตือน" },
  { date: "14 ส.ค.", daysAgo: 7, health: 79, status: "warn", note: "แผลขยาย · ตรงกับช่วงฝนตก 4 วันติด" },
  { date: "20 ส.ค.", daysAgo: 1, health: 68, status: "crit", note: "พื้นที่ใบที่กระทบ ~12% · ส่งให้นักวิชาการแล้ว" },
];

/**
 * แพ็กเกจราคา
 *
 * โครงสร้างราคาผูกกับจำนวนแปลง ไม่ใช่ตัวเลขลอย ๆ — ตั้งใจไม่คิดแพงกับ
 * เกษตรกรรายเล็ก (ดู "Business Model" ในบทสนทนาที่ตกลงกันไว้)
 * ทุกแพ็กเกจที่เก็บเงินมีทดลองใช้ฟรี 30 วัน ไม่ต้องผูกบัตร ยกเว้น Enterprise
 * ที่ใช้วิธีคุยนำร่อง (pilot) กับฝ่ายขายแทน
 */
export const PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "FREE",
    tagline: "ลองระบบก่อนตัดสินใจ",
    priceMin: 0,
    priceNote: "ฟรีตลอดไป ไม่มีวันหมดอายุ",
    hasTrial: false,
    ctaLabel: "เริ่มใช้งานฟรี",
    ctaHref: "/farmer",
    features: [
      "1 แปลง (สูงสุด 10 ไร่)",
      "Crop Planner พื้นฐาน",
      "พยากรณ์อากาศ 7 วัน",
      "บันทึกต้นทุน-รายรับ",
      "ถ่ายรูปวิเคราะห์ AI Plant Doctor 3 ครั้ง/เดือน",
    ],
  },
  {
    id: "farmer",
    name: "Farmer",
    tagline: "สำหรับเกษตรกรรายเดียว 1–5 แปลง",
    priceMin: 299,
    priceNote: "ราคาคงที่ ไม่บวกเพิ่มตามจำนวนแปลง",
    hasTrial: true,
    ctaLabel: "ทดลองฟรี 30 วัน",
    ctaHref: "/farmer",
    features: [
      "ทุกอย่างใน FREE",
      "แปลงได้สูงสุด 5 แปลง",
      "AI Plant Doctor ไม่จำกัดจำนวนครั้ง",
      "AI Farm Assistant ถามด้วยเสียง",
      "แจ้งเตือนความเสี่ยงจากอากาศ",
      "รายงานกำไรต่อไร่",
    ],
  },
  {
    id: "farm-pro",
    name: "Farm Pro",
    tagline: "สำหรับฟาร์มหลายแปลงที่จริงจังเรื่องกำไร",
    priceMin: 590,
    priceNote: "ราคาคงที่ แปลงไม่จำกัดจำนวน",
    hasTrial: true,
    featured: true,
    ctaLabel: "ทดลองฟรี 30 วัน",
    ctaHref: "/farmer",
    features: [
      "ทุกอย่างใน Farmer",
      "แปลงไม่จำกัดจำนวน",
      "Yield Prediction คาดการณ์ผลผลิต",
      "Fertilizer & Irrigation Planner",
      "ส่งเคสให้นักวิชาการเกษตรตรวจสอบ (คิวด่วน)",
      "ส่งออกรายงานเป็น PDF / Excel",
    ],
  },
  {
    id: "smart-farm",
    name: "Smart Farm",
    tagline: "สำหรับฟาร์มที่พร้อมต่อเซนเซอร์และทีมงาน",
    priceMin: 1490,
    priceOpenEnded: true,
    priceNote: "เริ่มต้นที่ราคานี้ ขึ้นกับจำนวนเซนเซอร์",
    hasTrial: true,
    ctaLabel: "ทดลองฟรี 30 วัน",
    ctaHref: "/farmer",
    features: [
      "ทุกอย่างใน Farm Pro",
      "เชื่อมต่อเซนเซอร์ดิน (ความชื้น / pH / EC)",
      "Smart Irrigation — สั่งได้ แต่ต้องอนุมัติทุกครั้ง",
      "เครดิตวิเคราะห์ภาพดาวเทียม/โดรน",
      "ผู้ใช้งานในทีมได้สูงสุด 5 คน",
    ],
  },
  {
    id: "enterprise",
    name: "Co-op / Enterprise",
    tagline: "สำหรับสหกรณ์ กลุ่มเกษตรกร หรือองค์กร",
    priceNote: "ราคาตามขนาดองค์กร",
    hasTrial: false,
    ctaLabel: "ติดต่อฝ่ายขาย",
    ctaHref: "#contact",
    features: [
      "ทุกอย่างใน Smart Farm",
      "รองรับหลายฟาร์มในบัญชีเดียว (multi-tenant)",
      "เชื่อมต่อ NEXORA AGRI MARKETPLACE",
      "API สำหรับระบบภายในองค์กร",
      "ผู้ดูแลบัญชีเฉพาะ พร้อม SLA",
    ],
  },
];

/**
 * ตารางเทียบสิทธิ์แบบละเอียด 12 โมดูล
 * เรียงคอลัมน์ตามลำดับเดียวกับ PRICING_TIERS เสมอ (FREE → Enterprise)
 */
export const FEATURE_MATRIX: FeatureRow[] = [
  { label: "AI Crop Planner", availability: ["yes", "yes", "yes", "yes", "yes"] },
  { label: "Weather Intelligence", availability: ["yes", "yes", "yes", "yes", "yes"] },
  { label: "Farm Finance (ต้นทุน/กำไรต่อไร่)", availability: ["yes", "yes", "yes", "yes", "yes"] },
  { label: "AI Plant Doctor (ถ่ายรูปวิเคราะห์)", availability: ["no", "yes", "yes", "yes", "yes"] },
  { label: "AI Farm Assistant (ถามด้วยเสียง)", availability: ["no", "yes", "yes", "yes", "yes"] },
  { label: "AI Soil Doctor", availability: ["no", "no", "yes", "yes", "yes"] },
  { label: "Yield Prediction", availability: ["no", "no", "yes", "yes", "yes"] },
  { label: "Fertilizer Planner", availability: ["no", "no", "yes", "yes", "yes"] },
  { label: "Smart Irrigation (เซนเซอร์ + อนุมัติ)", availability: ["no", "no", "no", "yes", "yes"] },
  { label: "Drone / Satellite Intelligence", availability: ["no", "no", "add-on", "yes", "yes"] },
  { label: "AI Market (ราคาตลาด)", availability: ["no", "no", "add-on", "add-on", "yes"] },
  { label: "NEXORA AGRI MARKETPLACE", availability: ["no", "no", "no", "no", "yes"] },
];

/* ---------- ฟังก์ชันช่วยอ่านข้อมูล ---------- */

export function getPlot(id: string): Plot | undefined {
  return PLOTS.find((p) => p.id.toUpperCase() === id.toUpperCase());
}

export function totalRai(): number {
  return PLOTS.reduce((sum, p) => sum + p.rai, 0);
}

/**
 * สุขภาพเฉลี่ยถ่วงน้ำหนักตามพื้นที่ — ไม่ใช่ค่าเฉลี่ยธรรมดา
 * เพราะแปลง 18 ไร่ที่มีปัญหาสำคัญกว่าแปลง 2 ไร่ที่สมบูรณ์
 */
export function weightedHealth(): number {
  const rai = totalRai();
  if (rai === 0) return 0;
  const sum = PLOTS.reduce((acc, p) => acc + p.health * p.rai, 0);
  return Math.round((sum / rai) * 10) / 10;
}

export function averageSoilMoisture(): number {
  const rai = totalRai();
  if (rai === 0) return 0;
  const sum = PLOTS.reduce((acc, p) => acc + p.soilMoisture * p.rai, 0);
  return Math.round(sum / rai);
}

export function plotsNeedingAttention(): Plot[] {
  const rank: Record<string, number> = { crit: 0, warn: 1, ok: 2 };
  return PLOTS.filter((p) => p.status !== "ok").sort((a, b) => rank[a.status] - rank[b.status]);
}

export function healthyPlots(): Plot[] {
  return PLOTS.filter((p) => p.status === "ok").sort((a, b) => b.health - a.health);
}

export function totalCost(season: SeasonFinance = SEASON): number {
  return season.costs.reduce((sum, c) => sum + c.amount, 0);
}

export function profit(season: SeasonFinance = SEASON): number {
  return season.revenue - totalCost(season);
}

export function perRai(amount: number, season: SeasonFinance = SEASON): number {
  return Math.round(amount / season.totalRai);
}

/* ---------- ข้อมูลราคาตลาดกลางสินค้าเกษตรไทย (Live Agricultural Prices) ---------- */
export const MARKET_PRICES: import("./types").MarketPrice[] = [
  {
    id: "p1",
    name: "ข้าวเปลือกหอมมะลิ (ความชื้น 15%)",
    category: "พืชไร่",
    price: 15400,
    unit: "บาท/ตัน",
    change: 350,
    changePct: 2.3,
    trend: "up",
    source: "กรมการค้าภายใน (DIT)",
    updatedAt: "วันนี้ 08:30 น.",
  },
  {
    id: "p2",
    name: "มันสำปะหลังสด (เชื้อแป้ง 25%)",
    category: "พืชไร่",
    price: 3.15,
    unit: "บาท/กก.",
    change: -0.05,
    changePct: -1.5,
    trend: "down",
    source: "สมาคมการค้ามันสำปะหลังไทย",
    updatedAt: "วันนี้ 09:00 น.",
  },
  {
    id: "p3",
    name: "ข้าวโพดเลี้ยงสัตว์ (ความชื้น 14.5%)",
    category: "พืชไร่",
    price: 10.80,
    unit: "บาท/กก.",
    change: 0.20,
    changePct: 1.8,
    trend: "up",
    source: "ตลาดกลางสินค้าเกษตร",
    updatedAt: "วันนี้ 08:45 น.",
  },
  {
    id: "p4",
    name: "ทุเรียนหมอนทอง (เกรด AB)",
    category: "ผลไม้",
    price: 165,
    unit: "บาท/กก.",
    change: 5.0,
    changePct: 3.1,
    trend: "up",
    source: "ตลาดไท / ตลาดเนินสูง",
    updatedAt: "วันนี้ 07:15 น.",
  },
  {
    id: "p5",
    name: "อ้อยโรงงาน (CCS 10)",
    category: "พืชไร่",
    price: 1420,
    unit: "บาท/ตัน",
    change: 0,
    changePct: 0,
    trend: "flat",
    source: "สอน. กระทรวงอุตสาหกรรม",
    updatedAt: "วานนี้",
  },
  {
    id: "p6",
    name: "ยางพาราแผ่นดิบคุณภาพ 3",
    category: "พืชสวน",
    price: 76.50,
    unit: "บาท/กก.",
    change: 1.20,
    changePct: 1.6,
    trend: "up",
    source: "การยางแห่งประเทศไทย (กยท.)",
    updatedAt: "วันนี้ 09:30 น.",
  },
];

/* ---------- ชุดตัวอย่างโรคพืชไทยสำหรับ AI Plant Doctor (Disease Presets) ---------- */
export const DISEASE_PRESETS: import("./types").DiseasePreset[] = [
  {
    id: "cassava-mosaic",
    name: "โรคใบด่างมันสำปะหลัง",
    thaiName: "โรคใบด่างมันสำปะหลัง (SLCMV)",
    scientificName: "Sri Lankan cassava mosaic virus",
    crop: "มันสำปะหลัง",
    description: "ใบด่างเหลือง หงิกงอ ยอดหยัก ใบมีขนาดเล็กลง แคระแกร็น ข้อถี่ ผลผลิตลดลง 50-80%",
    affectedAreaPct: 18,
    confidence: 0.88,
    sampleSvg: "cassava",
    candidates: [
      { label: "โรคใบด่างมันสำปะหลัง (SLCMV)", probability: 0.88 },
      { label: "อาการขาดธาตุสังกะสี / แมกนีเซียม", probability: 0.08 },
      { label: "ไรแดงมันสำปะหลังทำลาย", probability: 0.04 },
    ],
    triage: [
      {
        id: "q-vec",
        question: "พบแมลงหวี่ขาวยาสูบ (ตัวเล็กสีขาวบินใต้ใบ) เกาะอยู่ใต้ใบไหม?",
        why: "แมลงหวี่ขาวเป็นพาหะนำเชื้อไวรัส SLCMV หากพบจะยืนยันการระบาดได้แม่นยำขึ้น",
        options: ["พบจำนวนมาก", "พบบางจุด", "ไม่พบเลย"],
      },
      {
        id: "q-spread",
        question: "อาการเป็นเฉพาะใบยอด หรือลามมาจากท่อนพันธุ์เดิม?",
        why: "หากเป็นตั้งแต่ยอดแรกๆ แสดงว่าติดมากับท่อนพันธุ์ หากเริ่มเกิดที่ยอดอ่อนคือติดจากพาหะ",
        options: ["เริ่มเป็นที่ใบยอดอ่อน", "เป็นทั้งต้นตั้งแต่แรกงอก", "เป็นเฉพาะใบล่าง"],
      },
      {
        id: "q-extent",
        question: "พบอาการแบบนี้กี่ต้นในบริเวณใกล้เคียง?",
        why: "ประเมินระดับการระบาดเพื่อวางแผนการตัดทำลายและกักกันพื้นที่",
        options: ["1-5 ต้น (จุดเดี่ยว)", "กระจายตัวเป็นหย่อมๆ", "ลามเกินครึ่งแปลง"],
      },
    ],
    actions: [
      {
        title: "ถอนและทำลายต้นที่เป็นโรคทันที",
        detail: "ขุดถอนต้นที่แสดงอาการใส่ถุงดำปิดสนิท แล้วนำไปตากแดดหรือฝังกลบ ห้ามทิ้งไว้ในแปลงเด็ดขาด",
      },
      {
        title: "ควบคุมแมลงหวี่ขาวพาหะ",
        detail: "ฉีดพ่นเชื้อราชีวภัณฑ์บิวเวอร์เรีย (Beauveria bassiana) ช่วงเย็น เพื่อลดประชากรแมลงหวี่ขาวใต้ใบ",
      },
      {
        title: "คัดเลือกท่อนพันธุ์สะอาดในฤดูหน้า",
        detail: "ใช้พันธุ์ทนทาน เช่น เกษตรศาสตร์ 50 หรือ ระยอง 72 จากแหล่งเพาะปลอดโรคที่กรมวิชาการเกษตรรับรอง",
      },
    ],
  },
  {
    id: "rice-blast",
    name: "โรคไหม้ข้าว",
    thaiName: "โรคไหม้ข้าว (Rice Blast)",
    scientificName: "Magnaporthe oryzae",
    crop: "ข้าว",
    description: "แผลรูปตารูปกระสวย ตรงกลางสีเทา ขอบสีน้ำตาลเข้ม หากระบาดระยะแตกกอทำให้ใบแห้งตาย",
    affectedAreaPct: 14,
    confidence: 0.84,
    sampleSvg: "rice",
    candidates: [
      { label: "โรคไหม้ข้าวระยะใบ (Rice Leaf Blast)", probability: 0.84 },
      { label: "โรคใบจุดสีน้ำตาล (Brown Spot)", probability: 0.11 },
      { label: "อาการใบไหม้จากแดด / ขาดน้ำ", probability: 0.05 },
    ],
    triage: [
      {
        id: "q-center",
        question: "ตรงกลางแผลมีสีเทาหรือเทาอมเขียว และมีขอบสีน้ำตาลเข้มหรือไม่?",
        why: "แผลรูปกระสวยขอบน้ำตาลกลางเทาเป็นลักษณะจำเพาะของสปอร์เชื้อรา Pyricularia",
        options: ["ตรงกลางสีเทาชัดเจน", "เป็นจุดสีน้ำตาลล้วน", "ใบแห้งเหลืองจากปลาย"],
      },
      {
        id: "q-nitrogen",
        question: "ช่วง 7-10 วันที่ผ่านมา มีการหว่านปุ๋ยยูเรีย (46-0-0) ในปริมาณสูงหรือไม่?",
        why: "ไนโตรเจนส่วนเกินทำให้ผนังเซลล์ข้าวอ่อนแอ เหมาะแก่การงอกของเส้นใยเชื้อรา",
        options: ["ใส่ปุ๋ยไนโตรเจนสูง", "ใส่ปุ๋ยสูตรเสมอปกติ", "ยังไม่ได้ใส่ปุ๋ย"],
      },
      {
        id: "q-fog",
        question: "มีหมอกหนา น้ำค้างแรง หรือฝนตกปรอยๆ ในช่วงเช้าติดต่อกันไหม?",
        why: "ความชื้นสัมพัทธ์เกิน 90% และหยดน้ำค้างค้างบนใบเกิน 6 ชม. กระตุ้นการระบาดอย่างรวดเร็ว",
        options: ["หมอกและน้ำค้างแรงมาก", "อากาศร้อนแห้ง", "ฝนตกหนักน้ำท่วมขัง"],
      },
    ],
    actions: [
      {
        title: "งดใส่ปุ๋ยไนโตรเจนทันที",
        detail: "หยุดการหว่านยูเรียในแปลงที่พบอาการ เพื่อไม่ให้ต้นข้าวอวบน้ำและเชื้อราลุกลาม",
      },
      {
        title: "ฉีดพ่นเชื้อราปฏิปักษ์ไตรโคเดอร์มา",
        detail: "ใช้เชื้อสดไตรโคเดอร์มา ผสมน้ำฉีดพ่นช่วงเย็นคลุมหน้าใบและโคนกอ เพื่อยับยั้งสปอร์เชื้อรา",
      },
      {
        title: "รักษาระดับน้ำในแปลง",
        detail: "ระบายน้ำเก่าออกและเติมน้ำสะอาดใหม่สูง 5-10 ซม. เพื่อลดการสะสมของสปอร์บนผิวน้ำ",
      },
    ],
  },
  {
    id: "corn-armyworm",
    name: "หนอนกระทู้ข้าวโพดลายจุด",
    thaiName: "หนอนกระทู้ข้าวโพดลายจุด (Fall Armyworm)",
    scientificName: "Spodoptera frugiperda",
    crop: "ข้าวโพดหวาน",
    description: "ใบมีรอยกัดขาดเป็นรู พรุน พบขี้หนอนลักษณะคล้ายขี้เลื่อยสะสมในกรวยยอด ข้าวโพดชะงักการเจริญเติบโต",
    affectedAreaPct: 22,
    confidence: 0.91,
    sampleSvg: "corn",
    candidates: [
      { label: "หนอนกระทู้ข้าวโพดลายจุด (FAW)", probability: 0.91 },
      { label: "หนอนเจาะสมอฝ้าย (Helicoverpa)", probability: 0.06 },
      { label: "ตั๊กแตนกัดกินใบ", probability: 0.03 },
    ],
    triage: [
      {
        id: "q-head",
        question: "พบหนอนที่หัวมีรอยรูปตัว Y หัวกลับ และตุ่มสีดำเรียง 4 จุดที่ปล้องก้นหรือไม่?",
        why: "เป็นสัญลักษณ์เฉพาะตัว (Diagnostic key) ของหนอนกระทู้ลายจุด Spodoptera frugiperda",
        options: ["เห็นรอยตัว Y และตุ่ม 4 จุดชัดเจน", "ตัวหนอนสีเขียวไม่มีรอย", "ยังไม่เห็นตัวหนอน เห็นแต่รอยกัด"],
      },
      {
        id: "q-frass",
        question: "มีมูลหนอนลักษณะเป็นก้อนผงขี้เลื่อยอุดอยู่ในยอดข้าวโพดหรือไม่?",
        why: "หนอนจะหลบแดดเข้าไปกัดกินอยู่ลึกในกรวยยอดและทิ้งมูลไว้",
        options: ["พบขี้เลื่อยในกรวยยอดเกือบทุกต้น", "พบประปราย", "ไม่พบขี้เลื่อย"],
      },
    ],
    actions: [
      {
        title: "ใช้ชีวภัณฑ์เชื้อบีที (Bacillus thuringiensis)",
        detail: "ฉีดพ่นเชื้อ BT สายพันธุ์ kurstaki หรือ aizawai ลงในกรวยยอดช่วงเย็นที่มีแดดร่ม",
      },
      {
        title: "ปล่อยแมลงศัตรูธรรมชาติ",
        detail: "ปล่อยแตนเบียนไข่ทริกโคแกรมมา (Trichogramma) หรือแมลงหางหนีบในแปลง",
      },
      {
        title: "ติดกับดักฟีโรโมนล่อผีเสื้อตัวเต็มวัย",
        detail: "ติดตั้งกับดักกาวเหนียวหรือฟีโรโมน 3-5 จุดต่อไร่ เพื่อตัดวงจรการวางไข่",
      },
    ],
  },
  {
    id: "durian-canker",
    name: "โรครากเน่าโคนเน่าทุเรียน",
    thaiName: "โรครากเน่าโคนเน่าทุเรียน (Phytophthora)",
    scientificName: "Phytophthora palmivora",
    crop: "ทุเรียน",
    description: "เปลือกลำต้นมีน้ำเยิ้มสีน้ำตาลแดง ยอดแห้ง ใบเหลืองร่วง รากฝอยเน่าเปื่อยเปลือกล่อน",
    affectedAreaPct: 15,
    confidence: 0.86,
    sampleSvg: "durian",
    candidates: [
      { label: "โรครากเน่าโคนเน่า (Phytophthora palmivora)", probability: 0.86 },
      { label: "มอดเจาะลำต้นทุเรียน (Xyleborus)", probability: 0.09 },
      { label: "อาการขาดธาตุเหล็ก / ดินแน่นน้ำขัง", probability: 0.05 },
    ],
    triage: [
      {
        id: "q-ooze",
        question: "พบคราบน้ำเยิ้มสีน้ำตาลแดงคล้ายยางไม้ไหลซึมจากเปลือกต้นหรือกิ่งหรือไม่?",
        why: "เชื้อไฟทอปธอร่าจะทำลายเนื้อเยื่อท่อน้ำท่ออาหารจนเกิดของเหลวซึมออกมา",
        options: ["มีน้ำยางสีน้ำตาลเยิ้มชัดเจน", "เปลือกแตกแห้งไม่มีน้ำ", "เป็นเฉพาะใบไม่มีแผลที่ลำต้น"],
      },
      {
        id: "q-drain",
        question: "บริเวณโคนต้นมีน้ำขัง หรือมีการพูนดินกลบโคนสูงเกินไปไหม?",
        why: "ความชื้นสะสมที่โคนต้นและรากเป็นปัจจัยหลักให้สปอร์เชื้อราเจริญเติบโต",
        options: ["ดินแฉะน้ำขังบ่อย", "ดินโปร่งระบายน้ำดี", "ระบบน้ำหยดพ่นโดนโคนต้นตรงๆ"],
      },
    ],
    actions: [
      {
        title: "ถากเปลือกและทาชีวภัณฑ์รักษาแผล",
        detail: "ใช้มีดคมถากเปลือกเน่าออกให้ถึงเนื้อไม้ดี แล้วทาด้วยผงเชื้อราไตรโคเดอร์มาชนิดเข้มข้น",
      },
      {
        title: "ปรับปรุงการระบายน้ำรอบทรงพุ่ม",
        detail: "ขุดร่องระบายน้ำรอบโคนต้น อย่าให้น้ำขัง ปรับหัวสปริงเกลอร์ไม่ให้ฉีดพ่นโดนลำต้นตรงๆ",
      },
      {
        title: "ราดโคนด้วยเชื้อราไตรโคเดอร์มาผสมปุ๋ยหมัก",
        detail: "ราดเชื้อไตรโคเดอร์มาลงดินรอบรัศมีทรงพุ่มทุก 15-30 วัน เพื่อควบคุมเชื้อในดิน",
      },
    ],
  },
  {
    id: "healthy-crop",
    name: "พืชสมบูรณ์แข็งแรงดี",
    thaiName: "พืชมีสุขภาพสมบูรณ์ดี (Healthy Crop)",
    scientificName: "Optimal Vegetative Growth",
    crop: "ข้าว",
    description: "ใบมีสีเขียวสม่ำเสมอ ผิวใบมันเงา ปราศจากรอยโรคและแมลงศัตรูพืช การเจริญเติบโตอยู่ในเกณฑ์ดีเยี่ยม",
    affectedAreaPct: 0,
    confidence: 0.96,
    sampleSvg: "healthy",
    candidates: [
      { label: "พืชสุขภาพดี สมบูรณ์ตามเกณฑ์", probability: 0.96 },
      { label: "พบฝุ่นผงบนผิวใบเล็กน้อย", probability: 0.04 },
    ],
    triage: [
      {
        id: "q-vigor",
        question: "อัตราการแตกใบใหม่และสีของยอดอ่อนสม่ำเสมอดีไหม?",
        why: "ยืนยันความสมบูรณ์ของระบบรากและการดูดซึมธาตุอาหาร",
        options: ["ยอดอ่อนเขียวสดใส แตกใบสม่ำเสมอ", "โตช้ากว่าปกติเล็กน้อย"],
      },
    ],
    actions: [
      {
        title: "รักษาตารางการให้น้ำตามเกณฑ์เซนเซอร์",
        detail: "รักษาระดับความชื้นดินให้อยู่ในช่วง 35-40% ตามค่าที่แนะนำ",
      },
      {
        title: "ตรวจติดตามแปลงสัปดาห์ละ 1 ครั้ง",
        detail: "สแกนถ่ายรูปใบเป็นประจำทุกสัปดาห์เพื่อเก็บประวัติดิจิทัลฟาร์มและตรวจพบความผิดปกติตั้งแต่ระยะเริ่มต้น",
      },
    ],
  },
];

/* ---------- คลังคำตอบ AI สำหรับผู้ช่วยฟาร์มอัจฉริยะ (AI Knowledge Engine) ---------- */
export function queryAiAgronomy(question: string, contextPlotId?: string) {
  const q = question.toLowerCase();
  const plot = contextPlotId ? getPlot(contextPlotId) : undefined;

  if (q.includes("รดน้ำ") || q.includes("ความชื้น") || q.includes("ปั๊ม")) {
    return {
      text: "จากการตรวจสอบข้อมูลเซนเซอร์สภาพอากาศและความชื้นดินวันนี้ แนะนำให้ **ชะลอการรดน้ำแปลง A-02 และ A-01 ออกไปก่อน** เนื่องจากพยากรณ์อากาศตรวจพบโอกาสฝนตก 45% (18–26 มม.) ในช่วงบ่ายนี้ ความชื้นดินปัจจุบันอยู่ที่ 36% ซึ่งเพียงพอสำหรับระยะแตกกอ จะช่วยประหยัดค่าไฟสูบน้ำได้ประมาณ ฿420",
      confidence: 0.92,
      reasons: [
        "เซนเซอร์วัดความชื้นดินปัจจุบัน 36% (เป้าหมาย 35%)",
        "เรดาร์กรมอุตุนิยมวิทยาตรวจพบกลุ่มฝนเคลื่อนตัวเข้า อ.บ้านไผ่ ในอีก 4 ชั่วโมง",
        "การให้น้ำซ้ำซ้อนจะเพิ่มความเสี่ยงโรครากเน่าและสูญเสียปุ๋ยทางน้ำ",
      ],
      citations: [{ plotId: "A-02", topic: "เซนเซอร์ความชื้นดิน" }, { topic: "พยากรณ์อากาศ 7 วัน" }],
      actionLink: { label: "ตรวจสอบเซนเซอร์แปลง A-02", href: "/plots/A-02" },
    };
  }

  if (q.includes("ใบด่าง") || q.includes("มันสำปะหลัง") || q.includes("slcmv") || q.includes("ไวรัส")) {
    return {
      text: "อาการใบด่างในมันสำปะหลังเกิดจากเชื้อไวรัส SLCMV มี **แมลงหวี่ขาวยาสูบเป็นพาหะ** โรคนี้ไม่มียาเคมีรักษาโดยตรง แนะนำให้: 1. ถอนต้นที่เป็นโรคใส่ถุงดำนำไปตากแดดหรือฝังทำลายทันที 2. ฉีดพ่นชีวภัณฑ์บิวเวอร์เรียคุมแมลงหวี่ขาวใต้ใบ 3. ฤดูหน้าเลือกใช้ท่อนพันธุ์สะอาดต้านทานโรค (เช่น ระยอง 72 หรือ เกษตรศาสตร์ 50)",
      confidence: 0.95,
      reasons: [
        "อ้างอิงแนวทางควบคุมโรคใบด่างมันสำปะหลัง กรมวิชาการเกษตร (2567)",
        "ไม่แนะนำสารเคมีฆ่าเชื้อไวรัสเพราะไม่มีอยู่จริง การถอนทำลายคือวิธีเดียวที่ตัดวงจรได้",
      ],
      citations: [{ plotId: "A-02", topic: "ประวัติแปลงมันสำปะหลัง" }, { topic: "กรมวิชาการเกษตร" }],
      actionLink: { label: "เปิดโหมดถ่ายรูปสแกนใบมัน", href: "/scan?plot=A-02" },
    };
  }

  if (q.includes("ต้นทุน") || q.includes("กำไร") || q.includes("เงิน") || q.includes("ราคา")) {
    return {
      text: "แปลงข้าว A-01 (12 ไร่) ปัจจุบันมีต้นทุนสะสมอยู่ที่ **฿3,420 ต่อไร่** (ปุ๋ย 41%, ค่าเตรียมดินและแรงงาน 34%, เมล็ดพันธุ์ 15%, น้ำมัน 10%) คาดการณ์ผลผลิต 810 กก./ไร่ ที่ราคาตลาดปัจจุบัน ฿15.40/กก. จะมีรายได้ ฿12,474/ไร่ หักต้นทุนแล้วจะเหลือ **กำไรสุทธิประมาณ ฿3,860 ต่อไร่**",
      confidence: 0.89,
      reasons: [
        "คำนวณจากบันทึกค่าใช้จ่ายจริงในแปลง 62 วันที่ผ่านมา",
        "เทียบกับราคาข้าวเปลือกหอมมะลิความชื้น 15% จากกรมการค้าภายใน ณ วันนี้",
      ],
      citations: [{ plotId: "A-01", topic: "บัญชีต้นทุนแปลง A-01" }, { topic: "ราคาตลาดกลาง DIT" }],
      actionLink: { label: "ดูสรุปกำไรและโครงสร้างต้นทุน", href: "/money" },
    };
  }

  if (q.includes("ปุ๋ย") || q.includes("ph") || q.includes("ดิน")) {
    return {
      text: "สำหรับแปลง A-02 ดินมีค่า pH 5.2 (ค่อนข้างเป็นกรด) ทำให้พืชดูดซึมฟอสฟอรัสได้ลดลง ~30% แนะนำให้ **ปรับปรุงดินด้วยปูนโดโลไมท์ 50 กก./ไร่** ร่วมกับปุ๋ยหมักชีวภาพ และปรับสูตรปุ๋ยใส่ทางใบเสริมในช่วงที่พืชกำลังสร้างหัว",
      confidence: 0.91,
      reasons: [
        "ผลตรวจวิเคราะห์ชุดดินแปลง A-02 ค่า pH 5.2 ต่ำกว่าเกณฑ์ที่เหมาะสม (5.8-6.5)",
        "ปุ๋ยเม็ดทางดินสูญเสียประสิทธิภาพเมื่อดินเป็นกรด",
      ],
      citations: [{ plotId: "A-02", topic: "ผลตรวจกรดด่างดิน" }],
      actionLink: { label: "ดูรายละเอียดแปลง A-02", href: "/plots/A-02" },
    };
  }

  if (q.includes("ปลูกอะไร") || q.includes("ฤดูหน้า") || q.includes("พืชหมุนเวียน")) {
    return {
      text: "หลังเก็บเกี่ยวข้าวแปลง A-01 และ A-03 ในช่วงเดือนพฤศจิกายน แนะนำให้ปลูก **ถั่วเขียวผิวดำ หรือ ถั่วพร้า เป็นพืชบำรุงดิน** เนื่องจากช่วยตรึงไนโตรเจนในดินได้ 8–12 กก./ไร่ ลดต้นทุนปุ๋ยเคมีในฤดูถัดไปได้ ฿350/ไร่ และใช้น้ำน้อยมากเพียง 300 ลบ.ม./ไร่",
      confidence: 0.87,
      reasons: [
        "แปลงมีระบบระบายน้ำพร้อม ดินร่วนปนทรายเหมาะกับพืชตระกูลถั่ว",
        "ช่วยตัดวงจรโรคไหม้และแมลงศัตรูข้าว",
      ],
      citations: [{ topic: "คู่มือพืชปุ๋ยสด กรมพัฒนาที่ดิน" }],
      actionLink: { label: "เปิดดู Digital Farm Twin", href: "/dashboard" },
    };
  }

  // Generic fallback with context
  return {
    text: `สวัสดีครับคุณลุงประดิษฐ์ ระบบ NEXORA AGRI AI ตรวจสอบแปลง ${plot ? plot.id : "ทั้ง 12 แปลง"} ให้แล้วครับ วันนี้สถานะโดยรวมมีสุขภาพพืชเฉลี่ย 87% มีเรื่องเร่งด่วนคือใบข้าวโพดแปลง D-01 ที่ต้องตรวจสอบรอยหนอนกระทู้ และแปลง A-02 ที่ต้องรอสังเกตฝนช่วงบ่ายครับ หากต้องการให้ช่วยคำนวณปุ๋ย วิเคราะห์โรค หรือตรวจสอบราคาผลผลิต สามารถถามได้ทันทีครับ`,
    confidence: 0.85,
    reasons: [
      "สรุปข้อมูลสุขภาพพืชรายแปลงและความชื้นดินล่าสุด",
      "ระบบ AI ติดตามความเสี่ยงสภาพอากาศและแมลงศัตรูพืช 24 ชม.",
    ],
    citations: [{ topic: "ระบบสรุปสถานะฟาร์มอัจฉริยะ" }],
    actionLink: { label: "ดูรายการงานวันนี้", href: "/" },
  };
}

