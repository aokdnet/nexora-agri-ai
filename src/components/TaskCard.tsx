"use client";

import Link from "next/link";
import { Chip } from "./Chip";
import { Icon } from "./Icon";
import { useAppStore } from "@/lib/store";
import type { DailyTask } from "@/lib/types";

const URGENCY = {
  urgent: { tone: "crit" as const, label: "ด่วน", cardClass: "card card-urgent" },
  decide: { tone: "water" as const, label: "รอตัดสินใจ", cardClass: "card card-soft" },
  log: { tone: "plain" as const, label: "บันทึก", cardClass: "card" },
};

export function TaskCard({ task }: { task: DailyTask }) {
  const { completeTask } = useAppStore();
  const meta = URGENCY[task.urgency];

  return (
    <article className={meta.cardClass}>
      <div className="task-top">
        <Chip tone={meta.tone} dot>
          {meta.label}
        </Chip>
        <h3 className="task-what">{task.what}</h3>
      </div>
      <p className="task-why">{task.why}</p>

      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        {task.actionLabel && task.actionHref ? (
          <Link
            href={task.actionHref}
            className={task.urgency === "urgent" ? "tap tap-primary" : "tap tap-ghost"}
            style={{ flex: 1.4 }}
          >
            {task.actionLabel}
          </Link>
        ) : null}

        <button
          type="button"
          onClick={() => completeTask(task.id)}
          className="tap tap-ghost"
          style={{
            flex: 1,
            border: "1px solid var(--line-soft)",
            fontSize: 13,
            color: "var(--muted)",
          }}
        >
          <Icon name="check" size={16} />
          เสร็จแล้ว
        </button>
      </div>
    </article>
  );
}
