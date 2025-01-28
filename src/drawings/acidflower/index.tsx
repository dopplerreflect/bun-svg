import Background from "$components/Background";
import {
  phylotaxis,
  findNearest,
  calculateDistance,
  anglesArray,
  type Circle,
} from "@dopplerreflect/geometry";
import { oklch } from "chroma-js";
type Props = {
  width?: number;
  height?: number;
};
export default function AcidFlower({ width = 1920, height = 1080 }: Props) {
  const count = 2 ** 10;
  const phylotaxicRadius = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2);
  const phylotaxicPoints = phylotaxis(count, phylotaxicRadius);

  type IndexedCircle = { i: number } & Circle;
  const phylotaxicCircles: IndexedCircle[] = [
    {
      i: 0,
      r: 1,
      ...phylotaxicPoints[0],
    },
  ];

  phylotaxicPoints.forEach((p, i) => {
    const nearestCircle = findNearest(p, phylotaxicCircles) as Circle;
    const distance = calculateDistance(p, nearestCircle);
    phylotaxicCircles.push({ i, r: distance - nearestCircle.r, ...p });
  });

  function edgeFilter(c: Circle) {
    return (
      Math.sqrt(c.x ** 2 + c.y ** 2) > 1 &&
      Math.abs(c.x) < width / 2 + width * 0.08 &&
      Math.abs(c.y) < height / 2 + height * 0.08
    );
  }

  const hues = anglesArray(34, -60);

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    >
      <defs>
        <filter id='glow'>
          <feGaussianBlur stdDeviation={5} />
          <feMerge>
            <feMergeNode />
            <feMergeNode />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>
      <Background
        {...{ width, height }}
        fill={oklch(0.01, 0.37, 300).hex()}
      />
      <g filter='url(#glow)'>
        {phylotaxicCircles.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={c.r - 3}
            stroke={oklch(0.9, 0.37, hues[c.i % hues.length] + i).hex()}
            strokeWidth={2}
            fill={
              i % 3 === 0
                ? oklch(0.33, 0.37, hues[c.i % hues.length] + 270 + i).hex()
                : "none"
            }
          />
        ))}
      </g>
    </svg>
  );
}
