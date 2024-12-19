import {
  type Circle,
  phylotaxis,
  findNearest,
  calculateDistance,
} from "@dopplerreflect/geometry";
import Background from "$components/Background";
import { oklch } from "chroma-js";

export default function Phylotaxis({ width = 1920, height = 1080 }) {
  const count = 2 ** 12;
  const phylotaxicRadius = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2);
  const phylotaxicPoints = phylotaxis(count, phylotaxicRadius).filter(
    p => Math.sqrt(p.x ** 2 + p.y ** 2) > 1,
  );

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
      width={width}
      height={height}
    >
      <defs>
        <filter id='blur'>
          <feMorphology
            radius={1}
            operator={"dilate"}
          />
          <feGaussianBlur stdDeviation={2} />
          <feMerge>
            <feMergeNode />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
        <filter id='blur2'>
          <feMorphology
            radius={3}
            operator={"dilate"}
          />
          <feGaussianBlur stdDeviation={3} />
          <feMerge>
            <feMergeNode />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>
      <Background
        {...{ width, height }}
        fill={oklch(0.0, 0.37, 300).hex()}
      />
      <g filter='url(#blur)'>
        {phylotaxicCircles.map((c, i) => (
          <circle
            key={i}
            r={c.r}
            cx={c.x}
            cy={c.y}
            fill={oklch(0.15, 0.37, (360 / count) * i).hex()}
            stroke={oklch(0.99, 0.37, (360 / count) * i).hex()}
          />
        ))}
      </g>
      <g filter='url(#blur2)'>
        {phylotaxicPoints.map((p, i) => (
          <circle
            key={i}
            r={1.5}
            cx={p.x}
            cy={p.y}
            // fill='white'
            fill={oklch(1, 0.12, (360 / count) * i).hex()}
          />
        ))}
      </g>
    </svg>
  );
}
