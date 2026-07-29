# 003 — Close the jump between the contact form and its success panel

- **Status**: DONE
- **Commit**: da804fa
- **Severity**: LOW (missed opportunity — additive, not corrective)
- **Category**: Missed opportunities
- **Estimated scope**: 1 file, ~15 lines

## Problem

When the contact form succeeds, `status` flips to `"success"` and React swaps the subtree.
The success panel animates *in*, but the form is unmounted in the same frame with no exit —
so a tall form disappears instantly and a shorter panel springs into the gap. Two unrelated
states occupy the same box one frame apart, and the container height jumps.

```tsx
/* src/components/Contact.tsx:108-131 — current */
          <Reveal delay={0.1}>
            {status === "success" ? (
              /* Completion is a moment worth marking — and it has to reach a
                 screen reader too, not just the eye. */
              <motion.div
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={reduce ? crossFade : springSheet}
                className="flex h-full min-h-[20rem] flex-col items-center justify-center rounded-2xl border border-line bg-ink-2 p-10 text-center"
              >
```

This is also the page's one rare, high-emotion moment — a first-and-only success — and it
is the category that is explicitly allowed a delight budget. It currently spends almost
none of it, while a hard unmount undercuts what little it does spend.

## Target

Wrap the conditional in `AnimatePresence mode="wait"` so the form finishes leaving before
the panel arrives. `mode="wait"` is the correct mode here: the two states are mutually
exclusive and must never overlap in the same box.

Exact values:

- **Form exit**: `{ opacity: 0, scale: reduce ? 1 : 0.98 }` with transition
  `{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }`. Short and ease-out — the form leaving is
  not the moment worth watching, so it gets out of the way fast.
- **Success enter**: unchanged from what is already there —
  `initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}`, `animate={{ opacity: 1, scale: 1 }}`,
  `transition={reduce ? crossFade : springSheet}`.
- Both branches need a stable `key` (`"form"` and `"success"`) — `AnimatePresence` uses it
  to tell the two states apart.
- Never scale from `0`. `0.98` and `0.96` are deliberate: nothing in the real world appears
  from or vanishes into nothing.

```tsx
/* target — src/components/Contact.tsx, replacing lines 108-131 through the form's closing tag */
          <Reveal delay={0.1}>
            <AnimatePresence mode="wait" initial={false}>
              {status === "success" ? (
                <motion.div
                  key="success"
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={reduce ? crossFade : springSheet}
                  className="flex h-full min-h-[20rem] flex-col items-center justify-center rounded-2xl border border-line bg-ink-2 p-10 text-center"
                >
                  {/* …existing success contents, unchanged… */}
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  exit={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
                  transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                  onSubmit={onSubmit}
                  className="rounded-2xl border border-line bg-ink-2 p-6 md:p-8"
                >
                  {/* …existing form contents, unchanged… */}
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
```

Note the form gets **no** `initial`/`animate` — it is present on first paint and must not
animate in on page load. `initial={false}` on `AnimatePresence` enforces this.

## Repo conventions to follow

- Motion tokens live in `src/lib/motion.ts` and are imported by name. `crossFade` and
  `springSheet` are **already imported** in `Contact.tsx:5`; no new import is needed for
  them. `[0.22, 1, 0.36, 1]` is this repo's house ease-out curve and is exported as
  `easeOut` from `src/lib/motion.ts:36` — import and use that token rather than retyping
  the array.
- `AnimatePresence` with `mode="wait"` and paired `key`s is already used correctly at
  `src/components/Nav.tsx:113-134` (the hamburger/close icon swap). Imitate that structure.
- Every component in this repo that animates branches on `useReducedMotion()` and drops the
  transform while keeping opacity — see `src/components/ui/Reveal.tsx:26-28` and
  `src/components/Nav.tsx:38-47`. `reduce` is already in scope in `Contact.tsx:14`.

## Steps

1. In `src/components/Contact.tsx`, extend the existing framer-motion import on line 2 to
   include `AnimatePresence`:
   `import { AnimatePresence, motion, useReducedMotion } from "framer-motion";`
2. Extend the motion-token import on line 5 to include `easeOut`:
   `import { crossFade, easeOut, springSheet } from "@/lib/motion";`
3. Wrap the entire `{status === "success" ? (…) : (…)}` expression inside `<Reveal>`
   (currently lines 109-182) in `<AnimatePresence mode="wait" initial={false}>…</AnimatePresence>`.
4. Add `key="success"` as the first prop on the existing success `motion.div` (line 112).
   Change nothing else about that element — its `initial`, `animate`, `transition`,
   `role`, `aria-live` and `className` are already correct.
5. Change the opening tag `<form` (line 132) to `<motion.form` and its closing `</form>`
   to `</motion.form>`. Add `key="form"`, plus
   `exit={{ opacity: 0, scale: reduce ? 1 : 0.98 }}` and
   `transition={{ duration: 0.16, ease: easeOut }}`. Do not add `initial` or `animate`.
6. Leave all form children — the honeypot input, both `Field` components, the textarea, the
   error paragraph, and the submit button — completely untouched.

## Boundaries

- Do NOT touch any file other than `src/components/Contact.tsx`.
- Do NOT change the submit handler `onSubmit` (lines 15-43), the Web3Forms request, or any
  status logic. This plan is presentation-only.
- Do NOT add `layout` or `layoutId` props — animating the container height is a layout
  animation and is explicitly out of scope here.
- Do NOT animate the left-hand pitch column; only the right-hand form/success column.
- Do NOT add new dependencies — `framer-motion` ^12.38.0 is already present.
- If `Contact.tsx` no longer matches the excerpt above, it has drifted since commit
  `da804fa` — STOP and report.

## Verification

- **Mechanical**: `npx tsc --noEmit` — expect no output. `npm run build` — expect
  `✓ Compiled successfully` and 5 static pages exported.
- **Feel check**: this one cannot be judged from the diff — the whole point is the seam
  between two states, so it must be watched. Run `npm run dev`, open
  `http://localhost:3000/#contact`.
  - The success state is hard to reach naturally because the Web3Forms access key is a
    placeholder (`src/lib/content.ts:30`), so submissions currently fail. To exercise the
    transition, temporarily change the initial state at `Contact.tsx:11` to
    `useState<Status>("success")` and toggle back and forth — **revert this before
    finishing**.
  - Confirm the form fades and settles back to 98% *before* the success panel begins to
    appear. There must be no frame where both are visible and no visible height snap.
  - Confirm the form does **not** animate on initial page load. If it fades in when you
    first scroll to the section, `initial={false}` is missing.
  - In DevTools → Animations, set playback speed to 10% and step through the swap; confirm
    neither element ever reaches `scale(0)` or `opacity` below 0 mid-flight.
  - In DevTools → Rendering, set `prefers-reduced-motion` to `reduce` and repeat: both
    states must cross-fade with **no scaling at all**, and the swap must still complete.
  - With a screen reader (VoiceOver: ⌘F5), confirm "Message received" is still announced
    once the panel settles — `AnimatePresence` must not have broken the `aria-live` region.
- **Done when**: the build passes, `Contact.tsx:11` is back to `useState<Status>("idle")`,
  the two states never overlap on screen, and the reduced-motion path scales nothing.
