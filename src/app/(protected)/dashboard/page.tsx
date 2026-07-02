"use client";

import Link from "next/link";
import { ArrowRight, BellRing, Plus } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { DashboardStats } from "@/components/DashboardStats";
import { CapiCharacter } from "@/components/CapiCharacter";
import { NotificationButton } from "@/components/NotificationButton";
import { TaskList } from "@/components/TaskList";
import { useTasks } from "@/hooks/useTasks";
import { isDueSoon } from "@/lib/dates";

export default function DashboardPage() {
  const { user } = useAuth();
  const pending = useTasks("pending");
  const completed = useTasks("completed");
  const dueSoon = pending.tasks.filter((task) => isDueSoon(task.dueDate.toDate()));
  const firstName = user?.displayName?.split(" ")[0] || "Capi";

  return (
    <main className="px-5 pb-10 pt-4 sm:px-8 sm:pt-8 xl:px-12">
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="mb-2 text-xs font-black uppercase tracking-[.18em] text-[#6f8f4d]">Tu día, de un vistazo</p><h1 className="text-3xl font-black tracking-[-.04em] sm:text-4xl">Hola, {firstName} <span aria-hidden>👋</span></h1><p className="mt-2 font-semibold text-[#4b2e1f]/50">Organicemos lo importante, con calma.</p></div>
        <Link href="/tasks/new" className="btn btn-primary hidden sm:inline-flex"><Plus size={18} />Nueva tarea</Link>
      </div>

      <DashboardStats pending={pending.tasks.length} dueSoon={dueSoon.length} completed={completed.tasks.length} />

      {dueSoon.length > 0 && <section className="relative mt-6 overflow-hidden rounded-[2rem] bg-[#4b2e1f] p-6 text-[#fff8ea] sm:p-8"><div className="absolute -right-12 -top-20 h-56 w-56 rounded-full bg-[#dfa878]/20" /><CapiCharacter mood="focus" className="absolute -bottom-12 right-4 hidden h-48 sm:block" /><div className="relative z-10 flex flex-col justify-between gap-5 pr-0 sm:flex-row sm:items-center sm:pr-44"><div><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black"><BellRing size={15} />Atención tranquila</span><h2 className="mt-4 text-2xl font-black">{dueSoon.length === 1 ? "Hay 1 tarea cerca de vencer" : `Hay ${dueSoon.length} tareas cerca de vencer`}</h2><p className="mt-1 text-sm font-semibold text-white/60">Las dejamos arriba de la pila para que nada te sorprenda.</p></div><a href="#tareas" className="btn bg-[#dfa878] text-[#4b2e1f]">Ver tareas <ArrowRight size={17} /></a></div></section>}

      <section id="tareas" className="mt-9 scroll-mt-5"><div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-2xl font-black tracking-[-.025em]">Tareas pendientes</h2><p className="mt-1 text-sm font-semibold text-[#4b2e1f]/45">Ordenadas por fecha límite</p></div><NotificationButton compact /></div>
        {pending.loading ? <div className="grid gap-4 xl:grid-cols-2">{[1,2].map((item) => <div key={item} className="surface h-52 animate-pulse rounded-[1.6rem]" />)}</div> : pending.error ? <p className="rounded-2xl bg-[#c65d4a]/10 p-4 font-bold text-[#9b4032]">{pending.error}</p> : <TaskList tasks={pending.tasks} />}
      </section>
    </main>
  );
}
