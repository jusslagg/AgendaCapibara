"use client";

import { useEffect, useState } from "react";
import { Download, Share } from "lucide-react";

interface InstallPromptEvent extends Event { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }>; }

export function InstallPWAButton() {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    const listener = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPromptEvent); };
    window.addEventListener("beforeinstallprompt", listener);
    return () => window.removeEventListener("beforeinstallprompt", listener);
  }, []);
  if (!prompt && !isIOS) return <p className="text-sm font-semibold text-[#4b2e1f]/50">Cuando el navegador habilite la instalación, la opción va a aparecer acá.</p>;
  if (isIOS && !prompt) return <p className="flex items-center gap-2 text-sm font-bold"><Share size={18} />En Safari, tocá Compartir y luego “Agregar a inicio”.</p>;
  return <button className="btn btn-secondary" type="button" onClick={async () => { await prompt?.prompt(); setPrompt(null); }}><Download size={18} />Instalar CapiAgenda</button>;
}
