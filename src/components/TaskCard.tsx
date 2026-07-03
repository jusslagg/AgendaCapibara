"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarClock, Check, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { PriorityBadge } from "./PriorityBadge";
import { CapiCharacter } from "./CapiCharacter";
import { formatDueDate, hoursUntil, isDueSoon } from "@/lib/dates";
import { removeTask, setTaskCompleted } from "@/lib/tasks";
import type { Task } from "@/types/task";

export function TaskCard({ task }: { task: Task }) {
  const [busy, setBusy] = useState(false);
  const date = task.dueDate.toDate();
  const overdue = hoursUntil(date) < 0 && task.status === "pending";
  const soon = isDueSoon(date) && task.status === "pending";
  const mood = task.status === "completed" ? "love" : task.priority === "high" ? "focus" : task.priority === "medium" ? "reading" : "chill";

  async function toggleCompleted() {
    setBusy(true);
    try { await setTaskCompleted(task.id, task.status !== "completed"); }
    finally { setBusy(false); }
  }
  async function handleDelete() {
    if (!window.confirm(`¿Eliminar “${task.title}”? Esta acción no se puede deshacer.`)) return;
    setBusy(true);
    try { await removeTask(task.id); }
    finally { setBusy(false); }
  }

  return (
    <article className="task-card surface group relative overflow-hidden rounded-[1.6rem] p-5 transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(75,46,31,.12)] sm:p-6">
      <CapiCharacter mood={mood} className="pointer-events-none absolute -bottom-8 right-12 h-24 opacity-[.12] transition group-hover:opacity-20" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2"><PriorityBadge priority={task.priority} />{soon && <span className="rounded-full bg-[#dfa878]/25 px-3 py-1 text-xs font-black text-[#9a5f32]">Vence pronto</span>}{overdue && <span className="rounded-full bg-[#c65d4a]/15 px-3 py-1 text-xs font-black text-[#9b4032]">Vencida</span>}</div>
          <h3 className={`mt-4 text-xl font-black tracking-[-.02em] ${task.status === "completed" ? "line-through opacity-45" : ""}`}>{task.title}</h3>
          {task.description && <p className="mt-2 line-clamp-2 text-sm font-semibold leading-relaxed text-[#4b2e1f]/55">{task.description}</p>}
        </div>
        <button onClick={toggleCompleted} disabled={busy} type="button" aria-label={task.status === "completed" ? "Restaurar tarea" : "Completar tarea"} className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition ${task.status === "completed" ? "bg-[#7a9d54] text-white" : "border-2 border-[#7a9d54]/30 text-[#6f8f4d] hover:bg-[#7a9d54] hover:text-white"}`}>{task.status === "completed" ? <RotateCcw size={19} /> : <Check size={21} strokeWidth={3} />}</button>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#4b2e1f]/8 pt-4">
        <span className={`flex items-center gap-2 text-xs font-extrabold ${overdue ? "text-[#c65d4a]" : "text-[#4b2e1f]/50"}`}><CalendarClock size={16} />{formatDueDate(date)}</span>
        <div className="flex gap-1">
          <Link href={`/tasks/${task.id}/edit`} aria-label="Editar tarea" className="grid h-10 w-10 place-items-center rounded-xl text-[#4b2e1f]/45 hover:bg-[#dfa878]/15 hover:text-[#4b2e1f]"><Pencil size={17} /></Link>
          <button onClick={handleDelete} disabled={busy} type="button" aria-label="Eliminar tarea" className="grid h-10 w-10 place-items-center rounded-xl text-[#4b2e1f]/45 hover:bg-[#c65d4a]/10 hover:text-[#c65d4a]"><Trash2 size={17} /></button>
        </div>
      </div>
    </article>
  );
}
