import { nav, site } from "@/lib/content";
import Logo from "./ui/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="shell py-14 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {site.tagline} {site.location}.
            </p>
          </div>

          <div className="flex flex-wrap gap-12">
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-muted">
                Navigate
              </h4>
              <ul className="mt-4 space-y-2.5">
                {nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-sm text-paper-dim transition-colors hover:text-ember"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-muted">
                Connect
              </h4>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-sm text-paper-dim transition-colors hover:text-ember"
                  >
                    {site.email}
                  </a>
                </li>
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-paper-dim transition-colors hover:text-ember"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.founded} {site.name}. All rights reserved.
          </p>
          <p className="font-mono tracking-wider">
            Built end to end by the unit.
          </p>
        </div>
      </div>
    </footer>
  );
}
