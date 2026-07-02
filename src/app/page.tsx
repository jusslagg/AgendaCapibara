"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Leaf, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { CapiLogo } from "@/components/CapiLogo";
import { CapiCharacter } from "@/components/CapiCharacter";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/components/AuthProvider";
import { login, register } from "@/lib/auth";

export default function LoginPage() {
  const { user, loading, configured } = useAuth();
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (user) router.replace("/dashboard"); }, [router, user]);
  if (loading || user) return <LoadingScreen />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const data = new FormData(event.currentTarget);
    try {
      if (isRegister) await register(String(data.get("name")), String(data.get("email")), String(data.get("password")));
      else await login(String(data.get("email")), String(data.get("password")));
      router.push("/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message.replace("Firebase: ", "") : "No pudimos ingresar.");
    } finally { setSubmitting(false); }
  }

  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:grid lg:grid-cols-[1.08fr_.92fr] lg:gap-8 lg:p-8">
      <section className="relative hidden min-h-[calc(100vh-4rem)] overflow-hidden rounded-[2.5rem] bg-[#4b2e1f] p-12 text-[#fff8ea] lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-28 -top-24 h-96 w-96 rounded-full bg-[#dfa878]/20" />
        <div className="absolute -bottom-32 left-28 h-96 w-96 rounded-full bg-[#7a9d54]/20" />
        <CapiCharacter mood="wave" className="absolute right-8 top-24 h-52 rotate-3 opacity-90" />
        <CapiLogo />
        <div className="relative z-10 max-w-xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-extrabold"><Sparkles size={16} /> Tu rincón de calma productiva</span>
          <h1 className="text-6xl font-black leading-[1.04] tracking-[-.045em]">Organizá tus tareas.<br /><span className="text-[#dfa878]">Sin entrar en pánico.</span></h1>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-[#fff8ea]/70">Fechas claras, prioridades a la vista y un capibara que te avisa antes de que algo venza.</p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-3">
          {["Recordatorios a tiempo", "Tu agenda, en el bolsillo", "Todo en un solo lugar"].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-bold"><CheckCircle2 className="mb-3 text-[#dfa878]" size={20} />{item}</div>)}
        </div>
      </section>

      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col justify-center py-4">
        <div className="mb-10 lg:hidden"><CapiLogo /></div>
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 text-sm font-extrabold text-[#6f8f4d]"><Leaf size={17} /> Un paso a la vez</span>
          <h2 className="mt-3 text-4xl font-black tracking-[-.035em]">{isRegister ? "Creá tu espacio" : "Qué bueno verte"}</h2>
          <p className="mt-2 font-semibold text-[#4b2e1f]/55">{isRegister ? "Tu agenda tranquila empieza acá." : "Entrá y veamos qué hay para hoy."}</p>
        </div>

        {!configured && <div className="mb-5 rounded-2xl border border-[#e0a928]/30 bg-[#fff4cc] p-4 text-sm font-bold leading-relaxed text-[#725300]">La interfaz está lista. Para iniciar sesión, copiá <code>.env.example</code> a <code>.env.local</code> y agregá las claves de Firebase.</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && <label className="block"><span className="mb-2 block text-sm font-extrabold">Tu nombre</span><div className="relative"><Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 opacity-35" size={18} /><input className="field pl-11" name="name" autoComplete="name" placeholder="Cami" required /></div></label>}
          <label className="block"><span className="mb-2 block text-sm font-extrabold">Email</span><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-35" size={18} /><input className="field pl-11" name="email" type="email" autoComplete="email" placeholder="hola@ejemplo.com" required /></div></label>
          <label className="block"><span className="mb-2 block text-sm font-extrabold">Contraseña</span><div className="relative"><LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 opacity-35" size={18} /><input className="field pl-11" name="password" type="password" minLength={6} autoComplete={isRegister ? "new-password" : "current-password"} placeholder="Mínimo 6 caracteres" required /></div></label>
          {error && <p role="alert" className="rounded-xl bg-[#c65d4a]/10 p-3 text-sm font-bold text-[#9b4032]">{error}</p>}
          <button className="btn btn-primary mt-2 w-full" type="submit" disabled={submitting || !configured}>{submitting ? "Preparando todo…" : isRegister ? "Crear mi cuenta" : "Entrar a mi agenda"}<ArrowRight size={18} /></button>
        </form>
        <button className="mt-6 text-sm font-bold text-[#4b2e1f]/60" type="button" onClick={() => { setIsRegister((value) => !value); setError(""); }}>{isRegister ? "¿Ya tenés cuenta? Ingresá" : "¿Primera vez? Creá una cuenta"}</button>
        <p className="mt-10 text-center text-xs font-bold text-[#4b2e1f]/35">CapiAgenda · hecho para días más livianos</p>
      </section>
    </main>
  );
}
