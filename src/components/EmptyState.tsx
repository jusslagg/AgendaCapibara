import Link from "next/link";
import { Plus } from "lucide-react";
import { CapiCharacter } from "./CapiCharacter";

export function EmptyState({ completed = false }: { completed?: boolean }) {
  return <div className="surface grid min-h-80 place-items-center rounded-[2rem] px-6 py-10 text-center"><div><CapiCharacter mood={completed ? "party" : "calm"} className="mx-auto h-40" /><h3 className="mt-3 text-xl font-black">{completed ? "Todavía no hay tareas completadas" : "Tu capibara está descansando"}</h3><p className="mx-auto mt-2 max-w-sm font-semibold text-[#4b2e1f]/50">{completed ? "Cuando completes una tarea, va a aparecer acá." : "No hay tareas pendientes. Disfrutá la calma o planificá lo próximo."}</p>{!completed && <Link href="/tasks/new" className="btn btn-primary mt-6"><Plus size={18} />Crear una tarea</Link>}</div></div>;
}
