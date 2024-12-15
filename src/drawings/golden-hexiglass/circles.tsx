import type { Circle } from "@dopplerreflect/geometry/src/types";
import { PHI, radialPoint } from "@dopplerreflect/geometry";
export const circleArray = (angles: number[], radii: number[]): Circle[] => [
  { r: radii[0] * PHI, x: 0, y: 0 },
  ...radii.map(r => ({ r, x: 0, y: 0 })),
  ...angles
    .map(a => radii.map(r => ({ r, ...radialPoint(a, radii[0]) })))
    .flat(),
];

type Props = {
  circles: Circle[];
};
export default function Circles(props: Props & React.SVGProps<SVGGElement>) {
  const { circles, ...rest } = props;
  return (
    <g {...rest}>
      {circles.map((c, i) => (
        <circle
          key={i}
          r={c.r}
          cx={c.x}
          cy={c.y}
          fill='none'
        />
      ))}
    </g>
  );
}
