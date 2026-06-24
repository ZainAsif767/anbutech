import { why, site } from "@/lib/content";
import SectionHeader from "./ui/SectionHeader";
import Reveal from "./ui/Reveal";

export default function Why() {
  return (
    <section
      id="why"
      className="relative border-t border-line bg-ink-2/40 py-24 md:py-36"
    >
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeader
            index="04"
            kicker="Why AnbuTech"
            title={
              <>
                Hire the unit, not the{" "}
                <span className="outline-text">overhead.</span>
              </>
            }
            intro={`Founded ${site.founded}, AnbuTech runs lean and senior on purpose. You get operators who own the outcome — start to finish.`}
          />

          <div className="grid gap-px self-center overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {why.map((item, i) => (
              <Reveal
                key={item.title}
                delay={(i % 2) * 0.06}
                className="bg-ink p-7 md:p-8"
              >
                <h3 className="display text-lg text-paper md:text-xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-paper-dim">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
