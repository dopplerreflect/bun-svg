import { radialPoint } from "@dopplerreflect/geometry";

type Props = {
  angles: number[];
  radii: number[];
  stroke: string;
};
export default function DecagonCrystal(props: Props) {
  const { angles, radii, stroke } = props;
  const lineAngleMatrixSet: Set<string> = new Set();

  angles.forEach((_, a) => {
    [...Array(7).keys()].forEach(b => {
      lineAngleMatrixSet.add(
        JSON.stringify([a, (a + b + 2) % angles.length].sort()),
      );
    });
  });
  const lineAngleMatrix = [...lineAngleMatrixSet].map(e => JSON.parse(e));

  return radii.map(radius =>
    lineAngleMatrix.map((e, i) => {
      const [start, end] = [
        radialPoint(angles[e[0]], radius),
        radialPoint(angles[e[1]], radius),
      ];
      return (
        <line
          key={i}
          x1={start[0]}
          y1={start[1]}
          x2={end[0]}
          y2={end[1]}
          {...{ stroke }}
        />
      );
    }),
  );
}
