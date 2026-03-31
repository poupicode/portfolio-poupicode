/**
 * Convert a design pixel value to dvw units.
 *
 * Usage:
 *   dvw(48)        → "3.333dvw"  (48px on a 1440px desktop design)
 *   dvw(32, true)  → "8.205dvw"  (32px on a 390px mobile design)
 *
 * "rien ne bouge" on resize: within each range the layout scales
 * proportionally. The single breakpoint switch (mobile ↔ desktop)
 * is handled via CSS custom properties in globals.css.
 */

const DESKTOP = 1440;
const MOBILE  = 390;

export const dvw = (px: number, mobile = false): string =>
  `${((px / (mobile ? MOBILE : DESKTOP)) * 100).toFixed(3)}dvw`;
