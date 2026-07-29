# 001 — Stop the reduced-motion rule from granting transitions to elements that had none

- **Status**: DONE
- **Commit**: da804fa
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file, 1 line deleted

## Problem

The `prefers-reduced-motion` block in `src/app/globals.css` applies two declarations to
the universal selector. The first narrows which properties may transition — correct. The
second forces a duration onto **every element on the page**, including elements that had
no `transition` at all.

```css
/* src/app/globals.css:328-335 — current */
  /* Keep only the channels that aid comprehension; drop everything that travels. */
  *,
  *::before,
  *::after {
    transition-property: opacity, color, background-color, border-color,
      box-shadow, outline-color !important;
    transition-duration: 0.2s !important;
  }
```

`transition-duration` defaults to `0s`. An element with no author-specified transition is
inert. By setting `0.2s` on `*`, this rule pairs that duration with the six properties
named above and turns every previously-instant color, background, border, and shadow
change on the page into a 200ms fade — only for users who asked for *less* motion.

Concrete cases this affects at `da804fa`:

- `src/components/Process.tsx:129` — the timeline node's `border-color` /
  `background-color` / `box-shadow` already animate at `duration-300`; this silently
  retimes them to 200ms.
- `src/components/AccentSwitcher.tsx:64-71` — the active-swatch `box-shadow` ring is
  applied via inline style with no transition. Under reduced motion it gains a 200ms
  shadow fade on every accent change.
- `src/components/Contact.tsx:158` and `:213` — the form inputs' `focus:border-ember`
  already has `transition-colors`; unaffected. But the `role="alert"` error paragraph at
  `Contact.tsx:163` and any other newly-rendered colored element inherits the rule.

The intent of the block — stated in its own comment at `globals.css:311-313` — is to
remove travel while keeping comprehension aids. Adding new animation contradicts that.

## Target

Delete the `transition-duration` declaration. Keep the property restriction, which is the
part doing the real work: it strips `transform` from every transition, so nothing travels.
Elements that already declare a transition keep their own author-specified duration
(`0.12s` on `.btn` transform — now filtered out anyway, `0.25s` on `.btn` colors, `0.3s`
on `.card` transform — filtered out, `0.4s` on `.card` border-color). Elements with no
transition stay at the `0s` default and remain instant.

```css
/* src/app/globals.css:328-334 — target */
  /* Keep only the channels that aid comprehension; drop everything that travels.
     Durations are deliberately left alone: restricting the property list is what
     removes movement. Forcing a duration here would *grant* a transition to every
     element that previously had none. */
  *,
  *::before,
  *::after {
    transition-property: opacity, color, background-color, border-color,
      box-shadow, outline-color !important;
  }
```

## Repo conventions to follow

- All global CSS lives in `src/app/globals.css`. There is no separate tokens file; design
  tokens are custom properties in the `:root` block at `globals.css:7-24`, and Tailwind v4
  theme bindings live in the `@theme inline` block at `globals.css:26-48`.
- Accessibility media queries are grouped together at the end of the file under the
  `/* Accessibility preferences */` banner comment (`globals.css:309-314`), followed by
  `prefers-reduced-transparency` and `prefers-contrast` blocks. Keep that grouping.
- Comments in this file explain *why*, not *what* — see `globals.css:320` and
  `globals.css:342-343` for the house style. Match it.

## Steps

1. Open `src/app/globals.css`.
2. Locate the universal-selector rule inside `@media (prefers-reduced-motion: reduce)`,
   currently at lines 329-335.
3. Delete the single line `    transition-duration: 0.2s !important;` (line 334).
4. Replace the preceding comment on line 328 with the three-line comment shown in the
   **Target** section above, so the reasoning is recorded and the line is not
   reintroduced later.
5. Change nothing else inside the media query. In particular, leave the
   `animation: none !important` rule (lines 321-326) and the
   `transform: none !important` rule (lines 337-341) exactly as they are — both are
   correct and load-bearing.

## Boundaries

- Do NOT touch any file other than `src/app/globals.css`.
- Do NOT modify the `prefers-reduced-transparency` or `prefers-contrast` blocks
  (`globals.css:346` onward).
- Do NOT alter any component's own transition durations to "compensate" for this change.
  The point is that each element keeps the duration its author gave it.
- Do NOT add new dependencies.
- If the line at `globals.css:334` is not `transition-duration: 0.2s !important;`, the
  file has drifted since commit `da804fa` — STOP and report rather than improvising.

## Verification

- **Mechanical**: `npm run build` — expect `✓ Compiled successfully` and a clean export of
  5 static pages, matching the pre-change baseline. `npx tsc --noEmit` — expect no output
  (this change is CSS-only, so it is a regression guard rather than a real check).
- **Feel check**: run `npm run dev`, open `http://localhost:3000`, and in Chrome DevTools
  open the Rendering panel → set **Emulate CSS media feature prefers-reduced-motion** to
  `reduce`. Then confirm:
  - Hovering a card in the **Capabilities** section (`Stack.tsx`) still fades its border
    in — the comprehension aid survives — but the card does **not** lift.
  - Clicking an accent swatch in the nav switches the active ring **instantly**, with no
    200ms shadow fade. This is the specific regression being fixed.
  - Scrolling through the **Process** section: nodes still change color as stages
    complete, and nothing slides or travels.
  - The marquee is stopped and the hero glow is not pulsing.
  - The "Sending…" spinner still spins if you submit the contact form — it is
    deliberately exempt (see the comment at `globals.css:342-343`).
- **Done when**: `grep -n "transition-duration" src/app/globals.css` returns no match
  inside the `prefers-reduced-motion` block, the build passes, and the accent-swatch ring
  switches instantly under emulated reduced motion.
