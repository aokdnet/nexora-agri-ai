"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  PLOTS as INITIAL_PLOTS,
  DAILY_TASKS as INITIAL_TASKS,
  SEASON as INITIAL_SEASON,
  queryAiAgronomy,
} from "./data";
import {
  Plot,
  DailyTask,
  ChatMessage,
  SubscriptionStatus,
  CostLine,
} from "./types";
import { supabase } from "./supabase";

interface AppContextType {
  plots: Plot[];
  tasks: DailyTask[];
  chatMessages: ChatMessage[];
  subscription: SubscriptionStatus;
  customCosts: CostLine[];
  scanHistory: {
    id: string;
    plotId: string;
    presetId: string;
    diseaseName: string;
    severity: number;
    confidence: number;
    timestamp: string;
    imageUrl?: string;
  }[];
  iotMode: "normal" | "rain" | "drought";
  setIotMode: (mode: "normal" | "rain" | "drought") => void;

  // Plot Actions
  addPlot: (plot: Omit<Plot, "id" | "photoCount" | "mapPoints" | "lastIrrigation" | "lastFertilizer">) => Plot;
  updatePlot: (id: string, updates: Partial<Plot>) => void;
  deletePlot: (id: string) => void;
  irrigatePlot: (id: string, minutes?: number) => void;
  fertilizePlot: (id: string, formula?: string) => void;

  // Task Actions
  completeTask: (id: string) => void;

  // Chat Actions
  sendChatMessage: (text: string, contextPlotId?: string) => Promise<void>;
  clearChat: () => void;

  // Scan Actions
  saveScanResult: (scan: {
    plotId: string;
    presetId: string;
    diseaseName: string;
    severity: number;
    confidence: number;
    imageUrl?: string;
  }) => void;

  // Subscription Actions
  upgradeSubscription: (tierId: "free" | "pro" | "smart" | "enterprise", billingCycle?: "monthly" | "annual") => void;

