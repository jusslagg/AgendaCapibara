import Image from "next/image";

export function LoadingScreen() {
  return (
    <main className="prism-loading grid min-h-screen place-items-center overflow-hidden bg-[#0a0a0c] text-[#f7f7f2]">
      <div className="relative text-center">
        <div className="prism-loader relative mx-auto h-32 w-32">
          <div className="absolute inset-0 rotate-6 bg-[#00b8ff]" />
          <div className="absolute inset-0 -rotate-3 bg-[#ff1744]" />
          <div className="absolute inset-1 overflow-hidden bg-black">
            <Image alt="" className="prism-only object-contain p-2" fill priority sizes="128px" src="/prism-logo-transparent.png" />
            <Image alt="" className="capy-only object-cover" fill priority sizes="128px" src="/icon-capy-wave.png" />
            <Image alt="" className="resident-only object-cover" fill priority sizes="128px" src="/resident-icon-192.png" />
          </div>
          <span className="absolute -right-3 -top-3 h-5 w-5 rounded-full bg-[#ffd600]" />
        </div>
        <p className="mt-7 text-xs font-black uppercase tracking-[.28em]">Preparando el estudio</p>
        <div className="mx-auto mt-3 flex w-fit gap-1.5" aria-hidden="true"><span className="h-1.5 w-7 bg-[#00b8ff]" /><span className="h-1.5 w-7 bg-[#ff1744]" /><span className="h-1.5 w-7 bg-[#ffd600]" /></div>
      </div>
    </main>
  );
}
