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

  // Offsets are pulled back in: the button is now 44px tall, so the tooltip
  // anchors near the dot rather than near the edge of the (invisible) target.
  const tipPos =
    tooltip === "top"
      ? "bottom-full -mb-2 origin-bottom"
      : "top-full -mt-2 origin-top";

  return (
    <div
      role="group"
      aria-label="Accent color"
      className={`-mx-1 -my-3 flex items-center ${className}`}
    >
      {ACCENTS.map((a) => {
        const isActive = active === a.id;
        return (
          <span key={a.id} className="group relative flex">
            {/*
              The swatch still reads as a 14px dot, but the button around it is
              44px tall and 28px wide — a control a thumb can actually land on,
              with the visual design left alone. Targets sit edge to edge rather
              than overlapping, so a near miss never picks the wrong accent.
            */}
            <button
              type="button"
              onClick={() => choose(a)}
              aria-label={`${a.label} accent`}
              aria-pressed={isActive}
              className="grid h-11 w-7 place-items-center rounded-full transition-transform duration-100 ease-out active:scale-90"
              style={{ touchAction: "manipulation" }}
            >
              <span
                className="h-3.5 w-3.5 rounded-full transition-transform duration-200 group-hover:scale-125"
                style={{
                  backgroundColor: a.swatch,
                  opacity: isActive ? 1 : 0.45,
                  boxShadow: isActive
                    ? `0 0 0 2px var(--ink), 0 0 0 3.5px ${a.swatch}`
                    : "none",
                }}
              />
            </button>
            {/* Revealed on focus as well as hover, so it is not pointer-only. */}
            <span
              className={`pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 scale-90 whitespace-nowrap rounded-md border border-line bg-ink-2 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-paper-dim opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100 ${tipPos}`}
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
