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
      remind48h: data.get("remind48h") === "on",
    };
    try {
      if (task) await updateTask(task.id, input, task.dueDate.toDate());
      else await createTask(user.uid, input);
      router.push("/dashboard");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No pudimos guardar la tarea."); setSubmitting(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="surface relative overflow-hidden rounded-[2rem] p-5 sm:p-8">
      <CapiCharacter mood="chef" className="pointer-events-none absolute -right-7 -top-8 hidden h-36 opacity-25 sm:block" />
      <div className="grid gap-6">
        <label><span className="mb-2 block text-sm font-black">Título *</span><input className="field" name="title" defaultValue={task?.title} maxLength={100} placeholder="Ej: Enviar presupuesto" required autoFocus /></label>
        <label><span className="mb-2 block text-sm font-black">Descripción</span><textarea className="field min-h-28 resize-y" name="description" defaultValue={task?.description} maxLength={500} placeholder="Agregá contexto, links o próximos pasos…" /></label>
        <div className="grid gap-6 sm:grid-cols-2">
          <label><span className="mb-2 block text-sm font-black">Fecha límite *</span><input className="field" name="dueDate" type="datetime-local" min={task ? undefined : minDate} defaultValue={task ? toDateTimeLocal(task.dueDate.toDate()) : defaultDate} required /></label>
          <label><span className="mb-2 block text-sm font-black">Prioridad</span><select className="field" name="priority" defaultValue={task?.priority || "medium"}><option value="low">Baja · puede esperar</option><option value="medium">Media · importante</option><option value="high">Alta · primero esto</option></select></label>
        </div>
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#4b2e1f]/10 bg-[#7a9d54]/8 p-4"><div className="flex gap-3"><BellRing className="mt-0.5 shrink-0 text-[#6f8f4d]" size={21} /><div><span className="block font-black">Avisarme 48 horas antes</span><span className="text-sm font-semibold text-[#4b2e1f]/50">Recibí una notificación si la tarea sigue pendiente.</span></div></div><input className="h-5 w-5 accent-[#6f8f4d]" name="remind48h" type="checkbox" defaultChecked={task?.remind48h ?? true} /></label>
        {error && <p role="alert" className="rounded-xl bg-[#c65d4a]/10 p-3 text-sm font-bold text-[#9b4032]">{error}</p>}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button className="btn btn-secondary" type="button" onClick={() => router.back()}>Cancelar</button><button className="btn btn-primary" disabled={submitting} type="submit"><Save size={18} />{submitting ? "Guardando…" : task ? "Guardar cambios" : "Crear tarea"}</button></div>
      </div>
    </form>
  );
}