  // Financial Actions
  addCost: (label: string, amount: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  PLOTS: "nexora_plots_v2",
  TASKS: "nexora_tasks_v2",
  CHAT: "nexora_chat_v2",
  SUBSCRIPTION: "nexora_sub_v2",
  COSTS: "nexora_costs_v2",
  SCANS: "nexora_scans_v2",
};

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [plots, setPlots] = useState<Plot[]>(INITIAL_PLOTS);
  const [tasks, setTasks] = useState<DailyTask[]>(INITIAL_TASKS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    tierId: "pro",
    tierName: "Smart Farmer (ทดลองใช้ฟรี)",
    billingCycle: "monthly",
    isActive: true,
    expiresAt: "2026-09-21",
    trialDaysLeft: 30,
  });
  const [customCosts, setCustomCosts] = useState<CostLine[]>(INITIAL_SEASON.costs);
  const [scanHistory, setScanHistory] = useState<AppContextType["scanHistory"]>([]);
  const [iotMode, setIotMode] = useState<"normal" | "rain" | "drought">("normal");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial data from localStorage and Supabase
  useEffect(() => {
    async function loadData() {
      try {
        const storedPlots = localStorage.getItem(STORAGE_KEYS.PLOTS);
        if (storedPlots) setPlots(JSON.parse(storedPlots));

        // Fetch fresh plots from Supabase if logged in
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          const { data: dbPlots, error } = await supabase
            .from("plots")
            .select("plot_data")
            .eq("user_id", authData.user.id);
            
          if (!error && dbPlots && dbPlots.length > 0) {
            const syncedPlots = dbPlots.map((row: any) => row.plot_data);
            setPlots(syncedPlots);
            localStorage.setItem(STORAGE_KEYS.PLOTS, JSON.stringify(syncedPlots));
          }
        }

      const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (storedTasks) setTasks(JSON.parse(storedTasks));

      const storedChat = localStorage.getItem(STORAGE_KEYS.CHAT);
      if (storedChat) {
        setChatMessages(JSON.parse(storedChat));
      } else {
        // Initial AI greeting message
        setChatMessages([
          {
            id: "msg-init",
            sender: "assistant",
            text: "สวัสดีครับคุณลุงประดิษฐ์ ผมคือ **NEXORA AI Farm Assistant** ผู้ช่วยอัจฉริยะประจำฟาร์มของคุณ ตรวจสอบข้อมูลสภาพอากาศและความชื้นดิน 12 แปลงให้เรียบร้อยแล้ว มีเรื่องอะไรให้ผมช่วยแนะนำวันนี้ไหมครับ?",
            timestamp: "06:40 น.",
            confidence: 0.98,
            reasons: ["เชื่อมต่อข้อมูล IoT และสภาพอากาศรายแปลงเรียบร้อย"],
            citations: [{ topic: "ระบบสรุปสถานะฟาร์ม 86 ไร่" }],
          },
        ]);
      }

      const storedSub = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
      if (storedSub) setSubscription(JSON.parse(storedSub));

      const storedCosts = localStorage.getItem(STORAGE_KEYS.COSTS);
      if (storedCosts) setCustomCosts(JSON.parse(storedCosts));

      const storedScans = localStorage.getItem(STORAGE_KEYS.SCANS);
      if (storedScans) setScanHistory(JSON.parse(storedScans));
      } catch (e) {
        console.error("Failed to load state:", e);
      } finally {
        setIsLoaded(true);
      }
    }
    loadData();
  }, []);

  // Save to localStorage when states change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PLOTS, JSON.stringify(plots));
    } catch (e) {}
  }, [plots, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {}
  }, [tasks, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatMessages));
    } catch (e) {}
  }, [chatMessages, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(subscription));
    } catch (e) {}
  }, [subscription, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.COSTS, JSON.stringify(customCosts));
    } catch (e) {}
  }, [customCosts, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(scanHistory));
    } catch (e) {}
  }, [scanHistory, isLoaded]);

  // IoT Simulation effect
  useEffect(() => {
    if (iotMode === "rain") {
      setPlots((prev) =>
        prev.map((p) => ({
          ...p,
          soilMoisture: Math.min(100, p.soilMoisture + 15),
          health: Math.min(100, p.health + 2),
        }))
      );
    } else if (iotMode === "drought") {
      setPlots((prev) =>
        prev.map((p) => ({
          ...p,
          soilMoisture: Math.max(10, p.soilMoisture - 12),
          status: p.soilMoisture - 12 < 20 ? "crit" : "warn",
        }))
      );
    }
  }, [iotMode]);

  const addPlot = (
    newPlotData: Omit<Plot, "id" | "photoCount" | "mapPoints" | "lastIrrigation" | "lastFertilizer">
  ): Plot => {
    const nextNum = plots.length + 1;
    const prefix = newPlotData.crop === "ข้าว" ? "A" : newPlotData.crop === "มันสำปะหลัง" ? "B" : "G";
    const id = `${prefix}-0${nextNum}`;
    
    // Generate pseudo map polygon point
    const mapPoints = `${20 + (nextNum * 35) % 500},${40 + (nextNum * 25) % 250} ${110 + (nextNum * 35) % 500},${40 + (nextNum * 25) % 250} ${105 + (nextNum * 35) % 500},${110 + (nextNum * 25) % 250} ${15 + (nextNum * 35) % 500},${110 + (nextNum * 25) % 250}`;

    const newPlot: Plot = {
      ...newPlotData,
      id,
      photoCount: 0,
      mapPoints,
      lastIrrigation: "ยังไม่มีประวัติ",
      lastFertilizer: "ยังไม่มีประวัติ",
    };


    setPlots((prev) => [newPlot, ...prev]);

    // Sync to Supabase
    supabase.auth.getUser().then(({ data: authData }) => {
      if (authData?.user) {
        supabase.from("plots").upsert({
          id: newPlot.id,
          user_id: authData.user.id,
          name: `${newPlot.id} ${newPlot.crop}`,
          crop_type: newPlot.crop,
          area_size: newPlot.rai,
          status: newPlot.status === "ok" ? "healthy" : newPlot.status === "warn" ? "warning" : "critical",
          plot_data: newPlot,
        }).then(({ error }) => {
          if (error) console.error("Error syncing plot:", error);
        });
      }
    });

    return newPlot;
  };

  const updatePlot = (id: string, updates: Partial<Plot>) => {
    setPlots((prev) => {
      const newPlots = prev.map((p) => (p.id.toUpperCase() === id.toUpperCase() ? { ...p, ...updates } : p));
      const updatedPlot = newPlots.find(p => p.id.toUpperCase() === id.toUpperCase());
      
      if (updatedPlot) {
        supabase.auth.getUser().then(({ data: authData }) => {
          if (authData?.user) {
            supabase.from("plots").update({ plot_data: updatedPlot }).eq("id", id).then();
          }
        });
      }
      return newPlots;
    });
  };

  const deletePlot = (id: string) => {
    setPlots((prev) => prev.filter((p) => p.id.toUpperCase() !== id.toUpperCase()));
    supabase.from("plots").delete().eq("id", id).then();
  };

  const irrigatePlot = (id: string, minutes: number = 30) => {
    setPlots((prev) =>
      prev.map((p) => {
        if (p.id.toUpperCase() === id.toUpperCase()) {
          const nextMoisture = Math.min(100, Math.max(p.soilMoistureTarget, p.soilMoisture + 18));
          return {
            ...p,
            soilMoisture: nextMoisture,
            status: "ok",
            lastIrrigation: `เพิ่งรดน้ำวันนี้ ${minutes} นาที (อนุมัติผ่านระบบ)`,
          };
        }
        return p;
      })
    );
  };

  const fertilizePlot = (id: string, formula: string = "ปุ๋ยอินทรีย์ชีวภาพ") => {
    setPlots((prev) =>
      prev.map((p) => {
        if (p.id.toUpperCase() === id.toUpperCase()) {
          return {
            ...p,
            health: Math.min(100, p.health + 5),
            lastFertilizer: `ใส่ ${formula} วันนี้`,
          };
        }
        return p;
      })
    );
  };

  const completeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const sendChatMessage = async (text: string, contextPlotId?: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) + " น.",
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Simulate AI thinking and generate agronomy answer
    setTimeout(() => {
      const aiResponse = queryAiAgronomy(text, contextPlotId);
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: "assistant",
        text: aiResponse.text,
        timestamp: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) + " น.",
        confidence: aiResponse.confidence,
        reasons: aiResponse.reasons,
        citations: aiResponse.citations,
        actionLink: aiResponse.actionLink,
        audioAvailable: true,
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    }, 500);
  };

  const clearChat = () => {
    setChatMessages([]);
  };

  const saveScanResult = (scan: {
    plotId: string;
    presetId: string;
    diseaseName: string;
    severity: number;
    confidence: number;
    imageUrl?: string;
  }) => {
    const newEntry = {
      id: `scan-${Date.now()}`,
      ...scan,
      timestamp: new Date().toLocaleString("th-TH"),
    };
    setScanHistory((prev) => [newEntry, ...prev]);

    // Also increment plot photoCount
    setPlots((prev) =>
      prev.map((p) =>
        p.id.toUpperCase() === scan.plotId.toUpperCase()
          ? { ...p, photoCount: p.photoCount + 1 }
          : p
      )
    );
  };

  const upgradeSubscription = (
    tierId: "free" | "pro" | "smart" | "enterprise",
    billingCycle: "monthly" | "annual" = "monthly"
  ) => {
    const names = {
      free: "Free Starter",
      pro: "Smart Farmer (รายแปลง)",
      smart: "Smart Farm IoT (เต็มระบบ)",
      enterprise: "Enterprise สหกรณ์/กลุ่มเกษตรกร",
    };

    setSubscription({
      tierId,
      tierName: names[tierId],
      billingCycle,
      isActive: true,
      expiresAt: "2027-08-21",
      trialDaysLeft: 30,
    });
  };

  const addCost = (label: string, amount: number) => {
    setCustomCosts((prev) => [...prev, { label, amount }]);
  };

  const value = useMemo(
    () => ({
      plots,
      tasks,
      chatMessages,
      subscription,
      customCosts,
      scanHistory,
      iotMode,
      setIotMode,
      addPlot,
      updatePlot,
      deletePlot,
      irrigatePlot,
      fertilizePlot,
      completeTask,
      sendChatMessage,
      clearChat,
      saveScanResult,
      upgradeSubscription,
      addCost,
    }),
    [plots, tasks, chatMessages, subscription, customCosts, scanHistory, iotMode]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppStoreProvider");
  }
  return context;
}
