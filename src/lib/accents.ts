/* ------------------------------------------------------------------ */
/*  Accent themes — visitors can switch the signature color.          */
/*  Single source of truth: used by the switcher UI AND the inline    */
/*  no-flash loader script in layout.tsx.                             */
/* ------------------------------------------------------------------ */
export type Accent = {
  id: string;
  label: string;
  swatch: string;
  vars: Record<string, string>;
};

export const ACCENTS: Accent[] = [
  {
    id: "ember",
    label: "Ember",
    swatch: "#f4622e",
    vars: {
      "--ember": "#f4622e",
      "--ember-bright": "#ff7a45",
      "--ember-deep": "#c2410c",
      "--glow-ember": "rgba(244, 98, 46, 0.32)",
    },
  },
  {
    id: "lime",
    label: "Lime",
    swatch: "#c6ff3d",
    vars: {
      "--ember": "#c6ff3d",
      "--ember-bright": "#d8ff70",
      "--ember-deep": "#84cc16",
      "--glow-ember": "rgba(198, 255, 61, 0.24)",
    },
  },
  {
    id: "cyan",
    label: "Cyan",
    swatch: "#2de2c5",
    vars: {
      "--ember": "#2de2c5",
      "--ember-bright": "#5cefd8",
      "--ember-deep": "#14b8a6",
      "--glow-ember": "rgba(45, 226, 197, 0.26)",
    },
  },
];

export const STORAGE_KEY = "anbutech-accent";
