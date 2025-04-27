import Background from "$components/Background";
import HexPattern from "$components/HexPattern";
import {
  phylotaxis,
  shrinkPolygon,
  polygonPointString,
} from "@dopplerreflect/geometry";
import DrLogo from "$drawings/dr-logo/simple";
import { oklch } from "chroma-js";

const scale = 1;

export default function ShrinkTest({
  width = 1920 * scale,
  height = 1080 * scale,
}: Props) {
  const phyloPoints = phylotaxis(
    2 ** 9,
    Math.hypot(width / 2, height / 2) * 1.2,
  );

  const polygons = phyloPoints
    .slice(0, phyloPoints.length - 34)
    .map((p, i) => [
      p,
      phyloPoints[i + 13],
      phyloPoints[i + 34],
      phyloPoints[i + 21],
    ])
    .map(p => shrinkPolygon(p, 25));

  const polygons2 = polygons.map(p => shrinkPolygon(p, 61.8));

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
      colorInterpolationFilters='sRGB'
    >
      <defs>
        <filter id='glow'>
          <feGaussianBlur stdDeviation={3 * scale} />
          <feMerge>
            <feMergeNode />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
        <filter id='shadow'>
          <feDropShadow
            dy={5 * scale}
            stdDeviation={3 * scale}
          />
        </filter>
        <HexPattern
          id='hexpattern'
          radius={8 * scale}
          fill='none'
          stroke={oklch(0.75, 0.37, 300).hex()}
          strokeWidth={1 * scale}
        />
      </defs>
      <Background
        {...{ width, height }}
        fill={oklch(0.05, 0.17, 300).hex()}
      />
      <Background
        {...{ width, height }}
        fill='url(#hexpattern)'
        filter='url(#glow)'
      />
      <g filter='url(#shadow)'>
        {polygons.map((p, i) => (
          <polygon
            key={i}
            points={polygonPointString(p)}
            strokeWidth={3 * scale}
            stroke={oklch(0.5, 0.37, 150 - (360 / polygons.length) * i).hex()}
            fill={oklch(1, 0.37, 150 - (360 / polygons.length) * i).hex()}
          />
        ))}
      </g>
      <g filter='url(#shadow)'>
        {polygons2.map((p, i) => (
          <polygon
            key={i}
            points={polygonPointString(p)}
            strokeWidth={3 * scale}
            stroke={oklch(
              1 - (1 / 21) * (i % 21),
              0.37,
              (360 / 13) * (i % 13),
            ).hex()}
            fill={oklch((1 / 21) * (i % 21), 0.37, (360 / 13) * (i % 13)).hex()}
          />
        ))}
      </g>
      <circle
        filter='url(#shadow)'
        r={(height / 2) * 0.618 ** 3}
        fill='white'
        fillOpacity={0.66}
        stroke='black'
        strokeWidth={3 * scale}
      />
      <g
        filter='url(#shadow)'
        transform={`translate(${-width / 8} ${-height / 8}) scale(0.25)`}
      >
        <DrLogo />
      </g>
    </svg>
  );
}
