import Reveal from "./Reveal";

export default function SectionHeader({
  index,
  kicker,
  title,
  intro,
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
  intro?: string;
}) {
  return (
    <div className="max-w-3xl">
      <Reveal className="flex items-center gap-3">
        <span className="mono-label">{index}</span>
        <span className="h-px w-10 bg-line" />
        <span className="mono-label !text-paper-dim">{kicker}</span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="display display-xl mt-5 text-4xl text-paper sm:text-5xl md:text-6xl text-balance">
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
