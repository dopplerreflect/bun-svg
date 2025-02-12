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

  const hues = anglesArray(8, -60);

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
        <radialGradient id='rg'>
          {[...Array(10).keys()].reverse().map(i => (
            <stop
              key={i}
              offset={`${Math.round((1 - i / 10) * 100)}%`}
              stopColor='white'
              stopOpacity={Math.sin(i * 10 * (Math.PI / 180)).toFixed(1)}
            />
          ))}
        </radialGradient>
        <filter id='light'>
          <feSpecularLighting
            lightingColor='white'
            surfaceScale={10}
            specularConstant={3}
            specularExponent={4}
          >
            <fePointLight
              x={0}
              y={0}
              z={height / 8}
            />
          </feSpecularLighting>
          <feGaussianBlur stdDeviation={3} />
        </filter>
      </defs>
      <Background
        {...{ width, height }}
        fill={oklch(0.0, 0.0, 300).hex()}
      />
      <g filter='url(#light)'>
        {phylotaxicCircles.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={c.r - 3}
            fill='url(#rg)'
          />
        ))}
      </g>
      <g
        filter='url(#glow)'
        style={{ display: "inline" }}
      >
        {phylotaxicCircles.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={c.r - 3}
            stroke={oklch(0.5, 0.37, hues[c.i % hues.length] + 0).hex()}
            strokeWidth={1}
            fill={
              i % 1 === 0
                ? oklch(0.75, 0.37, hues[c.i % hues.length] + 0)
                    .alpha(0.25)
                    .hex()
                : "none"
            }
            // fill='none'
          />
        ))}
      </g>
    </svg>
  );
}
