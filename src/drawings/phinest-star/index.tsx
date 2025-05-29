import products from "@dopplerreflect/printify-templates/products.json";
import PrinifyTemplate from "@dopplerreflect/printify-templates";
import Background from "$components/Background";
import { oklch } from "chroma-js";
import {
  anglesArray,
  arrayMap,
  lineIntersection,
  midpoint,
  phi,
  polygonFromIntersectionOfLines,
  radialPoint,
  type Circle,
  type Line,
  type Point,
} from "@dopplerreflect/geometry";

const templates = products.mensSportsJerseyAOP.templates;

const originalWidth = templates.front.width;
const originalHeight = templates.front.height;

const radius = originalWidth / 2; //* 0.43;

const radii = arrayMap(7, n => radius * phi ** n);
const circles: Circle[] = radii.map(r => ({ x: 0, y: 0, r }));
const angles = anglesArray(30);

const ShrinkFilter = () => (
  <filter id='shrink'>
    <feMorphology
      operator='erode'
      radius={5}
    />
  </filter>
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

const starPolygons = starLineGroups.map(a => a.map(l => l[0]));

const allLines = starLineGroups.flat();

const polygonGroups = [
  [polygonFromIntersectionOfLines([0, 19, 28, 9, 0], allLines)],
  [polygonFromIntersectionOfLines([19, 28, 39, 48, 19], allLines)],
  [polygonFromIntersectionOfLines([38, 39, 48, 49, 59, 58, 38], allLines)],

  [
    polygonFromIntersectionOfLines([27, 28, 19, 48, 27], allLines),
    polygonFromIntersectionOfLines([19, 10, 39, 28, 19], allLines),
  ],

  [
    polygonFromIntersectionOfLines([47, 48, 19, 18, 47], allLines),
    polygonFromIntersectionOfLines([39, 30, 29, 28, 39], allLines),
  ],
  [
    polygonFromIntersectionOfLines([47, 18, 19, 48, 39, 38, 47], allLines),
    polygonFromIntersectionOfLines([39, 28, 29, 30, 49, 48, 39], allLines),
  ],
  [polygonFromIntersectionOfLines([0, 1, 29, 10, 0], allLines)],
  [
    polygonFromIntersectionOfLines([27, 47, 18, 27], allLines),
    polygonFromIntersectionOfLines([10, 29, 30, 10], allLines),
  ],
  [polygonFromIntersectionOfLines([27, 18, 47, 38, 27], allLines)],
];

const radiusToPoint = (p: Point): number => Math.hypot(p.x, p.y);

type GradientParams = {
  r: number;
  fr: number;
};
const gradientParams: GradientParams[] = [
  { r: radii[0], fr: radii[2] },
  {
    r: radii[2],
    fr: radiusToPoint(lineIntersection(allLines[48], allLines[39]) as Point),
  },
  { r: radii[3], fr: radii[5] },
  {
    r: radii[1],
    fr: radiusToPoint(lineIntersection(allLines[48], allLines[19]) as Point),
  },
  {
    r: radii[2],
    fr: radii[3],
  },
  {
    r: radiusToPoint(lineIntersection(allLines[48], allLines[19]) as Point),
    fr: radii[4],
  },
  {
    r: radii[1],
    fr: radiusToPoint(lineIntersection(allLines[10], allLines[29]) as Point),
  },
  {
    r: radii[2],
    fr: radiusToPoint(lineIntersection(allLines[10], allLines[29]) as Point),
  },
  {
    r: radiusToPoint(lineIntersection(allLines[10], allLines[29]) as Point),
    fr: radiusToPoint(lineIntersection(allLines[30], allLines[49]) as Point),
  },
];
export default function PhinestStarFront() {
  const { width, height, file } = templates.front;
  const vb = {
    x: -width / 2,
    y: -height / 2 + height * 0.0,
    width,
    height,
  };

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${vb.x} ${vb.y} ${vb.width} ${vb.height}`}
      colorInterpolationFilters='sRGB'
    >
      <defs>
        <ShrinkFilter />
        {gradientParams.map((g, i) => (
          <radialGradient
            key={i}
            id={`gradient-${i}`}
            gradientUnits='userSpaceOnUse'
            cx={0}
            cy={0}
            r={g.r}
            fr={g.fr}
          >
            <stop
              offset={0}
              stopColor='black'
            />
            <stop
              offset={1}
              stopColor={oklch(
                0.8,
                0.37,
                300 + (90 / gradientParams.length) * i,
              ).hex()}
              // stopColor='white'
            />
          </radialGradient>
        ))}
      </defs>
      <Background
        {...{ width, height }}
        vBox={vb}
        fill={oklch(0, 0.19, 300).hex()}
      />
      <g id='polygonGroups'>
        {polygonGroups.map((pg, pgi) => (
          <g
            key={pgi}
            fill={`url(#gradient-${pgi})`}
          >
            {pg.map((p, i) => (
              <polygon
                key={i}
                points={p}
                filter='url(#shrink)'
                stroke={oklch(
                  0,
                  0.37,
                  30 + (120 / polygonGroups.length) * pgi,
                ).hex()}
                strokeWidth={1}
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
      {circles.map((c, i) => (
        <circle
          cx={c.x}
          cy={c.y}
          r={c.r}
          key={i}
          fill='none'
          stroke='none'
          strokeWidth={1}
        />
      ))}
      <g
        id='allLines'
        style={{ display: "none" }}
      >
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
              stroke={oklch(0.9, 0.37, 90).hex()}
              strokeWidth={3}
            />
            <text
              style={{ display: "none" }}
              x={midpoint(l).x}
              y={midpoint(l).y}
              textAnchor='middle'
              alignmentBaseline='middle'
              fill='white'
              fontSize={64}
              fontWeight={"bold"}
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
