/**
 * Convert rgb value in range [0, 255][0, 255][0, 255] to oklch value in range [0, 1][0, 1][0, 360]
 * @param rgb rgb value in range [0, 255][0, 255][0, 255]
 * @returns oklch value in range [0, 1][0, 1][0, 360]
 */
export function rgbToOklch(rgb: { r: number; g: number; b: number }) {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const r_ = rgbToLinearRgb(r);
  const g_ = rgbToLinearRgb(g);
  const b_ = rgbToLinearRgb(b);

  const l = 0.4122214708 * r_ + 0.5363325363 * g_ + 0.0514459929 * b_;
  const m = 0.2119034982 * r_ + 0.6806995451 * g_ + 0.1073969566 * b_;
  const s = 0.0883024619 * r_ + 0.2817188376 * g_ + 0.6299787005 * b_;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const C = Math.sqrt(A * A + B * B);
  const hRad = Math.atan2(B, A);
  const h = ((hRad * 180) / Math.PI + 360) % 360;

  return { L, C, h };
}

/**
 * Convert rgb value in range [0, 1] to linear rgb value in range [0, 1]
 * @param c rgb value in range [0, 1]
 * @returns linear rgb value in range [0, 1]
 */
function rgbToLinearRgb(c: number) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
