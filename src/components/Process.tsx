"use client";

import { useRef, useState } from "react";
import {
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { Check } from "lucide-react";
import { process } from "@/lib/content";
import SectionHeader from "./ui/SectionHeader";

const clamp = (n: number) => Math.max(0, Math.min(1, n));

export default function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const n = process.length;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 70%"],
  });

  // 0 → 1 across the section; drives which stages have "shipped".
  const [p, setP] = useState(reduce ? 1 : 0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!reduce) setP(v);
  });

  return (
    <section
      id="process"
      className="relative border-t border-line bg-ink-2/40 py-24 md:py-36"
    >
      <div
        className="glow"
        style={{
          bottom: "0",
          left: "-6rem",
          width: "24rem",
          height: "24rem",
          background: "var(--glow-ember)",
          opacity: 0.5,
        }}
      />
      <div className="shell relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            index="02"
            kicker="How we operate"
            title={
              <>
                A pipeline that{" "}
                <span className="outline-text">always ships.</span>
              </>
            }
            intro="No drama, no theatre — a clear path from problem to production. Scroll it like a deploy."
          />
          <span className="font-mono text-xs uppercase tracking-widest text-muted">
            {Math.min(n, Math.round(p * n))} / {n} stages
          </span>
        </div>

        <ol ref={ref} className="relative mt-16">
          {process.map((step, i) => {
            const np = clamp(p * n - i); // 0 = queued, (0,1) = running, 1 = done
            const done = np >= 1;
            const running = np > 0 && np < 1;
            const connector = i < n - 1 ? clamp(p * n - (i + 1)) : 0;
            const Icon = step.icon;

            const status = done
              ? "✓ complete"
              : running
                ? "› running…"
                : "queued";

            return (
              <li
                key={step.no}
                className="relative grid grid-cols-[2.75rem_1fr] items-stretch gap-5 pb-10 last:pb-0 md:grid-cols-[3.5rem_1fr] md:gap-8"
              >
                {/* spine + node */}
                <div className="relative flex flex-col items-center">
                  <span
                    className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-all duration-500"
                    style={{
                      borderColor: done || running ? "var(--ember)" : "var(--line)",
                      backgroundColor: done ? "var(--ember)" : "transparent",
                      boxShadow:
                        done || running
                          ? "0 0 22px var(--glow-ember)"
                          : "none",
                    }}
                  >
                    {done ? (
                      <Check size={18} className="text-ink" strokeWidth={3} />
                    ) : (
                      <Icon
                        size={18}
                        style={{
                          color: running ? "var(--ember)" : "var(--muted)",
                        }}
                      />
                    )}
                    {running && (
                      <span
                        className="absolute inset-0 animate-ping rounded-full"
                        style={{ boxShadow: "0 0 0 2px var(--ember)" }}
                      />
                    )}
                  </span>

                  {/* connector track */}
                  {i < n - 1 && (
                    <span className="relative mt-2 w-px flex-1 overflow-hidden bg-line">
                      <span
                        className="absolute inset-x-0 top-0 origin-top bg-ember transition-transform duration-500 ease-out"
                        style={{
                          height: "100%",
                          transform: `scaleY(${connector})`,
                        }}
                      />
                    </span>
                  )}
                </div>

                {/* content */}
                <div className="pb-2 pt-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted">{step.no}</span>
                    <span
                      className="font-mono text-[0.65rem] uppercase tracking-[0.18em] transition-colors duration-500"
                      style={{
                        color: done
                          ? "var(--ember)"
                          : running
                            ? "var(--paper-dim)"
                            : "var(--muted)",
                      }}
                    >
                      {status}
                    </span>
                  </div>
                  <h3
                    className="display mt-2 text-2xl transition-colors duration-500 md:text-3xl"
                    style={{
                      color: done || running ? "var(--paper)" : "var(--paper-dim)",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-paper-dim">
                    {step.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
