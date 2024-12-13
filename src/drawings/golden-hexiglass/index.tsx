import Background from "$components/Background";
import { findLineIntersections } from "@dopplerreflect/geometry";
import { anglesArray, PHI, radialPoint } from "@dopplerreflect/geometry";
import type { Circle, Line } from "@dopplerreflect/geometry/src/types";
import { oklch } from "chroma-js";

type Props = {
  width?: number;
  height?: number;
};
export default function GoldenHexiglass({
  width = 1920,
  height = 1080,
}: Props) {
  const phi = PHI - 1;
  const size = height / 4.1;
  const radii = [...Array(3).keys()].map(i => size * phi ** i);
  const angles = anglesArray(6);
  const circles: Circle[] = [
    { r: size * PHI, x: 0, y: 0 },
    ...radii.map(r => ({ r, x: 0, y: 0 })),
    ...angles
      .map(a => radii.map(r => ({ r, ...radialPoint(a, radii[0]) })))
      .flat(),
  ];
  const h: Line[] = [
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
  const intersections = findLineIntersections(h);

  const styles = {
    cirlce: {
      // display: "none",
    },
  };
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    >
      <defs></defs>
      <Background
        {...{ width, height }}
        fill={oklch(0.1, 0.1, 270).hex()}
      />
      <g
        id='circles'
        style={styles.cirlce}
      >
        {circles.map((c, i) => (
          <circle
            key={i}
            r={c.r}
            cx={c.x}
            cy={c.y}
            stroke={oklch(0.75, 0.37, 270).hex()}
            fill='none'
          />
        ))}
      </g>
      {h.map((h, i) => (
        <line
          key={i}
          x1={h[0].x}
          y1={h[0].y}
          x2={h[1].x}
          y2={h[1].y}
          stroke={oklch(0.95, 0.37, 90).hex()}
        />
      ))}
      {intersections.map((c, i) => (
        <circle
          key={i}
          r={5}
          cx={c.x}
          cy={c.y}
          stroke='white'
          fill='none'
        />
      ))}
    </svg>
  );
}
