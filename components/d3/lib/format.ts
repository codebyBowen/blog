import { format } from "d3-format";

export const pct = (n: number) => `${n >= 0 ? "+" : ""}${Math.round(n)}%`;
export const usd2 = format("$.2f");
export const int = format(",.0f");

/** Interpolate a number for count-up animations. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
