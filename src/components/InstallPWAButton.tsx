"use client";

import { useEffect, useState } from "react";
import { Download, Share } from "lucide-react";

interface InstallPromptEvent extends Event { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }>; }

export function isRunningAsApp() {
  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches
    || navigatorWithStandalone.standalone === true
    || document.referrer.startsWith("android-app://");
}

export function InstallPWAButton({ onInstalled }: { onInstalled?: () => void }) {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    setInstalled(isRunningAsApp());
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    const listener = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPromptEvent); };
    const installedListener = () => { setInstalled(true); setPrompt(null); onInstalled?.(); };
    const displayMode = window.matchMedia("(display-mode: standalone)");
    const displayModeListener = () => { if (displayMode.matches) installedListener(); };
    window.addEventListener("beforeinstallprompt", listener);
    window.addEventListener("appinstalled", installedListener);
    displayMode.addEventListener("change", displayModeListener);
    return () => {
      window.removeEventListener("beforeinstallprompt", listener);
      window.removeEventListener("appinstalled", installedListener);
      displayMode.removeEventListener("change", displayModeListener);
    };
  }, [onInstalled]);
  if (installed) return null;
  if (!prompt && !isIOS) return <p className="text-sm font-semibold text-[#4b2e1f]/50">Cuando el navegador habilite la instalación, la opción va a aparecer acá.</p>;
  if (isIOS && !prompt) return <p className="flex items-center gap-2 text-sm font-bold"><Share size={18} />En Safari, tocá Compartir y luego “Agregar a inicio”.</p>;
  return <button className="btn btn-secondary" type="button" onClick={async () => {
    await prompt?.prompt();
    const choice = await prompt?.userChoice;
    if (choice?.outcome === "accepted") { setInstalled(true); onInstalled?.(); }
    setPrompt(null);
  }}><Download size={18} />Instalar CapiAgenda</button>;
}
