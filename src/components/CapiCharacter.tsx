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

const labels: Record<CapiMood, string> = {
  chef: "Capibara cocinando planes",
  chill: "Capibara disfrutando una bebida",
  holiday: "Capibara festivo",
  sad: "Capibara sensible",
  reading: "Capibara leyendo",
  love: "Capibara enamorado de una frutilla",
  focus: "Capibara concentrado",
  party: "Capibara celebrando",
  calm: "Capibara meditando",
  wave: "Capibara saludando",
};

export function CapiCharacter({ mood, className = "h-36" }: { mood: CapiMood; className?: string }) {
  return <span role="img" aria-label={labels[mood]} className={`capi-character block shrink-0 ${className}`} style={{ backgroundPosition: positions[mood] }} />;
}
