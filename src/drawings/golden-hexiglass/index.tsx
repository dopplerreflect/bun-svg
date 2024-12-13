import Background from "$components/Background";
import { findLineIntersections } from "@dopplerreflect/geometry";
import { anglesArray, PHI } from "@dopplerreflect/geometry";
import { oklch } from "chroma-js";
import Circles, { circleArray } from "./circles";
import Lines, { lineArray } from "./lines";

type Props = {
  width?: number;
  height?: number;
};
export default function GoldenHexiglass({
  width = 1920,
  height = 1080,
}: Props) {
  const phi = PHI - 1;
  const size = height / 4.5;
  const radii = [...Array(3).keys()].map(i => size * phi ** i);
  const angles = anglesArray(6);

  const circles = circleArray(angles, radii);

  const lines = lineArray(angles, radii);

  const intersections = findLineIntersections(lines).sort((a, b) => a.y - b.y);

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    >
      <Background
        {...{ width, height }}
        fill={oklch(0.1, 0.1, 270).hex()}
      />
      <Circles {...{ circles }} />
      <Lines {...{ lines }} />
      <g id='intersections'>
        {intersections.map((c, i) => (
          <circle
            key={i}
            r={10}
            cx={c.x}
            cy={c.y}
            stroke='white'
            fill='none'
          />
        ))}
      </g>
    </svg>
  );
}
