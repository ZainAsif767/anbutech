import type { Transition } from "framer-motion";

/**
 * Motion tokens, expressed the way Apple's designers reason about springs:
 * damping ratio (how much overshoot) + response (how quickly it reaches target),
 * rather than mass/stiffness/damping.
 *
 * Framer's `bounce` maps to (1 - dampingRatio); `visualDuration` maps to response.
 * A spring has no fixed duration — settle time emerges from the parameters.
 */

/** damping 1.0 · response 0.4 — critically damped. The default for anything a user did not throw. */
export const springMove: Transition = {
  type: "spring",
  bounce: 0,
  visualDuration: 0.4,
};

/** damping 0.8 · response 0.3 — a little overshoot. Only for momentum-carrying gestures. */
export const springSheet: Transition = {
  type: "spring",
  bounce: 0.2,
  visualDuration: 0.3,
};

/** damping 0.8 · response 0.4 — rotation and icon swaps. */
export const springRotate: Transition = {
  type: "spring",
  bounce: 0.2,
  visualDuration: 0.4,
};

/**
 * Scroll-triggered reveals are not gesture-driven — nothing can grab them
 * mid-flight — so a tween with a decelerating curve is the honest choice here.
 */
export const easeOut = [0.22, 1, 0.36, 1] as const;
export const tweenReveal: Transition = { duration: 0.7, ease: easeOut };

/** Reduced motion: a cross-fade, not "no feedback". Vestibular-safe, still legible. */
export const crossFade: Transition = { duration: 0.2, ease: "easeOut" };
