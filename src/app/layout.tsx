import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/lib/content";
import { ACCENTS, STORAGE_KEY } from "@/lib/accents";
import "./globals.css";

// Applies a saved accent before paint to avoid a color flash on load.
const accentMap = Object.fromEntries(ACCENTS.map((a) => [a.id, a.vars]));
const accentScript = `(function(){try{var id=localStorage.getItem(${JSON.stringify(
  STORAGE_KEY
)});var m=${JSON.stringify(
  accentMap
)};if(id&&m[id]){var r=document.documentElement;for(var k in m[id]){r.style.setProperty(k,m[id][k]);}}}catch(e){}})();`;

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "software development",
    "custom software",
    "web development",
    "mobile apps",
    "AI automation",
    "cloud devops",
    "AnbuTech",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    url: site.url,
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
  },
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${sans.variable} ${mono.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: accentScript }} />
        <a href="#main" className="skip-link btn btn-primary">
          Skip to content
        </a>
        <div className="grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}
