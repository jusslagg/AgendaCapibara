import Image from "next/image";

export function CapiLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`logo-mascot relative shrink-0 overflow-hidden rounded-2xl ${compact ? "h-11 w-11" : "h-14 w-14"}`}>
        <Image alt="" className="prism-only object-contain p-1" fill priority src="/prism-logo-transparent.png" sizes={compact ? "44px" : "56px"} />
        <Image alt="" className="capy-only object-cover" fill priority src="/icon-capy-wave.png" sizes={compact ? "44px" : "56px"} />
        <Image alt="" className="resident-only object-cover" fill priority src="/resident-icon-192.png" sizes={compact ? "44px" : "56px"} />
      </div>
      <div>
        <strong className={`brand-wordmark ${compact ? "text-lg" : "text-2xl"}`}>Prism<span>Agenda</span></strong>
        {!compact && <p className="text-xs font-bold opacity-55">briefs, ideas &amp; deadlines</p>}
      </div>
    </div>
  );
}
