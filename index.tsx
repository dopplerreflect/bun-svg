import { renderToStaticMarkup } from "react-dom/server";
import { $ } from "bun";
import { anglesArray, radialPointString, PHI } from "geometry";
import type { ReactElement } from "react";

const phi = PHI - 1;

type GroupProps = {
  filter: string;
  strokeWidth: number;
  children: ReactElement;
};

const Group = ({ children, filter, strokeWidth }: GroupProps) => {
  return (
    <g
      filter={filter}
      strokeWidth={strokeWidth}
    >
      {children}
    </g>
  );
};
const Foo = () => {
  const width = 1920;
  const height = 1080;
  const hue = 300;
  const saturation = "100%";
  const radius = (height / 2) * phi;
  const angles = anglesArray(5);
  const starPoints = angles
    .map((_, i) => radialPointString(angles[(i * 2) % angles.length], radius))
    .join(" ");
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    >
      <defs>
        <filter id='highlight'>
          <feGaussianBlur
            in='SourceAlpha'
            stdDeviation={5}
          />
          <feOffset
            dy={5}
            result='shadow'
          />
          <feMorphology
            in='SourceGraphic'
            operator='erode'
            radius={4}
          />
          <feColorMatrix
            values='
            1 0 0 0 0.5
            0 1 0 0 0.5
            0 0 1 0 0.5
            0 0 0 1 0
          '
          />
          <feGaussianBlur stdDeviation={2} />
          <feOffset
            dy={-5}
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
        fill={`hsla(${hue - 60}, 50%, 25%, 1)`}
      />
      <Group
        filter='url(#highlight)'
        strokeWidth={20}
      >
        <>
          <circle
            r={(height / 2) * 0.618}
            stroke={`hsl(${hue}, ${saturation}, 50%)`}
            fill='none'
          />
          <polygon
            points={starPoints}
            fill='none'
            strokeLinejoin='round'
            stroke={`hsl(${hue}, ${saturation}, 50%)`}
          />
        </>
      </Group>
    </svg>
  );
};

const IMAGES_DIR = "./images";

const svg = renderToStaticMarkup(<Foo />);
console.log(svg);

await Bun.write(`${IMAGES_DIR}/current.svg`, svg);
const { stdout, stderr, exitCode } =
  await $`magick -verbose -background none ${IMAGES_DIR}/current.svg ${IMAGES_DIR}/current.png`;

[stdout.toString(), stderr.toString(), exitCode].forEach(s => console.log(s));
