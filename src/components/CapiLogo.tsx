import { CapiCharacter } from "./CapiCharacter";

export function CapiLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`grid shrink-0 place-items-end overflow-hidden rounded-2xl bg-[#dfa878]/20 ${compact ? "h-11 w-11" : "h-14 w-14"}`}>
        <CapiCharacter mood="wave" className={`capi-breathe ${compact ? "h-[3.25rem]" : "h-16"}`} />
      </div>
      <div>
        <strong className={compact ? "text-lg" : "text-2xl"}>CapiAgenda</strong>
        {!compact && <p className="text-xs font-bold text-[#b87442]">menos estrés, más claridad</p>}
      </div>
    </div>
  );
}
