import {
  Code2,
  Globe,
  Smartphone,
  Sparkles,
  Cloud,
  Compass,
  Search,
  PenTool,
  Hammer,
  Rocket,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  SITE CONFIG — edit these placeholders.                            */
/*  Anything marked TODO needs a real value before launch.            */
/* ------------------------------------------------------------------ */
export const site = {
  name: "AnbuTech",
  domain: "anbu-tech.com",
  // www is canonical — the apex redirects to it in Vercel
  url: "https://www.anbu-tech.com",
  tagline: "An elite engineering unit that ships.",
  description:
    "AnbuTech is a software engineering unit building custom software, web & mobile apps, AI automation and cloud platforms. Designed, built and shipped end to end.",
  email: "iamahmedismail19@gmail.com",
  /*
   * Web3Forms — free, works on a static site. Get a key at https://web3forms.com
   * by registering the inbox that should receive enquiries; the key is bound to
   * that address, so it is what decides where the form lands.
   *
   * The key is public by design (it ships in the client bundle), so this is not
   * a secret — it lives in an env var only so it can differ per environment and
   * so the repo does not carry a live endpoint.
   *
   * Set NEXT_PUBLIC_WEB3FORMS_KEY in .env (or .env.local) for local builds. Both
   * are gitignored, so deployments do NOT inherit them — set the same variable in
   * the Vercel project settings or production ships a form that cannot deliver.
   * `output: "export"` inlines the value at build time, so changing it requires a
   * rebuild, not just a redeploy.
   */
  web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "",
  // Calendly "Book a call" link
  calendly: "https://calendly.com/iamahmedismail19/30min",
  founded: "2026",
  location: "Remote · Worldwide",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/anbu-tech" },
  ],
};

export const nav = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Stack", href: "#stack" },
  { label: "Why us", href: "#why" },
];

export const heroStats = [
  { value: "End‑to‑end", label: "Discovery to deployment" },
  { value: "Senior‑only", label: "No hand‑offs, no juniors" },
  { value: "Ship‑first", label: "Working software, fast" },
];

export type Service = {
  no: string;
  title: string;
  blurb: string;
  points: string[];
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    no: "01",
    title: "Custom Software",
    blurb:
      "Bespoke platforms engineered around your operation, not bent to fit someone else's template.",
    points: ["Internal tools & dashboards", "SaaS products", "API & systems integration"],
    icon: Code2,
  },
  {
    no: "02",
    title: "Web Applications",
    blurb:
      "Fast, accessible, search‑ready web apps with the polish your brand deserves.",
    points: ["Next.js / React", "Design systems", "Performance & SEO"],
    icon: Globe,
  },
  {
    no: "03",
    title: "Mobile Development",
    blurb:
      "Native‑grade iOS and Android experiences from a single, maintainable codebase.",
    points: ["React Native / Flutter", "App Store delivery", "Offline‑first UX"],
    icon: Smartphone,
  },
  {
    no: "04",
    title: "AI & Automation",
    blurb:
      "LLM features, agents and automations that remove busywork and compound over time.",
    points: ["LLM & agent integration", "RAG & data pipelines", "Workflow automation"],
    icon: Sparkles,
  },
  {
    no: "05",
    title: "Cloud & DevOps",
    blurb:
      "Infrastructure that scales quietly: automated, observable and built to stay up.",
    points: ["AWS / GCP / Vercel", "CI/CD pipelines", "Monitoring & reliability"],
    icon: Cloud,
  },
  {
    no: "06",
    title: "Consulting",
    blurb:
      "Architecture reviews, technical due diligence and a roadmap you can actually execute.",
    points: ["Technical strategy", "Architecture & audits", "Team augmentation"],
    icon: Compass,
  },
];

export type Step = {
  no: string;
  title: string;
  body: string;
  icon: LucideIcon;
};

// Not `process` — a module-scoped const by that name shadows the Node global
// for this entire file, which breaks any process.env read here.
export const processSteps: Step[] = [
  {
    no: "01",
    title: "Discover",
    body: "We map the real problem, constraints and success metrics before a line of code is written.",
    icon: Search,
  },
  {
    no: "02",
    title: "Design",
    body: "Architecture and interface, defined together, so what we build is what you need.",
    icon: PenTool,
  },
  {
    no: "03",
    title: "Build",
    body: "Tight iterations, visible progress. You see working software every week, not status decks.",
    icon: Hammer,
  },
  {
    no: "04",
    title: "Ship",
    body: "Tested, monitored, deployed. We sweat the launch so it's a non‑event, not a fire drill.",
    icon: Rocket,
  },
  {
    no: "05",
    title: "Scale",
    body: "We stay on to harden, optimise and grow what we built. Partners, not vendors.",
    icon: TrendingUp,
  },
];

export const stack: { group: string; items: string[] }[] = [
  { group: "Frontend", items: ["TypeScript", "React", "Next.js", "Tailwind", "React Native"] },
  { group: "Backend", items: ["Node.js", "Python", "Elixir", "Go", "PostgreSQL"] },
  { group: "AI", items: ["OpenAI", "Anthropic", "LangChain", "Vector DBs", "RAG"] },
  { group: "Cloud", items: ["AWS", "GCP", "Vercel", "Docker", "Terraform"] },
];

export const why = [
  {
    title: "Senior operators only",
    body: "You work directly with the people writing the code. No account managers, no telephone game, no juniors learning on your budget.",
  },
  {
    title: "Owned end to end",
    body: "One unit takes the work from first call to live product and beyond. Nothing falls through the gaps between teams.",
  },
  {
    title: "Shipped, not theorised",
    body: "We optimise for working software in production. Momentum is the strategy, and you feel progress every single week.",
  },
  {
    title: "Built to be handed over",
    body: "Clean architecture, real documentation and tests. If you ever bring it in‑house, your team will thank us.",
  },
];
