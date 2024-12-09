import { Background } from "$components/all";
import { oklch } from "$lib/color";
import { anglesArray, PHI } from "@dopplerreflect/geometry";
import DecagonCrystal from "./decagon-crystal";
import RepeatingRadialGradient from "./repeating-radial-gradient";
import Grid from "$components/grid";
import GoldenCircles from "./golden-circles";
import Ripples from "./ripples";

type Props = {
  width?: number;
  height?: number;
};
export default function Matrix({ width = 1920, height = 1080 }: Props) {
  const phi = PHI - 1;
  const angles = anglesArray(10);
  const radii = [...Array(5).keys()].map(i => (height / 2) * 0.95 * phi ** i);
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    >
      <defs>
        <filter id='cheap-glow'>
          <feMorphology
            operator='dilate'
            radius={0.5}
          />
          <feGaussianBlur stdDeviation={5} />
          <feMerge>
            <feMergeNode />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
        <RepeatingRadialGradient {...{ radii }} />
      </defs>

      <Background
        {...{ width, height }}
        fill={oklch(0.0, 0.15, 300)}
      />
      <Grid
        {...{ width, height }}
        scaleFactor={radii[1]}
        stroke={oklch(0.125, 0.5, 300)}
      />
      <Ripples {...{ width, height }} />
      <g filter='url(#cheap-glow)'>
        {radii.map((r, i) => (
          <circle
            key={r}
            r={r}
            stroke={oklch(0.95, 0.8, 270)}
            fill={`url(#rrg-gradient${i})`}
          />
        ))}
        {radii.map((r, i) => (
          <circle
            key={r}
            r={r}
            stroke={oklch(0.95, 0.8, 270)}
            fill='none'
            filter='url(#cheap-glow)'
          />
        ))}
        <GoldenCircles
          {...{ angles, radii }}
          stroke={oklch(0.75, 0.37, 270)}
        />
        <DecagonCrystal
          {...{ angles, radii }}
          stroke={oklch(1, 0.37, 270)}
        />
      </g>
    </svg>
  );
}
