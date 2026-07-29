import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MoveLeft } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { nav, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col overflow-hidden">
      <div
        className="glow"
        style={{
          top: "-10rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "38rem",
          height: "26rem",
          background: "var(--glow-ember)",
        }}
      />

      <div className="shell relative flex flex-1 flex-col py-10">
        <Link href="/" aria-label="AnbuTech home" className="self-start">
          <Logo />
        </Link>

        <div className="flex flex-1 flex-col justify-center py-16">
          <span className="mono-label">Error 404</span>
          <h1 className="display display-xl mt-5 text-[3rem] sm:text-6xl md:text-7xl">
            This page didn&apos;t make it to production.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-paper-dim">
            The link is broken or the page has moved. Nothing here is lost;
            everything on the site is one step away.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/" className="btn btn-primary">
              <MoveLeft size={18} /> Back to the site
            </Link>
            <Link href="/#contact" className="btn btn-ghost">
              Start a project <ArrowUpRight size={18} />
            </Link>
          </div>

          {/* A dead end should still offer every real route, not just "go home". */}
          <nav aria-label="Site sections" className="mt-16 border-t border-line pt-6">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
              Or jump straight to
            </h2>
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={`/${item.href}`}
                    className="text-sm text-paper-dim transition-colors hover:text-ember"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-sm text-paper-dim transition-colors hover:text-ember"
                >
                  Email us
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}
