import Background from "$components/Background";
import {
  anglesArray,
  arrayMap,
  phi,
  radialPoint,
  polygonFromIntersectionOfLines,
} from "@dopplerreflect/geometry";
import type { Line } from "@dopplerreflect/geometry";
import { oklch } from "chroma-js";
import DrLogo from "./dr-logo";

// women's short sleeve vneck: 4600 x 5600 200dpi

const panel: "desktop" | "front" | "sleeve" | "back" = "desktop";

export default function Raytest({
  width = panel === "desktop" ? 1900 : 4600,
  height = panel === "desktop" ? 1080 : 5600,
}: Props) {
  const scale = 1; // smaller for faster rendering

  const r = (width / 2) * 0.5 * scale;
  const yOffset = -height * 0.033;
  const angles = anglesArray(20);

  const lineArray: Line[] = [
    ...angles.map(
      a =>
        [
          radialPoint(a, r, { center: { x: 0, y: yOffset } }),
          { x: 0, y: -r * phi ** 2 + yOffset },
        ] as Line,
    ),
    ...angles.map(
      a =>
        [
          radialPoint(a, r, { center: { x: 0, y: yOffset } }),
          { x: 0, y: r * phi ** 2 + yOffset },
        ] as Line,
    ),
    [
      { x: 0, y: -r * phi ** 2 + yOffset },
      { x: 0, y: r * phi ** 2 + yOffset },
    ],
  ];

  const polygonGroups: string[][] = [
    [
      polygonFromIntersectionOfLines([11, 31, 33, 11], lineArray),
      polygonFromIntersectionOfLines([9, 29, 27, 9], lineArray),
    ],
    [
      polygonFromIntersectionOfLines([12, 32, 11, 34, 12], lineArray),
      polygonFromIntersectionOfLines([11, 32, 34, 11], lineArray),
      polygonFromIntersectionOfLines([9, 28, 26, 9], lineArray),
      polygonFromIntersectionOfLines([8, 28, 9, 26, 8], lineArray),
    ],
    [
      polygonFromIntersectionOfLines([13, 33, 12, 35, 13], lineArray),
      polygonFromIntersectionOfLines([12, 33, 11, 35, 12], lineArray),
      polygonFromIntersectionOfLines([11, 33, 35, 11], lineArray),
      polygonFromIntersectionOfLines([9, 27, 25, 9], lineArray),
      polygonFromIntersectionOfLines([8, 27, 9, 25, 8], lineArray),
      polygonFromIntersectionOfLines([7, 27, 8, 25, 7], lineArray),
    ],
    [
      polygonFromIntersectionOfLines([14, 34, 13, 36, 14], lineArray),
      polygonFromIntersectionOfLines([13, 34, 12, 36, 13], lineArray),
      polygonFromIntersectionOfLines([12, 34, 11, 36, 12], lineArray),
      polygonFromIntersectionOfLines([11, 34, 36, 11], lineArray),
      polygonFromIntersectionOfLines([9, 26, 24, 9], lineArray),
      polygonFromIntersectionOfLines([8, 26, 9, 24, 8], lineArray),
      polygonFromIntersectionOfLines([7, 26, 8, 24, 7], lineArray),
      polygonFromIntersectionOfLines([6, 26, 7, 24, 6], lineArray),
    ],
    [
      ...arrayMap(4, n => n).map(i =>
        polygonFromIntersectionOfLines([15 - i, 35, 14 - i, 15 - i], lineArray),
      ),
      polygonFromIntersectionOfLines([11, 35, 37, 11], lineArray),
      polygonFromIntersectionOfLines([9, 25, 23, 9], lineArray),
      ...arrayMap(4, n => n).map(i =>
        polygonFromIntersectionOfLines([8 - i, 25, 9 - i, 8 - i], lineArray),
      ),
    ],
    [
      ...arrayMap(5, n => n).map(i =>
        polygonFromIntersectionOfLines([16 - i, 36, 15 - i, 16 - i], lineArray),
      ),
      polygonFromIntersectionOfLines([11, 36, 38, 11], lineArray),
      polygonFromIntersectionOfLines([9, 24, 22, 9], lineArray),
      ...arrayMap(5, n => n).map(i =>
        polygonFromIntersectionOfLines([8 - i, 24, 9 - i, 8 - i], lineArray),
      ),
    ],
    [
      ...arrayMap(6, n => n).map(i =>
        polygonFromIntersectionOfLines([17 - i, 37, 16 - i, 17 - i], lineArray),
      ),
      polygonFromIntersectionOfLines([11, 37, 39, 11], lineArray),
      polygonFromIntersectionOfLines([9, 23, 21, 9], lineArray),
      ...arrayMap(6, n => n).map(i =>
        polygonFromIntersectionOfLines([8 - i, 23, 9 - i, 8 - i], lineArray),
      ),
    ],
    [
      ...arrayMap(8, n => n).map(i =>
        polygonFromIntersectionOfLines([18 - i, 38, 17 - i, 18 - i], lineArray),
      ),
      ...arrayMap(8, n => n).map(i =>
        polygonFromIntersectionOfLines([9 - i, 22, 10 - i, 18 - i], lineArray),
      ),
    ],
    [
      ...arrayMap(9, n => n).map(i =>
        polygonFromIntersectionOfLines([19 - i, 39, 18 - i, 19 - i], lineArray),
      ),
      ...arrayMap(9, n => n).map(i =>
        polygonFromIntersectionOfLines([9 - i, 21, 10 - i, 19 - i], lineArray),
      ),
    ],
  ];

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${(-width / 2) * scale} ${(-height / 2) * scale} ${width * scale} ${height * scale}`}
      colorInterpolationFilters='sRGB'
    >
      <defs>
        <linearGradient
          id='RAYTEST-lg'
          gradientTransform='rotate(90)'
        >
          <stop
            offset='0%'
            stopColor={oklch(0.95, 0.12, 90).hex()}
          />
          <stop
            offset='100%'
            stopColor={oklch(0.25, 0.12, 90).hex()}
          />
        </linearGradient>
        <filter id='RAYTEST-filter'>
          <feFlood floodColor={oklch(0.05, 0.185, 90).hex()} />
          <feComposite
            in2='SourceGraphic'
            operator='in'
          />
          <feGaussianBlur stdDeviation={5 * scale} />
          <feOffset dy={10 * scale} />
          <feMerge>
            <feMergeNode />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
        <filter id='RAYTEST-shrink'>
          <feMorphology
            in='SourceAlpha'
            operator='erode'
            radius={3 * scale}
            result='smallErode'
          />
          <feFlood
            floodColor={oklch(0.9, 0.32, 60).hex()}
            result='color'
          />
          <feComposite
            operator='in'
            in2='smallErode'
            result='border'
          />
          <feMorphology
            in='SourceGraphic'
            operator='erode'
            radius={5 * scale}
            result='bigErode'
          />
          <feMerge>
            <feMergeNode in='border' />
            <feMergeNode in='bigErode' />
          </feMerge>
        </filter>
        <filter id='RAYTEST-noise'>
          <feTurbulence
            type='fractalNoise'
            baseFrequency={(0.3 / scale) * (panel === "desktop" ? 1 : 0.25)}
          />
          <feColorMatrix
            type='matrix'
            values='1 0 0 0 0
                    0.5 0 0 0 0
                    0.0 0 0 0 0
                    0 0 0 1 0'
          />
        </filter>
        <filter id='crackedMud'>
          <feTurbulence
            type='fractalNoise'
            baseFrequency={(0.075 / scale) * (panel === "desktop" ? 1 : 0.25)}
            numOctaves='1'
            result='turb'
          />
          <feDisplacementMap
            in='SourceGraphic'
            in2='turb'
            scale={width * 2 * scale * (panel === "desktop" ? 1 : 2)}
            xChannelSelector='R'
            yChannelSelector='G'
            result='displacement'
          />
          <feConvolveMatrix
            kernelMatrix='0 1 0 1 -5 0 1 0 1'
            result='edges'
          />
          <feDiffuseLighting
            lightingColor={oklch(0.8, 0.02, 90).hex()}
            result='light'
          >
            <feDistantLight
              azimuth={90}
              elevation={height * scale}
            />
          </feDiffuseLighting>
          <feComposite
            in='edges'
            in2='lighting'
            operator={"arithmetic"}
            k1={2}
            k2={0.25}
            k3={0.25}
            k4={0.0}
          />
          <feColorMatrix
            type='matrix'
            values='
              1 0 0 0 0
              0 0.75 0 0 0
              0 0 0 0 0
              0 0 0 0.35 0'
          />
        </filter>
      </defs>
      <Background
        width={width * scale}
        height={height * scale}
        fill='url(#RAYTEST-lg)'
      />
      <Background
        width={width * scale}
        height={height * scale}
        filter='url(#RAYTEST-noise)'
      />
      <Background
        width={width * scale}
        height={height * scale}
        fill={oklch(0.75, 0.32, 90).hex()}
        filter='url(#crackedMud)'
      />
      {panel === "front" ||
        (panel === "desktop" && (
          <circle
            r={r}
            cx={0}
            cy={yOffset}
            filter='url(#RAYTEST-filter)'
            style={{
              fill: oklch(0.5, 0.24, 90).alpha(0.33).hex(),
              stroke: oklch(0.25, 0.12, 60).alpha(1).hex(),
              strokeWidth: 8 * scale,
            }}
          />
        ))}
      {panel === "front" ||
        (panel === "desktop" &&
          polygonGroups.map((group, gi) => (
            <g
              key={gi}
              style={{
                fill: oklch(
                  1 - (1 / (polygonGroups.length + 0)) * gi,
                  0.12,
                  60,
                ).hex(),
                filter: "url(#RAYTEST-filter)",
              }}
            >
              {group.map((points, i) => (
                <polygon
                  key={i}
                  points={points}
                  filter='url(#RAYTEST-shrink)'
                />
              ))}
            </g>
          )))}
      {panel === "back" && (
        <g
          transform={`scale(0.25) translate(${(-width / 2) * scale} ${-height * 1.75 * scale})`}
        >
          <DrLogo />
        </g>
      )}
    </svg>
  );
}
