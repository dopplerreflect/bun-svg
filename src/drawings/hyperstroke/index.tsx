import Background from "$components/Background";
import { anglesArray, PHI, radialPointString } from "@dopplerreflect/geometry";
import { oklch } from "chroma-js";

type Props = {
  width?: number;
  height?: number;
};
export default function Hyprstroke({ width = 1920, height = 1080 }: Props) {
  const phi = PHI - 1;
  const angles = anglesArray(10);
  const radii = [...Array(3).keys()].map(i => (height / 2) * phi * phi ** i);
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    >
      <Background
        {...{ width, height }}
        fill={oklch(0.25, 0.03, 270).hex()}
      />
      <g fill='none'>
        {[...Array(5).keys()].map(i => (
          <polygon
            key={i}
            points={angles
              .map((a, i) =>
                radialPointString(a, i % 2 === 0 ? radii[0] : radii[2]),
              )
              .join(" ")}
            strokeWidth={72 - i * (72 / 5)}
            stroke={oklch(0.95, 0.37, 90 - i * 15)
              .darken(i * 0.75)
              .hex()}
          />
        ))}
      </g>
    </svg>
  );
}
