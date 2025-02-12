import Background from "$components/Background";
import {
  anglesArray,
  goldenCircles,
  goldenRadii,
} from "@dopplerreflect/geometry";
import { oklch } from "chroma-js";

export default function Lighting({ width = 1920, height = 1080 }: Props) {
  const scale = 1;
  const angles = anglesArray(5);
  const radii = goldenRadii((height / 2) * 0.45, 3);
  const circles = goldenCircles(radii, angles);
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
      colorInterpolationFilters='sRGB'
    >
      <defs>
        <filter id='lighting'>
          <feDiffuseLighting
            lightingColor={oklch(0.5, 0.37, 270).hex()}
            surfaceScale={radii[2]}
            diffuseConstant={4}
            result='light'
          >
            <fePointLight
              x={0}
              y={0}
              z={radii[2]}
            />
          </feDiffuseLighting>
        </filter>
        <filter id='glow'>
          <feGaussianBlur stdDeviation={3} />
          <feMerge>
            <feMergeNode />
            <feMergeNode />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>
      <Background
        {...{ width, height }}
        fill='black'
      />
      <g
        id='gcircles'
        filter='url(#lighting)'
      >
        <Background
          {...{ width, height }}
          fill='none'
        />
        {circles.map((c, i) => (
          <circle
            key={i}
            r={c.r}
            cx={c.x}
            cy={c.y}
            fill={oklch(0.5, 0.37, 270).hex()}
            fillOpacity={0.5}
          />
        ))}
      </g>
      <g
        id='test'
        filter='url(#glow)'
      >
        {circles.map((c, i) => (
          <circle
            key={i}
            r={c.r}
            cx={c.x}
            cy={c.y}
            fill='none'
            stroke={oklch(0.25, 0.37, 300).hex()}
          />
        ))}
      </g>
    </svg>
  );
}
