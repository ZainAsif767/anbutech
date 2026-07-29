# 002 — Replace the four `transition-all` sites with named property lists

- **Status**: DONE
- **Commit**: da804fa
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 4 files, 1 class string each

## Problem

`transition-property: all` tells the browser to watch every animatable property on the
element for changes. It is the documented anti-pattern: it animates properties nobody
intended to animate, and any of those that are layout- or paint-bound run off the GPU.

Four sites use it at commit `da804fa`.

**1. The timeline node — the one that actually costs something.** Five of these render in
the Process section, and each animates a 22px `box-shadow` glow as the scroll-driven stage
state flips:

```tsx
/* src/components/Process.tsx:128-137 — current */
        <span
          className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-all duration-300"
          style={{
            borderColor: active ? "var(--ember)" : "var(--line)",
            backgroundColor: done ? "var(--ember)" : "transparent",
            boxShadow: active ? "0 0 22px var(--glow-ember)" : "none",
          }}
        >
```

Only `border-color`, `background-color`, and `box-shadow` ever change here. `all` adds
every other property to the watch list for no benefit.

**2. The Services card arrow:**

```tsx
/* src/components/Services.tsx:60-63 — current */
                <ArrowUpRight
                  size={18}
                  className="mt-8 text-muted opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-ember group-hover:opacity-100"
                />
```

**3. The mobile-nav row arrow** — note it specifies no duration, so it silently inherits
Tailwind's `--default-transition-duration` of 150ms:

```tsx
/* src/components/Nav.tsx:184-188 — current */
                      <ArrowUpRight
                        size={22}
                        className="ml-auto self-center text-muted transition-all group-hover:translate-x-1 group-hover:text-ember"
                      />
```

**4. The accent-switcher tooltip:**

```tsx
/* src/components/ui/AccentSwitcher.tsx:75-80 — current */
            <span
              className={`pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 scale-90 whitespace-nowrap rounded-md border border-line bg-ink-2 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-paper-dim opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100 ${tipPos}`}
            >
```

## Target

Name the properties each element actually changes.

**Critical detail — do not substitute `transform` here.** Tailwind v4 compiles
`translate-x-*` and `scale-*` to the *independent* `translate` and `scale` CSS properties,
not to `transform`. This is verifiable in the built stylesheet: `.transition-transform`
expands to `transition-property: transform, translate, scale, rotate`. A property list
naming only `transform` would compile without error and silently stop animating the arrow
nudges and the tooltip scale.

| File:line | Current | Target class |
| --- | --- | --- |
| `src/components/Process.tsx:129` | `transition-all duration-300` | `transition-[border-color,background-color,box-shadow] duration-300` |
| `src/components/Services.tsx:62` | `transition-all duration-300` | `transition-[opacity,translate,color] duration-300` |
| `src/components/Nav.tsx:186` | `transition-all` | `transition-[translate,color]` |
| `src/components/ui/AccentSwitcher.tsx:77` | `transition-all duration-200` | `transition-[opacity,scale] duration-200` |

Leave every duration exactly as it is, including the absent one on `Nav.tsx:186` — 150ms
is correct for a hover nudge, and adding an explicit duration is out of scope.

**Fallback if the arbitrary value does not compile.** If a `transition-[a,b,c]` class does
not appear in the generated CSS after a build (verify per the Verification section), use
Tailwind's bare `transition` utility instead of `transition-all` at that site. Bare
`transition` expands to a curated list covering color, opacity, box-shadow, transform,
translate, scale, rotate, and filter — no layout properties — which still resolves the
finding. Do not fall back to leaving `transition-all` in place.

## Repo conventions to follow

- This project uses Tailwind v4 (`@tailwindcss/postcss` ^4.2.2) with no `tailwind.config`
  file; theme values are declared in the `@theme inline` block at
  `src/app/globals.css:26-48`.
- Named-property transitions are already the house style in components — imitate these:
  - `src/components/Contact.tsx:98` — `className="transition-transform group-hover:translate-x-0.5"`
  - `src/components/Services.tsx:37` — `className="text-ember transition-transform duration-300 group-hover:scale-110"`
  - `src/components/Nav.tsx:54` — `className="text-sm text-paper-dim transition-colors hover:text-paper"`
- Class order in this repo follows the Tailwind convention: layout → color → transition →
  variants. Insert the replacement in the same position the old class occupied.

## Steps

1. `src/components/Process.tsx` line 129 — replace the substring `transition-all` with
   `transition-[border-color,background-color,box-shadow]`. Leave `duration-300` and every
   other class in the string untouched.
2. `src/components/Services.tsx` line 62 — replace `transition-all` with
   `transition-[opacity,translate,color]`. Leave `duration-300` and the three
   `group-hover:` classes untouched.
3. `src/components/Nav.tsx` line 186 — replace `transition-all` with
   `transition-[translate,color]`. Do not add a duration class.
4. `src/components/ui/AccentSwitcher.tsx` line 77 — replace `transition-all` with
   `transition-[opacity,scale]`. Leave `duration-200`, the two `group-hover:` classes and
   the two `group-focus-within:` classes untouched.
5. Run `npm run build`, then confirm each new class reached the stylesheet (see
   Verification). If any did not, apply the documented fallback for that site only.

## Boundaries

- Do NOT touch any file other than the four named above.
- Do NOT change markup, structure, component props, or inline `style` objects — only the
  `transition-*` token inside each `className` string.
- Do NOT change any duration, easing, or `group-hover:` / `group-focus-within:` variant.
- Do NOT "fix" the other `transition-*` utilities in these files; they are already
  correctly scoped.
- Do NOT add new dependencies.
- If a line does not contain `transition-all` where this plan says it does, the files have
  drifted since commit `da804fa` — STOP and report rather than searching for a substitute.

## Verification

- **Mechanical**:
  - `npx tsc --noEmit` — expect no output.
  - `npm run build` — expect `✓ Compiled successfully` and 5 static pages exported.
  - `grep -rn "transition-all" src/` — expect **no matches**. This is the primary check.
  - Confirm the arbitrary values compiled, which guards against the silent-failure mode:
    ```
    grep -o 'transition-property:border-color,background-color,box-shadow' out/_next/static/css/*.css
    grep -o 'transition-property:opacity,translate,color' out/_next/static/css/*.css
    grep -o 'transition-property:translate,color' out/_next/static/css/*.css
    grep -o 'transition-property:opacity,scale' out/_next/static/css/*.css
    ```
    Each must return a match. A miss means that site needs the bare-`transition` fallback.
- **Feel check**: run `npm run dev` and open `http://localhost:3000`.
  - Hover a card in the **Services** grid: the arrow at the card's bottom-left must still
    fade in **and slide right** while turning ember. If it fades but no longer slides, the
    `translate` property was dropped — this is the failure this plan is written to prevent.
  - Hover an accent swatch in the nav: the tooltip must still scale up from 90% as it
    fades in.
  - Narrow the window below 768px, open the mobile menu, and hover a row: the arrow must
    still nudge right.
  - Scroll slowly through the **Process** section and watch a node flip to complete: the
    ember glow must still fade in over 300ms rather than snapping.
  - In DevTools → Performance, record while scrolling the Process section and confirm no
    new long tasks versus a pre-change recording. This change should be neutral-to-better;
    it must not regress.
- **Done when**: `grep -rn "transition-all" src/` is empty, all four
  `transition-property:` greps hit, the build passes, and every hover behaviour listed
  above is visually unchanged from before the edit.
