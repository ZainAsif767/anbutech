"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, CalendarDays, Check, Loader2, Mail } from "lucide-react";
import { site } from "@/lib/content";
import Reveal from "./ui/Reveal";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
        setStatus("error");
        setError(json.message || "Something went wrong. Please email us instead.");
      }
    } catch {
      setStatus("error");
      setError("Network error. Please email us instead.");
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
              <h2 className="display mt-5 text-4xl text-paper sm:text-5xl md:text-6xl text-balance">
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
            {status === "success" ? (
              <div className="flex h-full min-h-[20rem] flex-col items-center justify-center rounded-2xl border border-line bg-ink-2 p-10 text-center">
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
              </div>
            ) : (
              <form
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
                    className="w-full resize-none rounded-xl border border-line bg-ink px-4 py-3 text-paper placeholder:text-muted focus:border-ember focus:outline-none"
                  />
                </div>

                {status === "error" && (
                  <p className="mt-4 text-sm text-ember">{error}</p>
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
              </form>
            )}
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
        className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-paper placeholder:text-muted focus:border-ember focus:outline-none"
      />
    </div>
  );
}
