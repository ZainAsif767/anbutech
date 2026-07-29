import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { site } from "@/lib/content";

// Required by `output: "export"` — prerenders the image to a file at build time.
export const dynamic = "force-static";

export const alt = `${site.name} · ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fonts are vendored in _og/ so the build never depends on a network fetch.
const fontDir = join(process.cwd(), "src", "app", "_og");
const display = readFileSync(join(fontDir, "BricolageGrotesque-ExtraBold.ttf"));
const mono = readFileSync(join(fontDir, "JetBrainsMono-Medium.ttf"));

const INK = "#0a0a0b";
const PAPER = "#f4f1ea";
const PAPER_DIM = "#b8b4ab";
const EMBER = "#f4622e";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: INK,
          fontFamily: "Bricolage",
          position: "relative",
        }}
      >
        {/* The tiled grid that used to sit here was dropped along with the one
            on the site. The ember glow below carries the surface. */}
        {/* ember glow, standing in for the blurred .glow orbs */}
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -180,
            width: 900,
            height: 900,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle, rgba(244,98,46,0.30) 0%, rgba(244,98,46,0.10) 42%, rgba(10,10,11,0) 68%)",
          }}
        />

        {/* ---- header: mark + wordmark ---- */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="14" fill="#16161a" />
              <path
                d="M32 12 L50 52 H41.5 L38 43 H26 L22.5 52 H14 L32 12 Z M29 35 H35 L32 27 Z"
                fill={EMBER}
              />
            </svg>
            <div style={{ display: "flex", fontSize: 40, letterSpacing: "-0.02em" }}>
              <span style={{ color: PAPER }}>Anbu</span>
              <span style={{ color: EMBER }}>Tech</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "JetBrains",
              fontSize: 17,
              letterSpacing: "0.22em",
              color: EMBER,
            }}
          >
            EST. {site.founded}
          </div>
        </div>

        {/* ---- headline ---- */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 92,
            lineHeight: 0.98,
            letterSpacing: "-0.035em",
          }}
        >
          <div style={{ display: "flex", color: PAPER }}>We build, ship,</div>
          <div style={{ display: "flex" }}>
            <span style={{ color: PAPER, marginRight: 22 }}>and</span>
            <span style={{ color: EMBER, marginRight: 22 }}>scale</span>
            <span style={{ color: PAPER_DIM }}>software.</span>
          </div>
        </div>

        {/* ---- footer: domain + capability strip ---- */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "JetBrains",
            fontSize: 18,
            letterSpacing: "0.14em",
          }}
        >
          <div style={{ display: "flex", color: PAPER }}>{site.domain}</div>
          <div style={{ display: "flex", color: "#82807a" }}>
            WEB · MOBILE · AI · CLOUD
          </div>
        </div>

        {/* ember baseline */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: 8,
            display: "flex",
            backgroundImage: `linear-gradient(90deg, ${EMBER} 0%, #c2410c 55%, rgba(10,10,11,0) 100%)`,
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage", data: display, style: "normal", weight: 800 },
        { name: "JetBrains", data: mono, style: "normal", weight: 500 },
      ],
    }
  );
}
