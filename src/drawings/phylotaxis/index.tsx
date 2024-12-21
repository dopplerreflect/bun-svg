import {
  type Circle,
  phylotaxis,
  findNearest,
  calculateDistance,
  chordMatrix,
  anglesArray,
  phi,
  radialPoint,
  PHI,
} from "@dopplerreflect/geometry";
import Background from "$components/Background";
import { oklch } from "chroma-js";

export default function GoldenCrystalPhyllotaxic({
  width = 1920,
  height = 1080,
}) {
  const count = 2 ** 13;
  const phylotaxicRadius = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2);
  const phylotaxicPoints = phylotaxis(count, phylotaxicRadius).filter(
    p =>
      Math.sqrt(p.x ** 2 + p.y ** 2) > 1 &&
      Math.abs(p.x) < width / 2 + width * 0.08 &&
      Math.abs(p.y) < height / 2 + height * 0.08,
  );

  const phylotaxicCircles: Circle[] = [{ r: 1, ...phylotaxicPoints[0] }];

  phylotaxicPoints.forEach((p, i) => {
    const nearestCircle = findNearest(p, phylotaxicCircles) as Circle;
    const distance = calculateDistance(p, nearestCircle);
    phylotaxicCircles.push({ r: distance - nearestCircle.r, ...p });
  });

  const angles = anglesArray(10);
  const radii = [...Array(3).keys()].map(i => (height / 2) * 0.35 * phi ** i);

  const circles: Circle[] = [
    ...radii.map(r => ({ r, ...{ x: 0, y: 0 } })),
    ...angles.map(a => radii.map(r => ({ r, ...radialPoint(a, radii[0]) }))),
  ].flat();

  const lines = chordMatrix(
    angles,
    radii.slice(0, 3).map(r => r * PHI ** 2),
  );

  const hueStart = 180;

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
          <feGaussianBlur stdDeviation={"5 3"} />
          <feMerge>
            <feMergeNode />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
        <filter id='glow'>
          <feGaussianBlur stdDeviation={5} />
          <feComponentTransfer>
            <feFuncR
              type='linear'
              slope={1.5}
              intercept={0.2}
            />
            <feFuncG
              type='linear'
              slope={1.5}
              intercept={0.2}
            />
            <feFuncB
              type='linear'
              slope={1.5}
              intercept={0.2}
            />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>
      <Background
        {...{ width, height }}
        fill={oklch(0.0, 0.37, 300).hex()}
      />
      <g>
        <g
          id='phylo-circles'
          filter='url(#blur)'
          opacity={0.33}
        >
          {phylotaxicCircles.map((c, i) => (
            <circle
              key={i}
              r={c.r}
              cx={c.x}
              cy={c.y}
              fill={oklch(0.25, 0.37, hueStart + (360 / count) * i).hex()}
              stroke={oklch(0.99, 0.37, hueStart + (360 / count) * i).hex()}
            />
          ))}
        </g>
        <g
          id='phylo-dots'
          filter='url(#blur2)'
        >
          {phylotaxicCircles.map((p, i) => (
            <circle
              key={i}
              r={p.r / 8}
              cx={p.x}
              cy={p.y}
              fill={oklch(1, 0.27, hueStart + (360 / count) * i).hex()}
              transform={`translate(0 -${p.r * phi})`}
            />
          ))}
        </g>
      </g>
      <g filter='url(#glow)'>
        {circles.map((c, i) => (
          <circle
            key={i}
            r={c.r}
            cx={c.x}
            cy={c.y}
            fill='none'
            stroke={oklch(1, 0.37, 70).hex()}
            strokeWidth={2}
          />
        ))}
      </g>
      <g filter='url(#glow)'>
        {lines.map((l, i) => (
          <line
            key={i}
            x1={l[0].x}
            y1={l[0].y}
            x2={l[1].x}
            y2={l[1].y}
            stroke={oklch(0.99, 0.37, 270).hex()}
            strokeWidth={2}
          />
        ))}
      </g>
    </svg>
  );
}
