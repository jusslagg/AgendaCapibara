import type { Priority } from "@/types/task";

const config = {
  low: { label: "Baja", className: "bg-[#7a9d54]/15 text-[#567238]" },
  medium: { label: "Media", className: "bg-[#e0a928]/15 text-[#976f0e]" },
  high: { label: "Alta", className: "bg-[#c65d4a]/15 text-[#9b4032]" },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const item = config[priority];
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${item.className}`}>{item.label}</span>;
}
