import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/content";
import SectionHeader from "./ui/SectionHeader";
import Reveal from "./ui/Reveal";

export default function Services() {
  return (
    <section id="services" className="relative py-24 md:py-36">
      <div className="shell">
        <SectionHeader
          index="01"
          kicker="Services"
          title={
            <>
              Everything it takes to{" "}
              <span className="ember-text">build a product.</span>
            </>
          }
          intro="One unit, the full stack of capability. No stitching vendors together — we cover the work end to end."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal
                key={s.no}
                delay={(i % 3) * 0.06}
                className="group relative flex flex-col bg-ink p-7 transition-colors duration-300 hover:bg-ink-2 md:p-9"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-widest text-muted">
                    {s.no}
                  </span>
                  <Icon
                    size={22}
                    className="text-ember transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <h3 className="display mt-8 text-2xl text-paper md:text-[1.75rem]">
                  {s.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-paper-dim">
                  {s.blurb}
                </p>

                <ul className="mt-6 space-y-2">
                  {s.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-center gap-2.5 text-sm text-muted"
                    >
                      <span className="h-1 w-1 rounded-full bg-ember" />
                      {p}
                    </li>
                  ))}
                </ul>

                <ArrowUpRight
                  size={18}
                  className="mt-8 text-muted opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-ember group-hover:opacity-100"
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
