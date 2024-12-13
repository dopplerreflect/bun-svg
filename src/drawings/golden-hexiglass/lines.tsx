import type { Line } from "@dopplerreflect/geometry/src/types";
import { radialPoint, PHI } from "@dopplerreflect/geometry";
import { oklch } from "chroma-js";

type Props = {
  lines: Line[];
};
export default function Lines(props: Props) {
  const { lines } = props;
  const styles = {
    lines: {
      stroke: oklch(0.95, 0.37, 90).hex(),
    },
  };
  return (
    <g
      id='lines'
      style={styles.lines}
    >
      {lines.map((h, i) => (
        <line
          key={i}
          x1={h[0].x}
          y1={h[0].y}
          x2={h[1].x}
          y2={h[1].y}
        />
      ))}
    </g>
  );
}

export const lineArray = (angles: number[], radii: number[]): Line[] => [
  ...angles.map(
    (a, i) => [radialPoint(a, radii[0] * 2), { x: 0, y: 0 }] as Line,
  ),
  ...angles.map(
    (a, i) =>
      [
        radialPoint(a, radii[0] * 2),
        radialPoint(angles[(i + 1) % angles.length], radii[0] * 2),
      ] as Line,
  ),
  ...angles.map(
    (a, i) =>
      [
        radialPoint(a, radii[0] * PHI),
        radialPoint(angles[(i + 1) % angles.length], radii[0] * PHI),
      ] as Line,
  ),
  ...angles.map(
    (a, i) =>
      [
        radialPoint(angles[(i + 0) % angles.length], radii[0], {
          center: radialPoint(angles[(i + 1) % angles.length], radii[0]),
        }),
        radialPoint(angles[(i + 2) % angles.length], radii[0], {
          center: radialPoint(angles[(i + 3) % angles.length], radii[0]),
        }),
      ] as Line,
  ),
  ...angles.map(
    (a, i) =>
      [
        radialPoint(angles[(i + 1) % angles.length], radii[1], {
          center: radialPoint(a, radii[0]),
        }),
        radialPoint(angles[(i + 2) % angles.length], radii[1], {
          center: radialPoint(angles[(i + 3) % angles.length], radii[0]),
        }),
      ] as Line,
  ),
  ...angles.map(
    (a, i) =>
      [
        radialPoint(angles[(i + 1) % angles.length], radii[2], {
          center: radialPoint(angles[(i + 0) % angles.length], radii[0]),
        }),
        radialPoint(angles[(i + 2) % angles.length], radii[2], {
          center: radialPoint(angles[(i + 3) % angles.length], radii[0]),
        }),
      ] as Line,
  ),
  ...angles.map(
    (a, i) =>
      [
        radialPoint(angles[(i + 0) % angles.length], radii[2], {
          center: radialPoint(angles[(i + 0) % angles.length], radii[0]),
        }),
        radialPoint(angles[(i + 1) % angles.length], radii[2], {
          center: radialPoint(angles[(i + 0) % angles.length], radii[0]),
        }),
      ] as Line,
  ),
  ...angles.map(
    (a, i) =>
      [
        radialPoint(angles[(i + 0) % angles.length], radii[2], {
          center: radialPoint(angles[(i + 0) % angles.length], radii[0]),
        }),
        radialPoint(angles[(i + 5) % angles.length], radii[2], {
          center: radialPoint(angles[(i + 0) % angles.length], radii[0]),
        }),
      ] as Line,
  ),
];
