"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Check, Loader2, Mail } from "lucide-react";
import { site } from "@/lib/content";
import { crossFade, easeOut, springSheet } from "@/lib/motion";
import Reveal from "./ui/Reveal";

type Status = "idle" | "loading" | "success" | "error";

/*
 * One message for every failure. Web3Forms returns operator-facing strings like
 * "Invalid Access Key" — accurate for us, alarming and useless for a prospect —
 * so the real reason goes to the console and the visitor gets a way through.
 */
const FAILURE_MESSAGE = "Something went wrong sending that.";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const reduce = useReducedMotion();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // No key means every request is guaranteed to fail. Say so loudly in dev
    // rather than shipping a form that silently swallows enquiries.
    if (!site.web3formsKey) {
      console.error(
        "[Contact] NEXT_PUBLIC_WEB3FORMS_KEY is not set — the enquiry form cannot deliver. Set it in .env.local and rebuild."
      );
      setStatus("error");
      setError(FAILURE_MESSAGE);
      return;
    }

    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("access_key", site.web3formsKey);
    data.append("subject", "New project enquiry · AnbuTech");
    data.append("from_name", "AnbuTech Website");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        form.reset();
      } else {
        console.error("[Contact] Web3Forms rejected the submission:", json);
        setStatus("error");
        setError(FAILURE_MESSAGE);
      }
    } catch (err) {
      console.error("[Contact] Network error submitting the form:", err);
      setStatus("error");
      setError(FAILURE_MESSAGE);
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden py-24 md:py-36">
      <div
        className="glow"
        style={{
          top: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "40rem",
          height: "24rem",
          background: "var(--glow-ember)",
          opacity: 0.45,
        }}
      />
      <div className="shell relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          {/* left — pitch */}
          <div>
            <Reveal className="flex items-center gap-3">
              <span className="mono-label">05</span>
              <span className="h-px w-10 bg-line" />
              <span className="mono-label !text-paper-dim">Contact</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="display display-xl mt-5 text-4xl text-paper sm:text-5xl md:text-6xl text-balance">
                Let&apos;s build the thing you&apos;ve been{" "}
                <span className="gradient-text">putting off.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-paper-dim">
                Tell us what you&apos;re building. We&apos;ll come back within one
                business day with honest, specific next steps.
              </p>
            </Reveal>

            <Reveal delay={0.15} className="mt-10 flex flex-col gap-3">
              <a
                href={`mailto:${site.email}`}
                className="group flex items-center gap-3 text-paper-dim transition-colors hover:text-paper"
              >
                <Mail size={18} className="text-ember" />
                {site.email}
              </a>
              <a
                href={site.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-paper-dim transition-colors hover:text-paper"
              >
                <CalendarDays size={18} className="text-ember" />
                Book a 30‑minute intro call
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
            </Reveal>
          </div>

          {/* right — form */}
          <Reveal delay={0.1}>
            {/* mode="wait" — the two states are mutually exclusive, so the form
                must finish leaving before the panel arrives. initial={false}
                keeps the form from animating in on first paint. */}
            <AnimatePresence mode="wait" initial={false}>
            {status === "success" ? (
              /* Completion is a moment worth marking — and it has to reach a
                 screen reader too, not just the eye. */
              <motion.div
                key="success"
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={reduce ? crossFade : springSheet}
                className="flex h-full min-h-[20rem] flex-col items-center justify-center rounded-2xl border border-line bg-ink-2 p-10 text-center"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-ember text-ink">
                  <Check size={26} />
                </span>
                <h3 className="display mt-6 text-2xl text-paper">
                  Message received.
                </h3>
                <p className="mt-2 max-w-xs text-paper-dim">
                  Thanks for reaching out — we&apos;ll be in touch within one
                  business day.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
                transition={{ duration: 0.16, ease: easeOut }}
                onSubmit={onSubmit}
                className="rounded-2xl border border-line bg-ink-2 p-6 md:p-8"
              >
                {/* honeypot */}
                <input
                  type="checkbox"
                  name="botcheck"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Name" name="name" placeholder="Jane Doe" required />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="jane@company.com"
                    required
                  />
                </div>
                <div className="mt-5">
                  <Field
                    label="Company"
                    name="company"
                    placeholder="Company (optional)"
                  />
                </div>
                <div className="mt-5">
                  <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted">
                    Project
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="What are you building, and what does success look like?"
                    className="w-full resize-none rounded-xl border border-line bg-ink px-4 py-3 text-paper transition-colors placeholder:text-muted focus:border-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                  />
                </div>

                {status === "error" && (
                  /* A dead end is not an acceptable failure state — the visitor
                     always leaves with a working way to reach us. */
                  <p role="alert" className="mt-4 text-sm text-ember">
                    {error}{" "}
                    <a
                      href={`mailto:${site.email}`}
                      className="underline underline-offset-4 transition-colors hover:text-ember-bright"
                    >
                      Email us instead
                    </a>{" "}
                    and we&apos;ll pick it up from there.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn btn-primary mt-6 w-full disabled:opacity-70"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Send enquiry <ArrowUpRight size={18} />
                    </>
                  )}
                </button>
              </motion.form>
            )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-paper transition-colors placeholder:text-muted focus:border-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
      />
    </div>
  );
}
