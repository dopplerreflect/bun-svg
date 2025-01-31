import Background from "$components/Background";
import HexPattern from "$components/HexPattern";
import {
  anglesArray,
  goldenCircles,
  goldenRadii,
  radialPoint,
  radialPointString,
} from "@dopplerreflect/geometry";
import chroma, { oklch } from "chroma-js";

const scale = 1;

export default function Jan30({
  width = 1920 * scale,
  height = 1080 * scale,
}: Props) {
  const angles = anglesArray(10);
  const radii = goldenRadii((height / 2) * 0.48, 4);
  const circles = goldenCircles(radii, angles).sort((a, b) => b.r - a.r);
  const weavePath = [
    "M",
    radialPointString(angles[9], radii[2], {
      center: radialPoint(angles[1], radii[0]),
    }),
    `A ${radii[2]} ${radii[2]} 0 0 1`,
    radialPointString(angles[9], radii[3], {
      center: radialPoint(angles[2], radii[0]),
    }),
    `A ${radii[3]} ${radii[3]} 0 0 0`,
    radialPointString(angles[5], radii[3], {
      center: radialPoint(angles[2], radii[0]),
    }),
    `A ${radii[2]} ${radii[2]} 0 0 0`,
    radialPointString(angles[9], radii[2], {
      center: radialPoint(angles[3], radii[0]),
    }),
    `A ${radii[2]} ${radii[2]} 0 0 1`,
    radialPointString(angles[9], radii[2], {
      center: radialPoint(angles[2], radii[0]),
    }),
    `A ${radii[3]} ${radii[3]} 0 1 0`,
    radialPointString(angles[8], radii[3], {
      center: radialPoint(angles[1], radii[0]),
    }),
    `A ${radii[2]} ${radii[2]} 0 0 0`,
    radialPointString(angles[9], radii[2], {
      center: radialPoint(angles[1], radii[0]),
    }),
    "Z",
  ].join(" ");
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    >
      <defs>
        <filter id='glow'>
          <feGaussianBlur stdDeviation={5 * scale} />
          <feMerge>
            <feMergeNode />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
        <HexPattern
          id='hexpattern'
          radius={height / 55}
          fill='none'
          stroke={oklch(0.95, 0.37, 90).hex()}
          strokeWidth={8 * scale}
        />
        <HexPattern
          id='hexpattern2'
          radius={height / 55}
          fill='none'
          stroke={oklch(0.95, 0.37, 60).hex()}
          strokeWidth={3 * scale}
        />
      </defs>
      <Background
        {...{ width, height }}
        fill={oklch(0.25, 0.37, 60).hex()}
      />
      <Background
        {...{ width, height }}
        fill='url(#hexpattern)'
        filter='url(#glow)'
      />
      <Background
        {...{ width, height }}
        fill='url(#hexpattern2)'
        filter='url(#glow)'
      />
      <g
        id='filled'
        style={{ display: "inline" }}
        filter='url(#glow)'
      >
        {circles.slice().map((c, i) => (
          <circle
            key={i}
            r={c.r}
            cx={c.x}
            cy={c.y}
            fill={oklch(0.75, 0.37, 30 + (i % 11) * 32.72)
              .alpha(0.2)
              .hex()}
          />
        ))}
      </g>
      <g
        id='stroked'
        filter='url(#glow)'
      >
        {circles.map((c, i) => (
          <circle
            key={i}
            r={c.r}
            cx={c.x}
            cy={c.y}
            fill='none'
            stroke='white'
            strokeWidth={2 * scale}
          />
        ))}
      </g>
      <g
        id='weave'
        filter='url(#glow)'
      >
        {angles.map(
          (a, i) =>
            i % 2 === 0 && (
              <path
                key={i}
                d={weavePath}
                fill={chroma("white").alpha(0.5).hex()}
                stroke='white'
                strokeWidth={2 * scale}
                transform={`rotate(${a - 18})`}
              />
            ),
        )}
        {angles.map(
          (a, i) =>
            i % 2 === 1 && (
              <path
                key={i}
                d={weavePath}
                fill={chroma("black").alpha(0.5).hex()}
                stroke='white'
                strokeWidth={2 * scale}
                transform={`rotate(${a - 18})`}
              />
            ),
        )}
      </g>
    </svg>
  );
}
