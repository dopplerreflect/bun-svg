import { anglesArray, radialPointString, PHI } from "@dopplerreflect/geometry";
import Background from "$components/Background";
import LinearGradient from "$components/gradients/LinearGradient";
import HighlightFilter from "./highlightFilter";
import { oklch } from "chroma-js";

const phi = PHI - 1;

type Props = {
  width?: number;
  height?: number;
  strokeSize?: number;
};
export default function Pentagram({
  width = 1920,
  height = 1080,
  strokeSize = 1,
}: Props) {
  const hue = 210;
  const radius = (height / 2) * phi;
  const angles = anglesArray(5);
  const Star = ({ radius }: { radius: number }) => (
    <polygon
      points={angles
        .map((_, i) =>
          radialPointString(angles[(i * 2) % angles.length], radius),
        )
        .join(" ")}
    />
  );
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    >
      <defs>
        <LinearGradient
          id='backgroundGradient'
          gradientTransform='rotate(90)'
          stops={[
            { offset: 0, stopColor: oklch(0.0, 0.0, hue).hex() },
            { offset: 48, stopColor: oklch(0.25, 0.37, hue).hex() },
            { offset: 49, stopColor: oklch(0.5, 0.37, hue).hex() },
            { offset: 50, stopColor: oklch(0.95, 0.37, hue).hex() },
            { offset: 51, stopColor: oklch(0.5, 0.37, hue).hex() },
            { offset: 52, stopColor: oklch(0.25, 0.37, hue).hex() },
            { offset: 100, stopColor: oklch(0.0, 0.0, hue).hex() },
          ]}
        />
        <HighlightFilter
          id='highlight'
          shadowBlur={10 * strokeSize}
          shadowOffset={15 * strokeSize}
          highlightErode={5 * strokeSize}
          highlightBlur={3 * strokeSize}
          highlightOffset={-3 * strokeSize}
        />
      </defs>
      <Background
        {...{ width, height }}
        fill='url(#backgroundGradient)'
      />
      <g
        filter='url(#highlight)'
        strokeWidth={20 * strokeSize}
        stroke={oklch(0.5, 0.37, hue).hex()}
        strokeLinejoin='round'
        fill='none'
      >
        <circle r={radius} />
        <Star radius={(height / 2) * phi} />
      </g>
    </svg>
  );
}
