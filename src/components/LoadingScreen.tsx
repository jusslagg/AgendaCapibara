import { CapiCharacter } from "./CapiCharacter";

export function LoadingScreen() {
  return <main className="grid min-h-screen place-items-center"><div className="text-center"><CapiCharacter mood="calm" className="mx-auto h-44 capi-breathe" /><p className="mt-3 font-bold opacity-60">Preparando tu agenda…</p></div></main>;
}
