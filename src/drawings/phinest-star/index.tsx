import products from "@dopplerreflect/printify-templates/products.json";
import PrinifyTemplate from "@dopplerreflect/printify-templates";
import Background from "$components/Background";
import { oklch } from "chroma-js";
import {
  anglesArray,
  arrayMap,
  midpoint,
  phi,
  pointToString,
  polygonFromIntersectionOfLines,
  radialPoint,
  type Line,
} from "@dopplerreflect/geometry";

const templates = products.mensSportsJerseyAOP.templates;

const originalWidth = templates.front.width;
const originalHeight = templates.front.height;

const radius = (originalWidth / 2) * 0.43;

const radii = arrayMap(7, n => radius * phi ** n);
const angles = anglesArray(30);

const Circles = () => (
  <g id='circles'>
    {radii.map((r, i) => (
      <circle
        key={i}
        r={r}
        fill={oklch(0.9, 0.37, 30 + (90 / radii.length) * i).hex()}
        stroke={"white"}
        fillOpacity={0.25}
      />
    ))}
  </g>
);

const linesForAStar = (startRadiusIdx: number, startAngleIdx: number): Line[] =>
  [...Array(5).keys()]
    .map(i => [
      [
        radialPoint(
          angles[(startAngleIdx + 6 * i) % angles.length],
          radii[startRadiusIdx],
        ),
        radialPoint(
          angles[(startAngleIdx + 6 * i + 3) % angles.length],
          radii[startRadiusIdx + 2],
        ),
      ] as Line,
      [
        radialPoint(
          angles[(startAngleIdx + 6 * i + 3) % angles.length],
          radii[startRadiusIdx + 2],
        ),
        radialPoint(
          angles[(startAngleIdx + 6 * i + 6) % angles.length],
          radii[startRadiusIdx],
        ),
      ] as Line,
    ])
    .flat();

const starStartingPoints: [startRadiusIdx: number, startAngleIdx: number][] = [
  [0, 0],
  [1, 1],
  [1, 5],
  [2, 2],
  [2, 4],
  [3, 3],
];

const starLineGroups: Line[][] = starStartingPoints.map(a => {
  const [startRadius, startAngle] = a;
  return linesForAStar(startRadius, startAngle);
});

const starPolygons = starLineGroups.map(a =>
  a.map(l => pointToString(l[0])).join(" "),
);

const allLines = starLineGroups.flat();

const polygonGroups = [
  [
    polygonFromIntersectionOfLines([0, 19, 28, 9, 0], allLines),
    polygonFromIntersectionOfLines([0, 1, 29, 10, 0], allLines),
  ],
  [
    polygonFromIntersectionOfLines([27, 47, 18, 27], allLines),
    polygonFromIntersectionOfLines([27, 28, 19, 48, 27], allLines),
    polygonFromIntersectionOfLines([19, 10, 39, 28, 19], allLines),
    polygonFromIntersectionOfLines([10, 29, 30, 10], allLines),
  ],
  [
    polygonFromIntersectionOfLines([27, 18, 47, 38, 27], allLines),
    polygonFromIntersectionOfLines([47, 48, 19, 18, 47], allLines),
    polygonFromIntersectionOfLines([19, 28, 39, 48, 19], allLines),
    polygonFromIntersectionOfLines([39, 30, 29, 28, 39], allLines),
  ],
  [
    polygonFromIntersectionOfLines([47, 18, 19, 48, 39, 38, 47], allLines),
    polygonFromIntersectionOfLines([39, 28, 29, 30, 49, 48, 39], allLines),
  ],
  [polygonFromIntersectionOfLines([38, 39, 48, 49, 59, 58, 38], allLines)],
];

export default function PhinestStarFront() {
  const { width, height, file } = templates.front;
  const vb = {
    x: -width / 2,
    y: -height / 2 + height * 0.1,
    width,
    height,
  };

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${vb.x} ${vb.y} ${vb.width} ${vb.height}`}
      colorInterpolationFilters='sRGB'
    >
      <Background
        {...{ width, height }}
        vBox={vb}
        fill={oklch(0, 0.19, 300).hex()}
      />
      <g
        id='polygons'
        style={{ display: "" }}
      >
        {starPolygons.map((p, i) => (
          <polygon
            key={i}
            points={p}
            fill={oklch(1, 0, 0).hex()}
            fillOpacity={0.25}
          />
        ))}
      </g>
      <g id='polygonGroups'>
        {polygonGroups.map((pg, pgi) => (
          <g key={pgi}>
            {pg.map((p, i) => (
              <polygon
                key={i}
                points={p}
                fill={oklch(
                  0.85,
                  0.37,
                  30 + (120 / polygonGroups.length) * pgi,
                ).hex()}
              />
            ))}
          </g>
        ))}
      </g>
      {[72, 144, 216, 288].map(i => (
        <use
          key={i}
          href='#polygonGroups'
          transform={`rotate(${i})`}
        />
      ))}
      <Circles />
      <g id='lines'>
        {allLines.map((l, i) => (
          <g
            key={i}
            id={`line-${i}`}
          >
            <line
              key={i}
              x1={l[0].x}
              y1={l[0].y}
              x2={l[1].x}
              y2={l[1].y}
              stroke={"white"}
              strokeWidth={1}
            />
            <text
              style={{ display: "none" }}
              x={midpoint(l).x}
              y={midpoint(l).y}
              textAnchor='middle'
              alignmentBaseline='middle'
              fill='black'
              fontSize={24}
            >
              {i}
            </text>
          </g>
        ))}
      </g>
      {/* <PrinifyTemplate
        {...{ width, height, file }}
        viewBox={vb}
      /> */}
    </svg>
  );
}
