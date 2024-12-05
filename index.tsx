import { renderToStaticMarkup } from "react-dom/server";
import { $ } from "bun";
import { anglesArray, radialPointString, PHI } from "geometry/geometry";
import type { ReactElement, ReactSVGElement } from "react";

const phi = PHI - 1;

type GroupProps = {
  filter: string;
  children: ReactElement;
};

const Group = ({ children, filter }: GroupProps) => {
  return <g filter={filter}>{children}</g>;
};
const Foo = () => {
  const width = 1920;
  const height = 1080;
  const hue = 100;
  const saturation = "100%";
  const radii = [(height / 2) * phi, (height / 2) * phi ** 3];
  const angles = anglesArray(10);
  const starPoints = angles
    .map((a, i) => radialPointString(a, radii[i % 2]))
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
            1 0 0 0 0.3
            0 1 0 0 0.3
            0 0 1 0 0.3
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
      {/* <g filter='url(#highlight)'> */}
      <Group filter='url(#highlight)'>
        <>
          <circle
            r={(height / 2) * 0.618}
            stroke={`hsl(${hue}, ${saturation}, 50%)`}
            strokeWidth={15}
            fill='none'
          />
          <polygon
            points={angles
              .map((a, i) =>
                radialPointString(
                  a,
                  [(height / 2) * phi ** 2, (height / 2) * phi ** 4][i % 2],
                ),
              )
              .join(" ")}
            fill='none'
            strokeWidth={15}
            strokeLinejoin='round'
            stroke={`hsl(${hue}, ${saturation}, 50%)`}
          />
          <polygon
            points={starPoints}
            fill='none'
            strokeWidth={15}
            strokeLinejoin='round'
            stroke={`hsl(${hue}, ${saturation}, 50%)`}
          />
        </>
      </Group>
      {/* </g> */}
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
