import Link from "next/link";
import { CapiLogo } from "@/components/CapiLogo";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center p-6 text-center"><div><div className="mx-auto w-fit"><CapiLogo /></div><h1 className="mt-8 text-4xl font-black">Esta hojita no existe</h1><p className="mt-2 font-semibold opacity-55">Parece que el capibara tomó otro camino.</p><Link href="/dashboard" className="btn btn-primary mt-6">Volver a la agenda</Link></div></main>;
}
