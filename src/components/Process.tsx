"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { Check } from "lucide-react";
import { process } from "@/lib/content";
import SectionHeader from "./ui/SectionHeader";

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const n = process.length;

export default function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 70%"],
  });

  /*
   * Two kinds of state, deliberately kept apart:
   *
   *  - `done` / `running` are discrete. They flip a handful of times over the
   *    whole section, so they live in React state.
   *  - the connector fill is continuous and must track the scroll 1:1, so it
   *    stays a motion value and never touches the React render path. Driving it
   *    through state re-rendered every list row on every scroll frame.
   */
  const [done, setDone] = useState(reduce ? n : 0);
  const [running, setRunning] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    const raw = clamp(v) * n;
    const complete = Math.min(n, Math.floor(raw));
    setDone(complete);
    setRunning(complete < n && raw - complete > 0);
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
            {done} / {n} stages
          </span>
        </div>

        <ol ref={ref} className="relative mt-16">
          {process.map((step, i) => (
            <Stage
              key={step.no}
              step={step}
              index={i}
              done={i < done}
              running={running && i === done}
              progress={scrollYProgress}
              reduce={!!reduce}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Stage({
  step,
  index,
  done,
  running,
  progress,
  reduce,
}: {
  step: (typeof process)[number];
  index: number;
  done: boolean;
  running: boolean;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const Icon = step.icon;
  const active = done || running;

  // Continuous, scroll-locked. No transition on this — a scrubbed value that
  // eases toward the scroll position lags behind the finger and reads as rubbery.
  const fill = useTransform(progress, (v) => (reduce ? 1 : clamp(v * n - (index + 1))));

  const status = done ? "✓ complete" : running ? "› running…" : "queued";

  return (
    <li className="relative grid grid-cols-[2.75rem_1fr] items-stretch gap-5 pb-10 last:pb-0 md:grid-cols-[3.5rem_1fr] md:gap-8">
      {/* spine + node */}
      <div className="relative flex flex-col items-center">
        <span
          className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-all duration-300"
          style={{
            borderColor: active ? "var(--ember)" : "var(--line)",
            backgroundColor: done ? "var(--ember)" : "transparent",
            boxShadow: active ? "0 0 22px var(--glow-ember)" : "none",
          }}
        >
          {done ? (
            <Check size={18} className="text-ink" strokeWidth={3} />
          ) : (
            <Icon
              size={18}
              style={{ color: running ? "var(--ember)" : "var(--muted)" }}
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
        {index < n - 1 && (
          <span className="relative mt-2 w-px flex-1 overflow-hidden bg-line">
            <motion.span
              className="absolute inset-x-0 top-0 h-full origin-top bg-ember"
              style={{ scaleY: fill }}
            />
          </span>
        )}
      </div>

      {/* content */}
      <div className="pb-2 pt-1.5">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted">{step.no}</span>
          <span
            className="font-mono text-[0.65rem] uppercase tracking-[0.18em] transition-colors duration-300"
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
          className="display mt-2 text-2xl transition-colors duration-300 md:text-3xl"
          style={{ color: active ? "var(--paper)" : "var(--paper-dim)" }}
        >
          {step.title}
        </h3>
        <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-paper-dim">
          {step.body}
        </p>
      </div>
    </li>
  );
}
