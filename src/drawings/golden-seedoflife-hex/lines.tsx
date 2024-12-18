import type { Line } from "@dopplerreflect/geometry/src/types";
import { radialPoint, PHI } from "@dopplerreflect/geometry";

type Props = {
  lines: Line[];
};
export default function Lines(props: Props & React.SVGProps<SVGGElement>) {
  const { lines, ...rest } = props;
  return (
    <g {...rest}>
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
