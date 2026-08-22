/**
 * Subtle animated film-grain overlay.
 * Purely decorative — hidden from assistive tech and pointer events.
 */
export function NoiseOverlay() {
  return <div aria-hidden className="noise-overlay pointer-events-none fixed inset-0 z-[100] select-none" />;
}
