"use client";

import { PageHeading } from "@/components/PageHeading";
import { TaskList } from "@/components/TaskList";
import { useTasks } from "@/hooks/useTasks";

export default function CompletedPage() {
  const { tasks, loading, error } = useTasks("completed");
  return <main className="px-5 pb-10 pt-4 sm:px-8 sm:pt-8 xl:px-12"><PageHeading eyebrow="Archivo final" title="Entregas completadas" description="Todo lo aprobado, exportado y entregado." />{loading ? <div className="surface h-64 animate-pulse rounded-[2rem]" /> : error ? <p className="rounded-2xl bg-[#c65d4a]/10 p-4 font-bold text-[#9b4032]">{error}</p> : <TaskList tasks={tasks} completed />}</main>;
}
