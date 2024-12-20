import { oklch } from "chroma-js";
import { PHI } from "@dopplerreflect/geometry";
type Props = {
  radii: number[];
};

export default function RepeatingRadialGradient(props: Props) {
  const { radii } = props;
  return (
    <>
      {radii.map((_, o) => {
        return (
          <radialGradient
            id={`rrg-gradient${o}`}
            key={o}
          >
            {[0, 1, 2, 3].map(i => (
              <stop
                key={i}
                offset={1 / PHI ** i}
                stopColor={oklch(
                  0 + 0.25 * o,
                  0.37,
                  30 * o,
                  0.1 + 0.15 * o,
                ).hex()}
              />
            ))}
          </radialGradient>
        );
      })}
    </>
  );
}
