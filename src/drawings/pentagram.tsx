import { anglesArray, radialPointString, PHI } from "geometry";
import LinearGradient from "$components/LinearGradient";

import chroma from "chroma-js";

const oklch = (l: number, c: number, h: number): string =>
  chroma.oklch(l, c, h).hex();

const phi = PHI - 1;

const Group = (props: React.SVGProps<SVGGElement>) => {
  const { children, ...rest } = props;
  return <g {...rest}>{children}</g>;
};

type Props = {
  width?: number;
  height?: number;
  strokeSize?: number;
};
export default function Pentagram({
  width = 1920,
  height = 1080,
  strokeSize = 1,
}: Props) {
  const hue = 210;
  const radius = (height / 2) * phi;
  const angles = anglesArray(5);
  const Star = () => (
    <polygon
      points={angles
        .map((_, i) =>
          radialPointString(angles[(i * 2) % angles.length], radius),
        )
        .join(" ")}
    />
  );
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    >
      <defs>
        <LinearGradient
          id='backgroundGradient'
          gradientTransform='rotate(90)'
          stops={[
            { offset: 0, stopColor: oklch(0.0, 0.0, hue) },
            { offset: 48, stopColor: oklch(0.25, 0.37, hue) },
            { offset: 49, stopColor: oklch(0.5, 0.37, hue) },
            { offset: 50, stopColor: oklch(0.95, 0.37, hue) },
            { offset: 51, stopColor: oklch(0.5, 0.37, hue) },
            { offset: 52, stopColor: oklch(0.25, 0.37, hue) },
            { offset: 100, stopColor: oklch(0.0, 0.0, hue) },
          ]}
        />
        <filter id='highlight'>
          <feGaussianBlur
            in='SourceAlpha'
            stdDeviation={5 * strokeSize}
          />
          <feOffset
            dy={5 * strokeSize}
            result='shadow'
          />
          <feMorphology
            in='SourceGraphic'
            operator='erode'
            radius={4 * strokeSize}
          />
          <feColorMatrix
            values='
            1 0 0 0 0.5
            0 1 0 0 0.5
            0 0 1 0 0.5
            0 0 0 1 0
          '
          />
          <feGaussianBlur stdDeviation={2 * strokeSize} />
          <feOffset
            dy={-5 * strokeSize}
            result='highlight'
          />
          <feMerge>
            <feMergeNode in='shadow' />
            <feMergeNode in='SourceGraphic' />
            <feMergeNode in='highlight' />
          </feMerge>
        </filter>
      </defs>
      <path
        d={`M${-width / 2},${-height / 2}H${width / 2}V${height / 2}H${
          -width / 2
        }Z`}
        // fill={oklch(0.15, 0.37, hue)}
        fill='url(#backgroundGradient)'
      />
      <Group
        filter='url(#highlight)'
        strokeWidth={20 * strokeSize}
        stroke={oklch(0.5, 0.37, hue)}
        strokeLinejoin='round'
        fill='none'
      >
        <>
          <circle r={radius} />
          <Star />
        </>
      </Group>
    </svg>
  );
}
