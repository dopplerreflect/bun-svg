import chroma from "chroma-js";

export const oklch = (l: number, c: number, h: number): string =>
  chroma.oklch(l, c, h).hex();
