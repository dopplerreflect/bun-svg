import { oklch } from "chroma-js";
import { anglesArray, PHI, radialPointString } from "@dopplerreflect/geometry";

export default function DrLogoSimple({ width = 1080, height = 1080 }: Props) {
  const phi = PHI - 1;
  const radii = [...Array(4).keys()].map(i => (height / 2) * 0.75 * phi ** i);
  const angles = anglesArray(30);
  const starPoints = angles
    .map((a, i) =>
      radialPointString(angles[(i * 12) % angles.length], radii[0]),
    )
    .join(" ");
  const rayPaths = angles.map(
    a => `M${radialPointString(a, radii[2])} ${radialPointString(a, radii[1])}`,
  );
  const dPath = [
    "M",
    radialPointString(angles[0], radii[0]),
    `A ${radii[0]} ${radii[0]} 0 1 1 ${radialPointString(angles[18], radii[0])}`,
    "Z",
  ].join(" ");
  const rPath = [
    "M",
    radialPointString(angles[25], radii[1]),
    `A ${radii[1]} ${radii[1]} 0 1 1 ${radialPointString(angles[11], radii[1])}`,
    `L${radialPointString(angles[12], radii[0])}`,
    `L${radialPointString(angles[15], radii[2])}`,
    `L${radialPointString(angles[17], radii[1])}`,
    `A${radii[1]} ${radii[1]} 0 0 1 ${radialPointString(angles[19], radii[1])}`,
    `L${radialPointString(angles[27], radii[2])}`,
    "Z",
  ].join(" ");
  const Star = () => (
    <polygon
      points={starPoints}
      fill='#333366'
    />
  );
  const D = (props: React.SVGProps<SVGPathElement>) => {
    const { d, ...rest } = props;
    return (
      <path
        d={dPath}
        {...rest}
        stroke={props.stroke ?? "white"}
        fill='none'
      />
    );
  };
  const R = (props: React.SVGProps<SVGPathElement>) => {
    const { d, ...rest } = props;
    return (
      <path
        className='R'
        d={rPath}
        {...rest}
        stroke={props.stroke ?? "white"}
        fill='none'
      />
    );
  };

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    >
      <defs>
        <filter
          id='shadow'
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
        >
          <feDropShadow
            stdDeviation={5}
            dx={0}
            dy={5}
          />
        </filter>
      </defs>
      <circle
        r={radii[0] + radii[3]}
        fill='white'
        fillOpacity={0.5}
        stroke='black'
        strokeWidth={radii[3] * phi ** 5}
        filter='url(#shadow)'
      />
      <path
        fill='black'
        fillRule='evenodd'
        d={`M${radialPointString(angles[0], radii[0])}A${radii[0]} ${radii[0]} 0 1 1 ${radialPointString(angles[0] - 0.01, radii[0])}ZM${radialPointString(angles[0], radii[1])}A${radii[1]} ${radii[1]} 0 1 1 ${radialPointString(angles[0] - 0.01, radii[1])}Z`}
      />
      <Star />
      <D
        strokeWidth={radii[2] * phi ** 2}
        stroke='#3399ff'
        filter='url(#shadow)'
      />
      <R
        strokeWidth={radii[2] * phi ** 2}
        stroke='#ffcc00'
        filter='url(#shadow)'
      />
    </svg>
  );
}
