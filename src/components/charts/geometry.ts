/** Rectángulo con esquinas superiores redondeadas, anclado a la base (mark spec de gráficas). */
export function topRoundRect(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): string {
  const rr = Math.min(r, w / 2, h);
  if (h <= 0) return "";
  return `M${x} ${y + h} L${x} ${y + rr} Q${x} ${y} ${x + rr} ${y} L${x + w - rr} ${y} Q${x + w} ${y} ${x + w} ${y + rr} L${x + w} ${y + h} Z`;
}

/** Tokens institucionales para relleno/trazo en SVG (sin HEX sueltos, regla visual §1.7). */
export const UC = {
  green: "var(--uc-green)",
  greenDark: "var(--uc-green-dark)",
  gold: "var(--uc-gold)",
  turquoise: "var(--uc-turquoise)",
  track: "rgba(0, 123, 62, 0.08)",
  area: "rgba(0, 123, 62, 0.10)",
} as const;
