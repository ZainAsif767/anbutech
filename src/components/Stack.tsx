import { stack } from "@/lib/content";
import SectionHeader from "./ui/SectionHeader";
import Reveal from "./ui/Reveal";

export default function Stack() {
  return (
    <section id="stack" className="relative py-24 md:py-36">
      <div className="shell">
        <SectionHeader
          title={
            <>
              Tools we reach for{" "}
              <span className="ember-text">when it counts.</span>
            </>
          }
          intro="We're tool‑agnostic and pick what fits the job. This is where we're sharpest."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stack.map((group, i) => (
            <Reveal key={group.group} delay={i * 0.06} className="card p-6">
              <h3 className="font-mono text-xs uppercase tracking-widest text-ember">
                {group.group}
              </h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line bg-ink-2 px-3 py-1.5 text-sm text-paper-dim"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
