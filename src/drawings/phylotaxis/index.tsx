import Background from "$components/Background";
import {
  phylotaxis,
  findNearest,
  calculateDistance,
} from "@dopplerreflect/geometry";
import type { Circle } from "@dopplerreflect/geometry/src/types";
import { oklch } from "chroma-js";

type Props = {
  width?: number;
  height?: number;
};
export default function Phylotaxis({ width = 1920, height = 1080 }: Props) {
  const count = 2 ** 12;
  const phylotaxicRadius = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2);
  const phylotaxicPoints = phylotaxis(count, phylotaxicRadius);

  const phylotaxicCircles: Circle[] = [{ r: 1, ...phylotaxicPoints[0] }];

  phylotaxicPoints.forEach((p, i) => {
    if (
      Math.abs(p.x) < width / 2 + width * 0.06 &&
      Math.abs(p.y) < height / 2 + height * 0.06
    ) {
      const nearestCircle = findNearest(p, phylotaxicCircles) as Circle;
      const distance = calculateDistance(p, nearestCircle);
      phylotaxicCircles.push({ r: distance - nearestCircle.r, ...p });
    }
  });

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    >
      <Background
        {...{ width, height }}
        fill={oklch(0.3, 0.37, 90).hex()}
      />
      {phylotaxicCircles.map((c, i) => (
        <circle
          key={i}
          r={c.r}
          cx={c.x}
          cy={c.y}
          fill={oklch(0.75, 0.37, 0 + (360 / count) * i).hex()}
          stroke='black'
        />
      ))}
    </svg>
  );
}
