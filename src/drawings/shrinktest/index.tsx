import Background from "$components/Background";
import { phylotaxis, polygon } from "@dopplerreflect/geometry";
import { oklch } from "chroma-js";

type Point = { x: number; y: number };
type Polygon = Point[];

function shrinkPolygon(polygon: Polygon, percentage: number): Polygon {
  // Calculate the centroid of the polygon
  const centroid: Point = polygon.reduce(
    (acc, point) => {
      acc.x += point.x;
      acc.y += point.y;
      return acc;
    },
    { x: 0, y: 0 },
  );

  centroid.x /= polygon.length;
  centroid.y /= polygon.length;

  // Shrink each point toward the centroid
  const shrinkFactor = 1 - percentage / 100;

  return polygon.map(point => ({
    x: centroid.x + (point.x - centroid.x) * shrinkFactor,
    y: centroid.y + (point.y - centroid.y) * shrinkFactor,
  }));
}

const pointsToString = (points: Point[]): string =>
  points.map(p => `${p.x} ${p.y}`).join(" ");

type Props = {
  width?: number;
  height?: number;
};
export default function ShrinkTest({ width = 1920, height = 1080 }: Props) {
  const phyloPoints = phylotaxis(
    2 ** 9,
    Math.hypot(width / 2, height / 2) * 1.2,
  );

  const phyloPoints2 = phylotaxis(2 ** 9, 100);

  const polygons = phyloPoints
    .slice(0, phyloPoints.length - 34)
    .map(
      (p, i) =>
        [
          p,
          phyloPoints[i + 13],
          phyloPoints[i + 34],
          phyloPoints[i + 21],
        ] as Polygon,
    )
    .map(p => shrinkPolygon(p, 15));

  const polygons2 = polygons.map(p => shrinkPolygon(p, 61.8));

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
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
        <filter id='shadow'>
          <feDropShadow
            dy='5'
            stdDeviation={3}
          />
        </filter>
      </defs>
      <Background
        {...{ width, height }}
        fill={oklch(0.75, 0.37, 240).hex()}
      />
      <g filter='url(#shadow)'>
        {polygons.map((p, i) => (
          <polygon
            key={i}
            points={pointsToString(p)}
            stroke={oklch(0.5, 0.37, 300).hex()}
            strokeWidth={3}
            fill={oklch(0.85, 0.37, 150 - (150 / polygons.length) * i).hex()}
          />
        ))}
      </g>
      <g filter='url(#shadow)'>
        {polygons2.map((p, i) => (
          <polygon
            key={i}
            points={pointsToString(p)}
            stroke='black'
            strokeWidth={3}
            fill={oklch(0.99, 0.37, 270 - (150 / polygons.length) * i).hex()}
          />
        ))}
      </g>
      <g filter='url(#shadow)'>
        {phyloPoints2.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={5}
            fill={oklch(
              0.85,
              0.37,
              150 - (150 / phyloPoints2.length) * i,
            ).hex()}
          />
        ))}
      </g>
    </svg>
  );
}
