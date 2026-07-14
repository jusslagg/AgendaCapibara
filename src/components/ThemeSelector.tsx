"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Check, Palette } from "lucide-react";
import { CapiCharacter } from "./CapiCharacter";
import { applyTheme, isAppTheme, THEME_STORAGE_KEY, type AppTheme } from "@/lib/theme";

const themes: Array<{ id: AppTheme; name: string; description: string }> = [
  { id: "prism", name: "Prism Studio", description: "Editorial, cromático y creativo." },
  { id: "capybara", name: "Capibara", description: "Cálido, tranquilo y amable." },
  { id: "resident-evil", name: "Resident Evil", description: "Oscuro, táctico y con tensión." },
];

export function ThemeSelector() {
  const [theme, setTheme] = useState<AppTheme>("prism");

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    setTheme(isAppTheme(storedTheme) ? storedTheme : "prism");
  }, []);

  function selectTheme(nextTheme: AppTheme) {
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <section className="surface theme-picker mb-5 max-w-5xl rounded-[2rem] p-5 sm:p-7">
      <div className="mb-4 flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#dfa878]/20 text-[#8b5e3c]"><Palette size={21} /></div>
        <div><h2 className="text-xl font-black">Tema visual</h2><p className="mt-1 text-sm font-semibold text-[#4b2e1f]/55">Elegí el estilo de tu agenda. Queda guardado en este celular.</p></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {themes.map((option) => {
          const selected = theme === option.id;
          return (
            <button
              aria-pressed={selected}
              className="theme-option relative min-w-0 overflow-hidden rounded-[1.4rem] border p-3 text-left transition active:scale-[.98]"
              data-selected={selected}
              key={option.id}
              onClick={() => selectTheme(option.id)}
              type="button"
            >
              <div className={`relative mb-3 h-28 overflow-hidden rounded-2xl ${option.id === "capybara" ? "force-capy bg-[#f2d6b8]" : "bg-[#161a1f]"}`}>
                {option.id === "prism"
                  ? <Image alt="Identidad visual de PrismAgenda" className="h-full w-full object-contain p-5" fill sizes="(max-width: 640px) 100vw, 33vw" src="/prism-logo-transparent.png" />
                  : option.id === "capybara"
                  ? <CapiCharacter mood="wave" className="absolute -bottom-4 left-1/2 h-32 -translate-x-1/2" />
                  : <>
                    <Image alt="" className="absolute -bottom-3 -left-3 h-28 w-auto object-contain" height={112} src="/resident-evil/claire.png" width={84} />
                    <Image alt="Personajes chibi del tema Resident Evil" className="absolute -bottom-2 left-1/2 h-32 w-auto -translate-x-1/2 object-contain" height={128} src="/resident-evil/leon.png" width={96} />
                    <Image alt="" className="absolute -bottom-3 -right-3 h-28 w-auto object-contain" height={112} src="/resident-evil/lady.png" width={84} />
                  </>}
              </div>
              <strong className="block truncate text-sm">{option.name}</strong>
              <span className="mt-1 block text-[11px] font-semibold leading-snug opacity-55">{option.description}</span>
              {selected && <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-[#7a9d54] text-white"><Check size={15} strokeWidth={3} /></span>}
            </button>
          );
        })}
      </div>
      {theme === "resident-evil" && <p className="mt-4 rounded-xl bg-[#8f252d]/12 px-3 py-2 text-xs font-bold leading-relaxed text-[#4b2e1f]/60">El icono Resident Evil se aplicará al instalar. Si PrismAgenda ya está instalada, desinstalala y volvé a instalarla para que Android actualice el icono.</p>}
    </section>
  );
}
