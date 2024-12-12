import Background from "$components/Background";
import { oklch } from "$lib/color";
import { PHI } from "@dopplerreflect/geometry";

type Props = {
  width: number;
  height: number;
  radius: number;
};

export default function Ripples(props: Props) {
  const { width, height, radius } = props;
  return (
    <>
      <defs>
        <radialGradient
          id={"ripple-gradient"}
          cx='0'
          cy='0'
          r={radius * (PHI - 1)}
          spreadMethod='repeat'
          gradientUnits='userSpaceOnUse'
        >
          {[1, 2, 3, 4].map(i => (
            <stop
              key={i}
              offset={1 * (PHI - 1) ** i}
              stopColor={oklch(1 * (PHI - 1) ** i, 0.37, 210 + 60 * i, 0.5)}
            />
          ))}
        </radialGradient>
      </defs>
      <Background
        {...{ width, height }}
        fill={`url(#ripple-gradient)`}
      />
    </>
  );
}
