export interface ChartProps {
  /** Measured container width in px. */
  width: number;
  /** True once scrolled into view — drives entrance animation. */
  active: boolean;
  /** Optional per-instance options parsed from the markdown viz block. */
  options?: Record<string, unknown>;
}
