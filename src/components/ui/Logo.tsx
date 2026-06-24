export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="shrink-0"
      >
        <rect width="64" height="64" rx="14" fill="#16161a" />
        <path
          d="M32 12 L50 52 H41.5 L38 43 H26 L22.5 52 H14 L32 12 Z M29 35 H35 L32 27 Z"
          fill="var(--ember)"
        />
      </svg>
      <span className="display text-[1.15rem] font-bold tracking-tight text-paper">
        Anbu<span className="ember-text">Tech</span>
      </span>
    </span>
  );
}
