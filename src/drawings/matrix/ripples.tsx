import Background from "$components/Background";
import { oklch } from "$lib/color";
import { PHI } from "@dopplerreflect/geometry";

type Props = {
  width: number;
  height: number;
};

export default function Ripples(props: Props) {
  const { width, height } = props;
  return (
    <>
      <defs>
        <radialGradient
          id='gradient1'
          cx='0'
          cy='0'
          r={(height / 2) * 0.95 * (PHI - 1) ** 5}
          spreadMethod='repeat'
          gradientUnits='userSpaceOnUse'
        >
          <stop
            offset={0}
            stopColor={oklch(0, 0.37, 270, 0.61)}
          />
          <stop
            offset={0.618}
            stopColor={oklch(0.37, 0.37, 270, 0.61)}
          />
          <stop
            offset={0.8}
            stopColor={oklch(0.61, 0.37, 270, 0.61)}
          />
        </radialGradient>
      </defs>
      <Background
        {...{ width, height }}
        fill='url(#gradient1)'
      />
    </>
  );
}
