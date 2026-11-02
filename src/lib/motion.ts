/** "smooth", unless the user asked the OS for reduced motion (CSS can't reach JS scrolling). */
export function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}
