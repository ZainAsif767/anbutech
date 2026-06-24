"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Logo from "./ui/Logo";
import AccentSwitcher from "./ui/AccentSwitcher";
import { nav, site } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll + close on Escape while the overlay is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-line bg-ink/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="shell flex h-16 items-center justify-between md:h-20">
        <a href="#top" aria-label="AnbuTech home" className="relative z-10">
          <Logo />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-paper-dim transition-colors hover:text-paper"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <AccentSwitcher />
          <span className="h-4 w-px bg-line" />
          <a href="#contact" className="btn btn-primary">
            Start a project
          </a>
        </div>

        <button
          className="relative z-10 -mr-2 grid h-10 w-10 place-items-center text-paper md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </nav>

      {/* full-screen mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 top-0 z-0 flex h-[100dvh] flex-col bg-ink md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* ambient glow */}
            <div
              className="glow"
              style={{
                top: "-6rem",
                right: "-6rem",
                width: "22rem",
                height: "22rem",
                background: "var(--glow-ember)",
                opacity: 0.4,
              }}
            />

            <div className="shell relative flex flex-1 flex-col pt-24 pb-10">
              <ul className="flex flex-col">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4, ease, delay: 0.08 + i * 0.06 }}
                    className="border-b border-line"
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 py-5"
                    >
                      <span className="font-mono text-xs text-muted">
                        0{i + 1}
                      </span>
                      <span className="display text-4xl text-paper transition-colors group-hover:text-ember">
                        {item.label}
                      </span>
                      <ArrowUpRight
                        size={22}
                        className="ml-auto self-center text-muted transition-all group-hover:translate-x-1 group-hover:text-ember"
                      />
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease, delay: 0.08 + nav.length * 0.06 }}
                className="mt-auto"
              >
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="btn btn-primary w-full"
                >
                  Start a project <ArrowUpRight size={18} />
                </a>

                <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted">
                    Accent
                  </span>
                  <AccentSwitcher tooltip="top" />
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <a
                    href={`mailto:${site.email}`}
                    className="text-sm text-paper-dim transition-colors hover:text-paper"
                  >
                    {site.email}
                  </a>
                  <div className="flex gap-4">
                    {site.socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-ember"
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
