"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { PageHeading } from "@/components/PageHeading";
import { TaskForm } from "@/components/TaskForm";
import { getTask } from "@/lib/tasks";
import type { Task } from "@/types/task";

export default function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!user) return;
    getTask(id).then((item) => {
      if (!item || item.userId !== user.uid) throw new Error("No encontramos esa tarea.");
      setTask(item);
    }).catch((cause: Error) => setError(cause.message)).finally(() => setLoading(false));
  }, [id, user]);
  return <main className="mx-auto max-w-4xl px-5 pb-10 pt-4 sm:px-8 sm:pt-8"><PageHeading eyebrow="Ajustar el rumbo" title="Editar tarea" description="Si cambiás la fecha, el recordatorio de 48 horas se activa nuevamente." />{loading ? <div className="surface h-96 animate-pulse rounded-[2rem]" /> : error ? <p className="rounded-2xl bg-[#c65d4a]/10 p-4 font-bold text-[#9b4032]">{error}</p> : task && <TaskForm task={task} />}</main>;
}
