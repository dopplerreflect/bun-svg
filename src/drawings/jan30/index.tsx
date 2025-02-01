import Background from "$components/Background";
import RadialGradient from "$components/gradients/RadialGradient";
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
  const weavePath = [0, 72, 144, 216, 288]
    .map(a =>
      [
        "M",
        radialPointString(angles[9] + a, radii[2], {
          center: radialPoint(angles[1] + a, radii[0]),
        }),
        `A ${radii[2]} ${radii[2]} 0 0 1`,
        radialPointString(angles[9] + a, radii[3], {
          center: radialPoint(angles[2] + a, radii[0]),
        }),
        `A ${radii[3]} ${radii[3]} 0 0 0`,
        radialPointString(angles[5] + a, radii[3], {
          center: radialPoint(angles[2] + a, radii[0]),
        }),
        `A ${radii[2]} ${radii[2]} 0 0 0`,
        radialPointString(angles[9] + a, radii[2], {
          center: radialPoint(angles[3] + a, radii[0]),
        }),
        `A ${radii[2]} ${radii[2]} 0 0 1`,
        radialPointString(angles[9] + a, radii[2], {
          center: radialPoint(angles[2] + a, radii[0]),
        }),
        `A ${radii[3]} ${radii[3]} 0 1 0`,
        radialPointString(angles[8] + a, radii[3], {
          center: radialPoint(angles[1] + a, radii[0]),
        }),
        `A ${radii[2]} ${radii[2]} 0 0 0`,
        radialPointString(angles[9] + a, radii[2], {
          center: radialPoint(angles[1] + a, radii[0]),
        }),
        "Z",
      ].join(" "),
    )
    .join(" ");

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    >
      <defs>
        <filter id='glow'>
          <feDropShadow
            stdDeviation={5}
            dy={15}
            result='shadow'
          />
          <feGaussianBlur stdDeviation={6 * scale} />
          <feMerge>
            <feMergeNode in='shadow' />
            <feMergeNode />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
        <RadialGradient
          id='gradient1'
          stops={[
            { offset: 61, stopColor: chroma("black").alpha(0.25).hex() },
            { offset: 100, stopColor: chroma("white").alpha(0.25).hex() },
          ]}
        />
        <RadialGradient
          id='gradient2'
          stops={[
            { offset: 61, stopColor: chroma("white").alpha(0.25).hex() },
            { offset: 100, stopColor: chroma("black").alpha(0.25).hex() },
          ]}
        />
        <HexPattern
          id='hexpattern'
          radius={height / 55}
          fill='none'
          stroke={oklch(1, 0.37, 60).hex()}
          strokeWidth={8 * scale}
        />
        <HexPattern
          id='hexpattern2'
          radius={height / 55}
          fill='none'
          stroke={oklch(0.75, 0.37, 90).hex()}
          strokeWidth={3 * scale}
        />
        <filter id='lighting'>
          <feSpecularLighting
            specularExponent={9}
            specularConstant={2.0}
            lightingColor={oklch(1, 0.37, 60).hex()}
            surfaceScale={1}
            result='light'
          >
            <fePointLight
              x={0}
              y={0}
              z={height / 8}
            />
          </feSpecularLighting>
          <feComposite
            in='SourceGraphic'
            operator='arithmetic'
            k1={1}
            k2={0}
            k3={1}
            k4={0}
          />
        </filter>
      </defs>
      <Background
        {...{ width, height }}
        fill={oklch(0.85, 0.37, 90).hex()}
      />
      <Background
        {...{ width, height }}
        fill='url(#hexpattern)'
        filter='url(#lighting)'
      />
      <Background
        {...{ width, height }}
        fill='url(#hexpattern2)'
        filter='url(#lighting)'
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
            strokeWidth={c.r * 0.025 * scale}
          />
        ))}
      </g>
      <g
        id='weave'
        filter='url(#glow)'
      >
        <path
          d={weavePath}
          stroke='white'
          strokeWidth={3 * scale}
          fill='url(#gradient1)'
        />
        <path
          d={weavePath}
          stroke='white'
          strokeWidth={3 * scale}
          fill='url(#gradient2)'
          transform='rotate(36)'
        />
      </g>
    </svg>
  );
}
