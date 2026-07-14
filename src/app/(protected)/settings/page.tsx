"use client";

import { useCallback, useEffect, useState } from "react";
import { BellRing, Clock3, Download, LogOut, ShieldCheck } from "lucide-react";
import { InstallPWAButton, isRunningAsApp } from "@/components/InstallPWAButton";
import { CapiCharacter } from "@/components/CapiCharacter";
import { NotificationButton } from "@/components/NotificationButton";
import { PageHeading } from "@/components/PageHeading";
import { ThemeSelector } from "@/components/ThemeSelector";
import { logout } from "@/lib/auth";

export default function SettingsPage() {
  const [installed, setInstalled] = useState<boolean | null>(null);
  const handleInstalled = useCallback(() => setInstalled(true), []);

  useEffect(() => setInstalled(isRunningAsApp()), []);

  return (
    <main className="px-5 pb-10 pt-4 sm:px-8 sm:pt-8 xl:px-12">
      <PageHeading eyebrow="Sistema de trabajo" title="Recordatorios, app y tema" description="Activá los avisos en cada dispositivo donde uses PrismAgenda." />
      <ThemeSelector />
      <div className="grid max-w-5xl gap-5 lg:grid-cols-2">
        <section className="surface relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
          <CapiCharacter mood="focus" className="absolute -right-6 -top-5 h-32 opacity-75" />
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#dfa878]/20 text-[#8b5e3c]"><BellRing /></div>
          <h2 className="mt-5 text-xl font-black">Notificaciones push</h2>
          <p className="mt-2 max-w-[75%] text-sm font-semibold leading-relaxed text-[#4b2e1f]/55">Revisamos tus proyectos cada hora y te avisamos según la anticipación que elijas en cada tarea.</p>
          <div className="mt-5"><NotificationButton /></div>
          <div className="mt-6 space-y-3 border-t border-[#4b2e1f]/8 pt-5 text-xs font-bold text-[#4b2e1f]/50">
            <p className="flex gap-2"><Clock3 size={16} />Frecuencia de revisión: cada hora</p>
            <p className="flex gap-2"><ShieldCheck size={16} />Tu token queda asociado solo a tu cuenta.</p>
          </div>
        </section>
        {installed === false && (
          <section className="surface relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
            <CapiCharacter mood="reading" className="absolute -bottom-8 -right-5 h-36 opacity-75" />
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#7a9d54]/15 text-[#567238]"><Download /></div>
            <h2 className="mt-5 text-xl font-black">Instalar PrismAgenda</h2>
            <p className="mt-2 max-w-[72%] text-sm font-semibold leading-relaxed text-[#4b2e1f]/55">Sumala a la pantalla de inicio y usala como cualquier otra app, sin abrir el navegador.</p>
            <div className="relative z-10 mt-5"><InstallPWAButton onInstalled={handleInstalled} /></div>
          </section>
        )}
      </div>
      <button onClick={() => logout()} className="btn btn-secondary mt-6 lg:hidden" type="button"><LogOut size={18} />Cerrar sesión</button>
    </main>
  );
}
