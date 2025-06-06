import Background from "$components/Background";
import {
  findNearest,
  calculateDistance,
  PHI,
  phi,
  phylotaxis,
  radialPointString,
  type Circle,
} from "@dopplerreflect/geometry";
import { oklch } from "chroma-js";

export default function Daisy({ width = 1080, height = 1080 }: Props) {
  const r = (width / 2) * 0.95;
  const radii = [...Array(5).keys()].map(n => r * phi ** n);
  const angles = [...Array(13).keys()].map(n => (360 - 360 * phi * n) % 360);
  const phyllotaxicPoints = phylotaxis(233, radii[3]);
  const phyllotaxicCircles: Circle[] = [{ r: 1, ...phyllotaxicPoints[0] }];

  phyllotaxicPoints.forEach((p, i) => {
    const nearestCircle = findNearest(p, phyllotaxicCircles) as Circle;
    const distance = calculateDistance(p, nearestCircle);
    phyllotaxicCircles.push({ r: distance - nearestCircle.r, ...p });
  });

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
      colorInterpolationFilters='sRGB'
    >
      <defs>
        <linearGradient id='petalGradient'>
          <stop
            offset={0}
            stopColor={oklch(0.9, 0.37, phi * 100).hex()}
          />
          <stop
            offset={phi}
            stopColor={oklch(0.9, 0.37, phi * 100 * PHI).hex()}
          />
        </linearGradient>
        <filter id='shadow'>
          <feDropShadow
            dx={0}
            dy={0}
            stdDeviation={5}
          />
        </filter>
        <path
          id='petal-base'
          d={`M${radialPointString(0, radii[4])}A${radii[1]} ${radii[1]} 0 0 0 ${radialPointString(0, radii[0])}A${radii[1]} ${radii[1]} 0 0 0 ${radialPointString(0, radii[4])}Z`}
          fill='url(#petalGradient)'
          filter='url(#shadow)'
        />
        <path
          id='petal-overlay'
          d={`M${radialPointString(0, radii[4])}A${radii[0]} ${radii[0]} 0 0 0 ${radialPointString(0, radii[0])}A${radii[0]} ${radii[0]} 0 0 0 ${radialPointString(0, radii[4])}L${radialPointString(0, radii[0])}Z`}
          fill='none'
          stroke={oklch(0.5, 0.27, 60).hex()}
          filter='url(#petal-overlay-filter)'
          mask='url(#petal-overlay-mask)'
        />
        <filter id='petal-overlay-filter'>
          <feGaussianBlur stdDeviation={3} />
        </filter>
        <radialGradient id='petal-overlay-mask-gradient'>
          <stop
            offset={0}
            stopColor='white'
          />
          <stop
            offset={1}
            stopColor='black'
          />
        </radialGradient>
        <mask id='petal-overlay-mask'>
          <circle
            r={radii[0]}
            fill='url(#petal-overlay-mask-gradient)'
          />
        </mask>
        <g id='petal'>
          <use href='#petal-base' />
          <use href='#petal-overlay' />
        </g>
        <filter id='c'>
          <feMorphology
            in='SourceAlpha'
            operator='dilate'
            radius={2}
          />
          <feGaussianBlur
            stdDeviation={5}
            result='morph'
          />
          <feFlood
            floodColor={oklch(0.25, 0.17, 60).hex()}
            result='color'
          />
          <feComposite
            in2='morph'
            operator='in'
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>
      <Background
        {...{ width, height }}
        fill='green'
      />

      {angles.map((a, i) => (
        <use
          key={i}
          href='#petal'
          stroke='orange'
          transform={`rotate(${a})`}
        />
      ))}
      <g
        id='carpels'
        filter='url(#c)'
      >
        {phyllotaxicCircles.map((c, i) => (
          <circle
            key={i}
            r={c.r}
            cx={c.x}
            cy={c.y}
            fill={oklch(
              0.66,
              0.21,
              150 - (90 / phyllotaxicCircles.length) * i,
            ).hex()}
            stroke={oklch(
              0.5,
              0.37,
              150 - (90 / phyllotaxicCircles.length) * i,
            ).hex()}
          />
        ))}
      </g>
    </svg>
  );
}
