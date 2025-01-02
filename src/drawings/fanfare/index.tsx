import Background from "$components/Background";
import RadialGradient from "$components/gradients/RadialGradient";
import { Star } from "$components/Star";
import {
  anglesArray,
  calculateDistance,
  chordLength,
  chordMatrix,
  degreesToRadians,
  findNearest,
  goldenCircles,
  goldenRadii,
  phylotaxis,
  radialPoint,
  starPoints,
  type Circle,
} from "@dopplerreflect/geometry";
import { oklch } from "chroma-js";

const width = 1920;
const height = 1080;
const count = 10;
const radii = goldenRadii((height / 4) * 0.95, 4);
const angles = anglesArray(count);
const circles = goldenCircles(radii, angles);

const PhyloStarfield = ({
  width,
  height,
  density,
}: {
  width: number;
  height: number;
  density: number;
}) => {
  console.time("phylo");
  const phylo = phylotaxis(density, Math.hypot(width / 2, height / 2)).filter(
    p =>
      Math.hypot(p.x, p.y) > 1 &&
      Math.abs(p.x) < width / 2 + width * 0.06 &&
      Math.abs(p.y) < height / 2 + height * 0.06,
  );
  console.timeEnd("phylo");
  console.time("phyloCircles");
  const phyloCircles: Circle[] = [{ r: 1, ...phylo[0] }];
  phylo.forEach(p => {
    const nearest = findNearest(p, phyloCircles) as Circle;
    const distance = calculateDistance(p, nearest);
    phyloCircles.push({ r: distance - nearest.r, ...p });
  });
  console.timeEnd("phyloCircles");

  console.time("phyloStarfield");
  const phyloStarfield = phyloCircles.map((c, i) => (
    <polygon
      key={i}
      points={starPoints(c)}
    />
  ));
  console.timeEnd("phyloStarfield");

  return phyloStarfield;
};
export default function Fanfare() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    >
      <defs>
        <RadialGradient
          id='bg-gradient'
          cx={0}
          cy={0}
          gradientUnits='userSpaceOnUse'
          stops={[
            { offset: 0, stopColor: oklch(1, 0.37, 90).hex() },
            { offset: 10, stopColor: oklch(1, 0.37, 30).hex() },
            { offset: 20, stopColor: oklch(0.35, 0.37, 300).hex() },
            { offset: 100, stopColor: oklch(0.15, 0.27, 300).hex() },
          ]}
        />
        <filter id='glow'>
          <feMorphology
            operator={"dilate"}
            radius={1}
          />
          <feGaussianBlur stdDeviation={8} />
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
          <feColorMatrix
            type='saturate'
            values='1.5'
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
        <g id='phylo-starfield'>
          <PhyloStarfield
            {...{ width, height }}
            density={2 ** 11}
          />
        </g>
        <mask id='phylo-mask'>
          <use
            href='#phylo-starfield'
            fill='white'
          />
        </mask>
        <filter id='colors'>
          <feTurbulence
            seed={4}
            numOctaves={4}
            type='fractalNoise'
            baseFrequency={"0.005"}
          />
          <feColorMatrix
            values='1 0 0 0.0 0
                    0 1 0 0.0 0
                    0 0 1 0.0 0
                    1 1 1 1.0 0'
          />
          <feColorMatrix
            type='saturate'
            values='5'
          />
        </filter>
      </defs>
      <Background
        {...{ width, height }}
        fill='url(#bg-gradient)'
      />
      <Background
        {...{ width, height }}
        filter='url(#colors)'
        mask='url(#phylo-mask)'
      />
      <use
        href='#phylo-starfield'
        stroke='white'
        fill='none'
        filter='url(#glow)'
      />
      <g
        id='darken'
        style={{ fillOpacity: 0.75, fill: oklch(0.0, 0.37, 300).hex() }}
      >
        {angles.map((a, i) => {
          const c: Circle = { r: radii[0], ...radialPoint(a, radii[0]) };
          return (
            <circle
              key={i}
              r={c.r}
              cx={c.x}
              cy={c.y}
            />
          );
        })}
      </g>
      <Star
        radius={radii[0] * 2}
        geometryOptions={{ rotate: -90, center: { x: 0, y: 0 } }}
        fill={oklch(0.5, 0.37, 300).hex()}
        stroke='white'
        strokeWidth={5}
      />
      <g style={{ display: "inline" }}>
        <g filter='url(#glow)'>
          {radii.map((r, i) =>
            chordMatrix(angles, [r + radii[0]]).map((l, j) => (
              <line
                key={j}
                x1={l[0].x}
                y1={l[0].y}
                x2={l[1].x}
                y2={l[1].y}
                stroke={oklch(1, 0.37, (240 / radii.length) * i + 90).hex()}
              />
            )),
          )}
        </g>
        <g filter='url(#glow)'>
          {radii
            .map((r, i) => chordLength(degreesToRadians(180 - 360 / count), r))
            .map((r, j) =>
              chordMatrix(
                angles.map(a => a + 360 / (count * 2)),
                [r],
              ).map((l, k) => (
                <line
                  key={k}
                  x1={l[0].x}
                  y1={l[0].y}
                  x2={l[1].x}
                  y2={l[1].y}
                  stroke={oklch(0.7, 0.37, (120 / radii.length) * j - 60).hex()}
                />
              )),
            )}
        </g>
        <g filter='url(#glow)'>
          {circles.map((c, i) => (
            <circle
              key={i}
              r={c.r}
              cx={c.x}
              cy={c.y}
              stroke={oklch(1, 0.1, 300).hex()}
              strokeWidth={3}
              fill='none'
            />
          ))}
        </g>
        {circles.map((c, i) => (
          <circle
            key={i}
            r={c.r}
            cx={c.x}
            cy={c.y}
            stroke={oklch(1, 0.37, 300).hex()}
            strokeWidth={1}
            fill='none'
          />
        ))}
      </g>
    </svg>
  );
}
