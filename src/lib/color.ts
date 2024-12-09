import chroma from "chroma-js";

export const oklch = (l: number, c: number, h: number, a: number = 1): string =>
  chroma.oklch(l, c, h).alpha(a).hex();
