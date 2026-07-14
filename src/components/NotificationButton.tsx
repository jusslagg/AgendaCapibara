"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { enableNotifications, notificationsAreEnabled } from "@/lib/notifications";

export function NotificationButton({ compact = false }: { compact?: boolean }) {
  const { user } = useAuth();
  const [state, setState] = useState<"checking" | "idle" | "loading" | "done">("checking");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) { setState("idle"); return; }
    let active = true;
    const refresh = () => notificationsAreEnabled(user.uid)
      .then((enabled) => { if (active) setState(enabled ? "done" : "idle"); })
      .catch(() => { if (active) setState("idle"); });
    void refresh();
    const handleChange = () => void refresh();
    window.addEventListener("prismagenda:notifications-changed", handleChange);
    window.addEventListener("focus", handleChange);
    return () => { active = false; window.removeEventListener("prismagenda:notifications-changed", handleChange); window.removeEventListener("focus", handleChange); };
  }, [user]);
  async function handleEnable() {
    if (!user) return;
    setError(""); setState("loading");
    try { await enableNotifications(user.uid); setState("done"); }
    catch (cause) {
      const message = cause instanceof Error ? cause.message : "No pudimos activar las notificaciones.";
      setError(message.includes("applicationServerKey")
        ? "Chrome rechazó la clave pública de Firebase. Cerrá y volvé a abrir la app; si continúa, habrá que generar una clave nueva."
        : message);
      setState("idle");
    }
  }
  return <div><button className={`btn ${state === "done" ? "bg-[#7a9d54] text-white" : compact ? "btn-secondary" : "btn-primary"}`} type="button" onClick={handleEnable} disabled={state !== "idle"}>{state === "done" ? <><CheckCircle2 size={18} />Recordatorios activos</> : <><Bell size={18} />{state === "checking" ? "Comprobando…" : state === "loading" ? "Activando…" : "Activar recordatorios"}</>}</button>{error && <p role="alert" className="mt-2 max-w-xs text-xs font-bold text-[#c65d4a]">{error}</p>}</div>;
}
