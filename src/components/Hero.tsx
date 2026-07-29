"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { heroStats, site } from "@/lib/content";
import { crossFade, easeOut } from "@/lib/motion";

export default function Hero() {
  // Framer animates in JS, out of reach of the CSS reduced-motion rules.
  const reduce = useReducedMotion();
  const rise = (y: number, delay: number, duration = 0.7) => ({
    initial: { opacity: 0, y: reduce ? 0 : y },
    animate: { opacity: 1, y: 0 },
    transition: reduce
      ? { ...crossFade, delay: delay * 0.5 }
      : { duration, ease: easeOut, delay },
  });

  return (
    <section id="top" className="relative overflow-hidden pt-32 md:pt-40">
      {/* background */}
      <div className="absolute inset-0 grid-lines [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_75%)]" />
      <div
        className="glow animate-pulse-glow"
        style={{
          top: "-12rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "44rem",
          height: "30rem",
          background: "var(--glow-ember)",
        }}
      />
      <div
        className="glow"
        style={{
          top: "6rem",
          right: "-8rem",
          width: "26rem",
          height: "26rem",
          background: "var(--glow-cool)",
        }}
      />

      <div className="shell relative">
        <motion.div
          {...rise(14, 0, 0.6)}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-2/60 px-4 py-1.5"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ember" />
          </span>
          <span className="font-mono text-xs tracking-wider text-paper-dim">
            Software engineering unit · est. {site.founded}
          </span>
        </motion.div>

        <h1 className="display display-xl mt-7 text-[3.4rem] sm:text-7xl md:text-[6.5rem]">
          {["We build,", "ship, and"].map((line, i) => (
            <motion.span key={line} className="block" {...rise(28, 0.1 + i * 0.08)}>
              {line}
            </motion.span>
          ))}
          <motion.span className="block" {...rise(28, 0.26)}>
            <span className="gradient-text">scale</span>{" "}
            <span className="outline-text">software.</span>
          </motion.span>
        </h1>

        <motion.p
          {...rise(18, 0.4)}
          className="mt-8 max-w-xl text-lg leading-relaxed text-paper-dim md:text-xl"
        >
          AnbuTech is an elite engineering unit. We take products from first call
          to live — custom software, web &amp; mobile, AI automation and the cloud
          that runs it all.
        </motion.p>

        <motion.div
          {...rise(18, 0.5)}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <a href="#contact" className="btn btn-primary">
            Start a project <ArrowUpRight size={18} />
          </a>
          <a
            href={site.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            <CalendarDays size={18} /> Book a call
          </a>
        </motion.div>

        {/* stat strip */}
        <motion.dl
          {...rise(18, 0.62)}
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 md:mt-24"
        >
          {heroStats.map((s) => (
            <div key={s.value} className="bg-ink px-6 py-7">
              <dt className="display text-2xl text-paper md:text-3xl">
                {s.value}
              </dt>
              <dd className="mt-1.5 text-sm text-muted">{s.label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
