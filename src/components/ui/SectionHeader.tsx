import Reveal from "./Reveal";

/*
 * `kicker` is optional on purpose. An eyebrow above every section header is the
 * templated rhythm that makes a page read as generated, so they are rationed to
 * roughly one per three sections and the headline carries the rest.
 *
 * The numbered prefix ("01", "02", …) was removed outright: enumerating sections
 * tells the reader nothing their scroll position has not already told them.
 */
export default function SectionHeader({
  kicker,
  title,
  intro,
}: {
  kicker?: string;
  title: React.ReactNode;
  intro?: string;
}) {
  return (
    <div className="max-w-3xl">
      {kicker && (
        <Reveal className="flex items-center gap-3">
          <span className="h-px w-10 bg-line" />
          <span className="mono-label !text-paper-dim">{kicker}</span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2
          className={`display display-xl text-4xl text-paper sm:text-5xl md:text-6xl text-balance ${
            kicker ? "mt-5" : ""
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-paper-dim sm:text-lg">
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
