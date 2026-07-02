"use client";

import { useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { enableNotifications } from "@/lib/notifications";

export function NotificationButton({ compact = false }: { compact?: boolean }) {
  const { user } = useAuth();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");
  async function handleEnable() {
    if (!user) return;
    setError(""); setState("loading");
    try { await enableNotifications(user.uid); setState("done"); }
    catch (cause) {
      const message = cause instanceof Error ? cause.message : "No pudimos activar las notificaciones.";
      setError(message.includes("applicationServerKey")
        ? "Chrome conservó una clave anterior. Recargá la página e intentá nuevamente."
        : message);
      setState("idle");
    }
  }
  return <div><button className={`btn ${state === "done" ? "bg-[#7a9d54] text-white" : compact ? "btn-secondary" : "btn-primary"}`} type="button" onClick={handleEnable} disabled={state !== "idle"}>{state === "done" ? <><CheckCircle2 size={18} />Recordatorios activos</> : <><Bell size={18} />{state === "loading" ? "Activando…" : "Activar recordatorios"}</>}</button>{error && <p role="alert" className="mt-2 max-w-xs text-xs font-bold text-[#c65d4a]">{error}</p>}</div>;
}
