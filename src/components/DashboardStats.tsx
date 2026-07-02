import { AlarmClock, CheckCircle2, ClipboardList } from "lucide-react";
import { CapiCharacter } from "./CapiCharacter";

export function DashboardStats({ pending, dueSoon, completed }: { pending: number; dueSoon: number; completed: number }) {
  const stats = [
    { label: "Pendientes", value: pending, icon: ClipboardList, mood: "chill" as const, tone: "bg-[#dfa878]/20 text-[#8b5e3c]" },
    { label: "Próximas 48 h", value: dueSoon, icon: AlarmClock, mood: "focus" as const, tone: "bg-[#e0a928]/16 text-[#8b6811]" },
    { label: "Completadas", value: completed, icon: CheckCircle2, mood: "party" as const, tone: "bg-[#7a9d54]/16 text-[#567238]" },
  ];
  return <div className="grid grid-cols-3 gap-2 sm:gap-4">{stats.map(({ label, value, icon: Icon, mood, tone }) => <div className="surface relative overflow-hidden rounded-2xl p-3 sm:rounded-[1.5rem] sm:p-5" key={label}><CapiCharacter mood={mood} className="absolute -bottom-5 -right-3 hidden h-24 opacity-25 sm:block" /><div className={`relative z-10 mb-3 grid h-9 w-9 place-items-center rounded-xl ${tone}`}><Icon size={18} /></div><strong className="relative z-10 text-2xl font-black sm:text-3xl">{value}</strong><p className="relative z-10 mt-1 text-[10px] font-extrabold text-[#4b2e1f]/45 sm:text-xs">{label}</p></div>)}</div>;
}
