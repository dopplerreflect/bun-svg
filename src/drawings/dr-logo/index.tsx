import Background from "$components/Background";
import { oklch } from "$lib/color";
import { anglesArray, PHI, radialPointString } from "@dopplerreflect/geometry";

type Props = {
  width?: number;
  height?: number;
};
export default function DrLogo({ width = 1080, height = 1080 }: Props) {
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
    radii.map((r, i) => (
      <circle
        key={r}
        {...{ r }}
        stroke='white'
        fill={oklch(1, 0, 0, 0.25)}
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
      stroke='white'
      fill={oklch(1, 0, 0, 0.5)}
    />
  );
  const D = (props: React.SVGProps<SVGPathElement>) => {
    const { d, ...rest } = props;
    return (
      <path
        d={dPath}
        {...rest}
      />
    );
  };
  const R = (props: React.SVGProps<SVGPathElement>) => {
    const { d, ...rest } = props;
    return (
      <path
        d={rPath}
        {...rest}
      />
    );
  };

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    >
      <Background
        {...{ width, height }}
        fill={oklch(0, 0.2, 240)}
      />
      <Circles />
      <Rays />
      <Star />
      <D
        strokeWidth={radii[2] * phi ** 2}
        stroke={oklch(1, 0.37, 270, 0.9)}
        fill='none'
      />
      <D
        strokeWidth={radii[2] * phi ** 3}
        stroke={oklch(0.5, 0.37, 270, 0.9)}
        fill='none'
      />
      <D
        fill='none'
        stroke='white'
        strokeWidth={2}
      />
      <R
        strokeWidth={radii[2] * phi ** 2}
        stroke={oklch(1, 0.37, 90, 0.9)}
        fill='none'
      />
      <R
        strokeWidth={radii[2] * phi ** 3}
        stroke={oklch(0.75, 0.37, 90, 0.9)}
        fill='none'
      />
      <R
        fill='none'
        stroke='white'
        strokeWidth={2}
      />
    </svg>
  );
}
