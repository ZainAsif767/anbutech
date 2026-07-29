"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { crossFade, tweenReveal } from "@/lib/motion";

export default function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const MotionTag = motion[as];
  // Framer drives transforms in JS, so the CSS reduced-motion rules never see
  // them — the preference has to be honored here or it is silently ignored.
  const reduce = useReducedMotion();

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...(reduce ? crossFade : tweenReveal), delay }}
    >
      {children}
    </MotionTag>
  );
}
