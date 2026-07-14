"use client";

import Link from "next/link";
import Image from "next/image";
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
  const firstName = user?.displayName?.split(" ")[0] || "Creativa";

  return (
    <main className="px-5 pb-10 pt-4 sm:px-8 sm:pt-8 xl:px-12">
      <div className="creative-masthead relative mb-8 flex min-h-44 flex-col justify-end gap-5 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0c] p-6 text-white sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <Image alt="Composición abstracta de cintas, planos y formas cromáticas" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-70" fill priority sizes="(max-width: 640px) 100vw, 80vw" src="/prism-abstract.png" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/5" />
        <div className="relative z-10"><p className="mb-2 text-xs font-black uppercase tracking-[.18em] text-[#b7ff19]">Panel de producción / hoy</p><h1 className="text-3xl font-black tracking-[-.04em] sm:text-4xl">Hola, {firstName} <span aria-hidden>✦</span></h1><p className="mt-2 font-semibold text-white/65">Pongamos ideas, revisiones y entregas en foco.</p></div>
        <Link href="/tasks/new" className="btn btn-primary relative z-10 hidden sm:inline-flex"><Plus size={18} />Nueva tarea</Link>
      </div>

      <DashboardStats pending={pending.tasks.length} dueSoon={dueSoon.length} completed={completed.tasks.length} />

      <section className="workflow-board relative mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-black text-white shadow-[0_24px_65px_rgba(0,0,0,.28)]">
        <Image alt="Panel editorial del proceso creativo con módulos de brief, idea, diseño y entrega" className="absolute inset-0 h-full w-full object-cover object-center" fill sizes="(max-width: 640px) 100vw, 80vw" src="/prism-workflow.png" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/20" />
        <div className="relative z-10 flex min-h-72 flex-col justify-between p-6 sm:min-h-80 sm:p-9">
          <div className="max-w-md"><p className="text-[10px] font-black uppercase tracking-[.3em] text-[#ff1744]">Método Prism / 04 etapas</p><h2 className="mt-3 text-3xl font-black uppercase leading-[.9] tracking-[-.05em] sm:text-5xl">Del brief<br />al archivo final.</h2><p className="mt-4 max-w-sm text-sm font-semibold leading-relaxed text-white/60">Un recorrido visual para ordenar el proceso sin apagar la parte creativa.</p></div>
          <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {[{ code: "Br", label: "Brief", color: "#ff7900" }, { code: "Id", label: "Idea", color: "#7b35ff" }, { code: "Di", label: "Diseño", color: "#f32075" }, { code: "Ex", label: "Entrega", color: "#00b8ee" }].map((stage, index) => <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/65 p-2.5 backdrop-blur" key={stage.code}><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-xs font-black text-white" style={{ background: stage.color }}>{stage.code}</span><span><small className="block text-[8px] font-black uppercase tracking-[.2em] text-white/35">0{index + 1}</small><strong className="text-xs uppercase tracking-wide">{stage.label}</strong></span></div>)}
          </div>
        </div>
      </section>

      {dueSoon.length > 0 && <section className="relative mt-6 overflow-hidden rounded-[2rem] bg-[#4b2e1f] p-6 text-[#fff8ea] sm:p-8"><Image alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" fill sizes="80vw" src="/prism-abstract.png" /><div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/45" /><CapiCharacter mood="focus" className="absolute -bottom-12 right-4 hidden h-48 sm:block" /><div className="relative z-10 flex flex-col justify-between gap-5 pr-0 sm:flex-row sm:items-center sm:pr-44"><div><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black"><BellRing size={15} />Deadline a la vista</span><h2 className="mt-4 text-2xl font-black">{dueSoon.length === 1 ? "Hay 1 tarea cerca de vencer" : `Hay ${dueSoon.length} tareas cerca de vencer`}</h2><p className="mt-1 text-sm font-semibold text-white/60">Las dejamos arriba de la pila para que nada te sorprenda.</p></div><a href="#tareas" className="btn bg-[#dfa878] text-[#4b2e1f]">Ver tareas <ArrowRight size={17} /></a></div></section>}

      <section id="tareas" className="mt-9 scroll-mt-5"><div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-2xl font-black tracking-[-.025em]">Proyectos en mesa</h2><p className="mt-1 text-sm font-semibold text-[#4b2e1f]/45">Ordenados por deadline</p></div><NotificationButton compact /></div>
        {pending.loading ? <div className="grid gap-4 xl:grid-cols-2">{[1,2].map((item) => <div key={item} className="surface h-52 animate-pulse rounded-[1.6rem]" />)}</div> : pending.error ? <p className="rounded-2xl bg-[#c65d4a]/10 p-4 font-bold text-[#9b4032]">{pending.error}</p> : <TaskList tasks={pending.tasks} />}
      </section>
    </main>
  );
}
