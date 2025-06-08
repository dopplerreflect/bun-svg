import Background from "$components/Background";
import { phylotaxis } from "@dopplerreflect/geometry";
import { oklch } from "chroma-js";

export default function Ptest({ width = 1080, height = 1080 }: Props) {
  const pp = phylotaxis(144, Math.hypot(width / 2, height / 2));
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
      colorInterpolationFilters='sRGB'
    >
      <Background
        {...{ width, height }}
        fill={oklch(0.3, 0, 0).hex()}
      />
      {pp.map((p, i) => (
        <g key={i}>
          <circle
            r={1}
            cx={p.x}
            cy={p.y}
            fill='white'
          />
          <text
            x={p.x}
            y={p.y}
            fill='white'
          >
            {i}
          </text>
        </g>
      ))}
    </svg>
  );
}
