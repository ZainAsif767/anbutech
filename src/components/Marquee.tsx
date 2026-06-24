const words = [
  "Custom Software",
  "Web Apps",
  "Mobile",
  "AI & Automation",
  "Cloud & DevOps",
  "Consulting",
  "Design Systems",
  "API Integration",
];

export default function Marquee() {
  return (
    <section
      aria-hidden
      className="relative mt-24 overflow-hidden border-y border-line py-6 md:mt-32"
    >
      <div className="flex w-max animate-marquee">
        {[0, 1].map((dup) => (
          <ul key={dup} className="flex items-center">
            {words.map((w) => (
              <li
                key={`${dup}-${w}`}
                className="flex items-center whitespace-nowrap"
              >
                <span className="display px-6 text-2xl text-paper-dim md:text-3xl">
                  {w}
                </span>
                <span className="text-ember">✳</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
