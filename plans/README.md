# Animation plans

Produced by an `improve-animations` audit of the AnbuTech landing page at commit
`da804fa`. Each plan is self-contained: it names exact files, lines, values and
verification steps, and can be handed to any agent without this context.

## Plans

| # | Title | Severity | Category | Scope | Status |
| --- | --- | --- | --- | --- | --- |
| [001](001-reduced-motion-duration-override.md) | Stop the reduced-motion rule from granting transitions to elements that had none | MEDIUM | Accessibility | 1 file, 1 line | DONE |
| [002](002-replace-transition-all.md) | Replace the four `transition-all` sites with named property lists | MEDIUM | Performance | 4 files, 1 class each | DONE |
| [003](003-contact-success-crossfade.md) | Close the jump between the contact form and its success panel | LOW | Missed opportunities | 1 file, ~15 lines | DONE |

All three applied and verified mechanically (typecheck, build, and greps confirming the
compiled output). The **feel checks in each plan have not been run** — they need a browser,
and the Chrome extension was not connected. See each plan's Verification section.

## Recommended order

**001 → 002 → 003.**

001 first: it is a one-line deletion that fixes a genuine defect in the reduced-motion
implementation, and every subsequent plan's reduced-motion feel check is only meaningful
once it is in. 002 next: mechanical, four independent one-token edits, no design judgement
required. 003 last: it is the only additive change and the only one whose result cannot be
confirmed from the diff alone.

## Dependencies

- **001 → 002, 003.** Soft dependency, not a hard blocker. Plans 002 and 003 both include
  a `prefers-reduced-motion` feel check; run against un-fixed 001, those checks observe the
  spurious 200ms fades that 001 removes and can read as a false failure. Sequence them, or
  discount reduced-motion timing observations if you don't.
- **002 and 003 are independent** of each other and touch disjoint files. `Contact.tsx` is
  edited only by 003; the four files in 002 do not include it.
- No plan depends on 003.

## Not planned (recorded so they are not re-raised)

Findings that were surfaced by the audit and deliberately not turned into plans:

- **`.card` 400ms hover border fade + untokenized curves** (`globals.css:164`,
  duplicating `easeOut` from `motion.ts:36`). Real but low-value: a duration trim plus a
  `--ease-*` / `--duration-*` token layer this three-curve codebase does not yet need.
  Worth doing if the motion vocabulary grows.
- **Dead `--animate-float` token** (`globals.css:46`, `:290-297`, `:322`). Never used by
  any component. Pure dead-code cleanup, not an animation change.
- **Ungated `:hover` motion** on Tailwind `group-hover:translate-x-1` / `scale-125`
  utilities — **not a real finding**. Tailwind v4 already compiles every `hover:` variant
  inside `@media (hover: hover)`; verified in the built stylesheet. Only the plain-CSS
  `.btn` / `.card` rules ever needed manual gating, and they already have it.
- **framer-motion `y` / `scale` / `rotate` shorthands** (`Reveal.tsx:26`, `Hero.tsx:12`,
  `Nav.tsx:19`). Motion composes these on the main thread rather than handing them to
  WAAPI, which is a genuine performance rule — but this page animates roughly 14 elements,
  all one-shot, and rewriting them as full `transform` strings would significantly
  complicate the reduced-motion branching for no measurable gain. Deliberately left alone.
- **700ms scroll-reveal durations** (`motion.ts:39`). Over the 300ms UI budget, but these
  are once-per-visit marketing reveals, which that budget explicitly exempts.

## Also worth knowing

The contact form is **not currently functional**: `site.web3formsKey` in
`src/lib/content.ts:30` is still the placeholder `"YOUR_WEB3FORMS_ACCESS_KEY"`. Submissions
fail and surface the error branch. This is unrelated to motion and out of scope for these
plans, but plan 003's feel check depends on reaching the success state, so it documents a
temporary workaround.
