import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";

export function EmptyState({ completed = false }: { completed?: boolean }) {
  return (
    <div className="surface relative grid min-h-80 place-items-center overflow-hidden rounded-[2rem] px-6 py-10 text-center">
      <Image alt="" className="absolute inset-0 h-full w-full object-cover opacity-[.12]" fill sizes="80vw" src="/prism-abstract.png" />
      <div className="relative z-10">
        <div className="mx-auto h-28 w-48 overflow-hidden rounded-2xl border border-white/10"><Image alt="Detalle de una composición abstracta de diseño" className="h-full w-full object-cover" height={112} src="/prism-abstract.png" width={192} /></div>
        <h3 className="mt-3 text-xl font-black">{completed ? "Todavía no hay entregas cerradas" : "La mesa está despejada"}</h3>
        <p className="mx-auto mt-2 max-w-sm font-semibold text-[#4b2e1f]/50">{completed ? "Cuando cierres una pieza, va a aparecer acá." : "Buen momento para cargar el próximo brief."}</p>
        {!completed && <Link href="/tasks/new" className="btn btn-primary mt-6"><Plus size={18} />Crear una tarea</Link>}
      </div>
    </div>
  );
}
