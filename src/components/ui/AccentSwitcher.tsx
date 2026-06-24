"use client";

import { useEffect, useState } from "react";
import { ACCENTS, STORAGE_KEY, type Accent } from "@/lib/accents";

function apply(accent: Accent) {
  const root = document.documentElement;
  Object.entries(accent.vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

export default function AccentSwitcher({
  className = "",
  tooltip = "bottom",
}: {
  className?: string;
  tooltip?: "top" | "bottom";
}) {
  const [active, setActive] = useState("ember");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && ACCENTS.some((a) => a.id === saved)) setActive(saved);
  }, []);

  function choose(accent: Accent) {
    setActive(accent.id);
    apply(accent);
    try {
      localStorage.setItem(STORAGE_KEY, accent.id);
    } catch {}
  }

  const tipPos =
    tooltip === "top"
      ? "bottom-full mb-2 origin-bottom"
      : "top-full mt-2 origin-top";

  return (
    <div
      role="group"
      aria-label="Accent color"
      className={`flex items-center gap-2.5 ${className}`}
    >
      {ACCENTS.map((a) => {
        const isActive = active === a.id;
        return (
          <span key={a.id} className="group relative flex">
            <button
              type="button"
              onClick={() => choose(a)}
              aria-label={`${a.label} accent`}
              aria-pressed={isActive}
              className="h-3.5 w-3.5 rounded-full transition-transform duration-200 hover:scale-125"
              style={{
                backgroundColor: a.swatch,
                opacity: isActive ? 1 : 0.45,
                boxShadow: isActive
                  ? `0 0 0 2px var(--ink), 0 0 0 3.5px ${a.swatch}`
                  : "none",
              }}
            />
            {/* hover tooltip */}
            <span
              className={`pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 scale-90 whitespace-nowrap rounded-md border border-line bg-ink-2 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-paper-dim opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 ${tipPos}`}
            >
              {a.label}
              {isActive && <span className="ml-1 text-ember">●</span>}
            </span>
          </span>
        );
      })}
    </div>
  );
}
