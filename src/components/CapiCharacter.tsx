import type { CSSProperties } from "react";

type CapiMood = "chef" | "chill" | "holiday" | "sad" | "reading" | "love" | "focus" | "party" | "calm" | "wave";

const positions: Record<CapiMood, string> = {
  chef: "0% 0%",
  chill: "25% 0%",
  holiday: "50% 0%",
  sad: "75% 0%",
  reading: "100% 0%",
  love: "0% 100%",
  focus: "25% 100%",
  party: "50% 100%",
  calm: "75% 100%",
  wave: "100% 100%",
};

const residentCharacters: Record<CapiMood, string> = {
  chef: "/resident-evil/rebecca.png",
  chill: "/resident-evil/survivor.png",
  holiday: "/resident-evil/wesker.png",
  sad: "/resident-evil/nemesis.png",
  reading: "/resident-evil/jill.png",
  love: "/resident-evil/ada.png",
  focus: "/resident-evil/leon.png",
  party: "/resident-evil/chris.png",
  calm: "/resident-evil/lady.png",
  wave: "/resident-evil/claire.png",
};

export function CapiCharacter({ mood, className = "h-36" }: { mood: CapiMood; className?: string }) {
  return <span aria-hidden="true" className={`capi-character block shrink-0 ${className}`} style={{ backgroundPosition: positions[mood], "--resident-character": `url(${residentCharacters[mood]})` } as CSSProperties} />;
}
