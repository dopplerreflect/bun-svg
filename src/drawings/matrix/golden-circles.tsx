import type { Circle } from "@dopplerreflect/geometry/src/types";
import { radialPoint } from "@dopplerreflect/geometry";

type Props = {
  angles: number[];
  radii: number[];
  stroke: string;
};
export default function GoldenCircles(props: Props) {
  const { angles, radii, stroke } = props;
  const circles: Circle[] = [
    ...angles.map(a => [
      ...radii.map(r => ({ r, ...radialPoint(a, radii[1]) })),
    ]),
  ].flat();
  return (
    <>
      <defs>
        <radialGradient id='asotueha'>
          <stop
            offset='0.61803'
            stopColor='black'
          />
          <stop
            offset='1'
            stopColor='white'
          />
        </radialGradient>
        <mask id='golden-circle-mask'>
          <circle
            r={radii[0]}
            fill='white'
          />
          <circle
            r={radii[3]}
            fill='url(#asotueha)'
          />
        </mask>
      </defs>
      <g mask='url(#golden-circle-mask'>
        {circles.map((c, i) => (
          <circle
            key={i}
            r={c.r}
            cx={c.x}
            cy={c.y}
            stroke={stroke}
            fill='none'
          />
        ))}
      </g>
    </>
  );
}
