import type { ReactNode } from "react";

export function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div>{eyebrow && <p className="mb-2 text-xs font-black uppercase tracking-[.18em] text-[#6f8f4d]">{eyebrow}</p>}<h1 className="text-3xl font-black tracking-[-.04em] sm:text-4xl">{title}</h1>{description && <p className="mt-2 max-w-xl font-semibold text-[#4b2e1f]/50">{description}</p>}</div>{action}</div>;
}
