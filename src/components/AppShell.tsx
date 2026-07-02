"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CheckCircle2, ClipboardList, LogOut, Plus, Settings } from "lucide-react";
import { CapiLogo } from "./CapiLogo";
import { useAuth } from "./AuthProvider";
import { logout } from "@/lib/auth";

const links = [
  { href: "/dashboard", label: "Pendientes", icon: ClipboardList },
  { href: "/completed", label: "Completadas", icon: CheckCircle2 },
  { href: "/settings", label: "Recordatorios", icon: Bell },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  return (
    <div className="mx-auto min-h-screen max-w-[1500px] lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-[#4b2e1f]/10 bg-[#fffaf0]/70 px-5 py-7 backdrop-blur-xl lg:flex">
        <CapiLogo compact />
        <nav className="mt-12 space-y-2" aria-label="Navegación principal">
          {links.map(({ href, label, icon: Icon }) => <Link className="nav-link" data-active={pathname === href} href={href} key={href}><Icon size={19} />{label}</Link>)}
        </nav>
        <Link href="/tasks/new" className="btn btn-primary mt-6"><Plus size={18} />Nueva tarea</Link>
        <div className="mt-auto rounded-2xl bg-[#7a9d54]/10 p-4">
          <p className="truncate text-sm font-black">{user?.displayName || "Capibara organizado"}</p>
          <p className="truncate text-xs font-semibold opacity-50">{user?.email}</p>
          <button onClick={() => logout()} className="mt-4 flex items-center gap-2 text-xs font-black text-[#8b5e3c]" type="button"><LogOut size={15} />Cerrar sesión</button>
        </div>
      </aside>
      <div className="min-w-0 pb-24 lg:pb-0">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8 lg:hidden"><CapiLogo compact /><Link href="/settings" aria-label="Configuración" className="grid h-11 w-11 place-items-center rounded-full bg-[#fffaf0]"><Settings size={20} /></Link></header>
        {children}
      </div>
      <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-[1.4rem] border border-[#4b2e1f]/10 bg-[#fffaf0]/95 p-2 shadow-[0_18px_45px_rgba(75,46,31,.22)] backdrop-blur lg:hidden" aria-label="Navegación móvil">
        {links.map(({ href, label, icon: Icon }) => <Link className={`flex min-w-20 flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] font-black ${pathname === href ? "bg-[#dfa878]/25 text-[#4b2e1f]" : "opacity-55"}`} href={href} key={href}><Icon size={19} />{label}</Link>)}
        <Link href="/tasks/new" aria-label="Nueva tarea" className="-mt-7 grid h-14 w-14 place-items-center rounded-full bg-[#4b2e1f] text-white shadow-lg"><Plus size={24} /></Link>
      </nav>
    </div>
  );
}
