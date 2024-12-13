import type { Circle } from "@dopplerreflect/geometry/src/types";
import { PHI, radialPoint } from "@dopplerreflect/geometry";
import { oklch } from "chroma-js";
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
export default function Circles(props: Props) {
  const { circles } = props;
  const styles = {
    circles: {
      fill: "none",
      stroke: oklch(0.75, 0.37, 270).hex(),
    },
  };
  return (
    <g
      id='circles'
      style={styles.circles}
    >
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
