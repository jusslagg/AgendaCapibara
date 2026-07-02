import Image from "next/image";

export function CapiLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Image className="capi-breathe rounded-2xl" src="/icon-192.svg" width={compact ? 42 : 56} height={compact ? 42 : 56} alt="Capibara de CapiAgenda" priority />
      <div>
        <strong className={compact ? "text-lg" : "text-2xl"}>CapiAgenda</strong>
        {!compact && <p className="text-xs font-bold text-[#8b5e3c]">menos estrés, más claridad</p>}
      </div>
    </div>
  );
}
