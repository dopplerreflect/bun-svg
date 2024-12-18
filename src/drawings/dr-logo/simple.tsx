import Background from "$components/Background";
import { oklch } from "$lib/color";
import { anglesArray, PHI, radialPointString } from "@dopplerreflect/geometry";

type Props = {
  width?: number;
  height?: number;
};
export default function DrLogo({ width = 3000, height = 3000 }: Props) {
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
  const Circles = () =>
    radii.map(r => (
      <circle
        key={r}
        {...{ r }}
        stroke='white'
        fill={oklch(1, 0, 0, 0.15)}
      />
    ));
  const Rays = () =>
    rayPaths.map((d, i) => (
      <path
        key={i}
        {...{ d }}
        stroke='white'
      />
    ));
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
      <path
        fill='black'
        fillRule='evenodd'
        d={`M${radialPointString(angles[0], radii[0])}A${radii[0]} ${radii[0]} 0 1 1 ${radialPointString(angles[0] - 0.01, radii[0])}ZM${radialPointString(angles[0], radii[1])}A${radii[1]} ${radii[1]} 0 1 1 ${radialPointString(angles[0] - 0.01, radii[1])}Z`}
      />
      <Star />
      <D
        strokeWidth={radii[2] * phi ** 2}
        stroke='#3399ff'
      />
      <R
        strokeWidth={radii[2] * phi ** 2}
        stroke='#ffcc00'
      />
    </svg>
  );
}
