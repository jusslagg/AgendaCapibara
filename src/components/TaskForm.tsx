"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BellRing, Save } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { CapiCharacter } from "./CapiCharacter";
import { createTask, updateTask } from "@/lib/tasks";
import { toDateTimeLocal } from "@/lib/dates";
import type { Priority, Task } from "@/types/task";

export function TaskForm({ task }: { task?: Task }) {
  const { user } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const minDate = toDateTimeLocal(new Date());
  const defaultDate = toDateTimeLocal(new Date(Date.now() + 24 * 3_600_000));
  const legacyReminderMinutes = task?.reminderMinutes ?? (task?.remind48h ? 48 * 60 : 24 * 60);
  const defaultReminderUnit = legacyReminderMinutes % (24 * 60) === 0 ? "days" : "hours";
  const defaultReminderAmount = defaultReminderUnit === "days" ? legacyReminderMinutes / (24 * 60) : legacyReminderMinutes / 60;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setError(""); setSubmitting(true);
    const data = new FormData(event.currentTarget);
    const input = {
      title: String(data.get("title")),
      description: String(data.get("description") || ""),
      dueDate: new Date(String(data.get("dueDate"))),
      priority: String(data.get("priority")) as Priority,
      reminderEnabled: data.get("reminderEnabled") === "on",
      reminderMinutes: Math.round(Number(data.get("reminderAmount")) * (data.get("reminderUnit") === "days" ? 24 * 60 : 60)),
    };
    try {
      if (task) await updateTask(task.id, input, task.dueDate.toDate(), legacyReminderMinutes, task.reminderEnabled ?? task.remind48h ?? true);
      else await createTask(user.uid, input);
      router.push("/dashboard");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No pudimos guardar la tarea."); setSubmitting(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="surface relative overflow-hidden rounded-[2rem] p-5 sm:p-8">
      <CapiCharacter mood="chef" className="pointer-events-none absolute -right-7 -top-8 hidden h-36 opacity-25 sm:block" />
      <div className="grid gap-6">
        <label><span className="mb-2 block text-sm font-black">Proyecto / pieza *</span><input className="field" name="title" defaultValue={task?.title} maxLength={100} placeholder="Ej: Key visual campaña otoño" required autoFocus /></label>
        <label><span className="mb-2 block text-sm font-black">Brief y entregables</span><textarea className="field min-h-28 resize-y" name="description" defaultValue={task?.description} maxLength={500} placeholder="Formato, medidas, referencias, links y próxima revisión…" /></label>
        <div className="grid gap-6 sm:grid-cols-2">
          <label><span className="mb-2 block text-sm font-black">Fecha límite *</span><input className="field" name="dueDate" type="datetime-local" min={task ? undefined : minDate} defaultValue={task ? toDateTimeLocal(task.dueDate.toDate()) : defaultDate} required /></label>
          <label><span className="mb-2 block text-sm font-black">Prioridad</span><select className="field" name="priority" defaultValue={task?.priority || "medium"}><option value="low">Baja · puede esperar</option><option value="medium">Media · importante</option><option value="high">Alta · primero esto</option></select></label>
        </div>
        <fieldset className="rounded-2xl border border-[#4b2e1f]/10 bg-[#7a9d54]/8 p-4">
          <div className="flex items-start gap-3"><BellRing className="mt-0.5 shrink-0 text-[#6f8f4d]" size={21} /><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-4"><div><legend className="font-black">Recordatorio</legend><p className="text-sm font-semibold text-[#4b2e1f]/50">Elegí con cuánta anticipación querés recibirlo.</p></div><input aria-label="Activar recordatorio" className="h-5 w-5 shrink-0 accent-[#6f8f4d]" name="reminderEnabled" type="checkbox" defaultChecked={task?.reminderEnabled ?? task?.remind48h ?? true} /></div>
            <div className="mt-4 grid grid-cols-[1fr_1.35fr] gap-3"><label><span className="sr-only">Cantidad</span><input aria-label="Cantidad de anticipación" className="field" name="reminderAmount" type="number" min="1" max="30" step="1" defaultValue={defaultReminderAmount} required /></label><label><span className="sr-only">Unidad</span><select aria-label="Unidad de anticipación" className="field" name="reminderUnit" defaultValue={defaultReminderUnit}><option value="hours">horas antes</option><option value="days">días antes</option></select></label></div>
            <p className="mt-2 text-xs font-semibold text-[#4b2e1f]/45">La revisión automática se ejecuta cada hora. Máximo: 30 días.</p>
          </div></div>
        </fieldset>
        {error && <p role="alert" className="rounded-xl bg-[#c65d4a]/10 p-3 text-sm font-bold text-[#9b4032]">{error}</p>}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button className="btn btn-secondary" type="button" onClick={() => router.back()}>Cancelar</button><button className="btn btn-primary" disabled={submitting} type="submit"><Save size={18} />{submitting ? "Guardando…" : task ? "Guardar cambios" : "Crear tarea"}</button></div>
      </div>
    </form>
  );
}
