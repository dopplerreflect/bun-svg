import Background from "$components/Background";
import { oklch } from "chroma-js";
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

export default function Matrix({ width = 1920 * 1, height = 1080 * 1 }: Props) {
  const scale = 1;
  const radiusBase = (height / 2) * 0.95;
  const phi = PHI - 1;
  const angles = anglesArray(10);
  const radii = [...Array(5).keys()].map(i => radiusBase * phi ** i);
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
      width={width * scale}
      height={height * scale}
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
        fill={oklch(0.0, 0.15, 300).hex()}
      />
      <Grid
        {...{ width, height }}
        scaleFactor={radii[2]}
        stroke={oklch(0.25, 0.5, 300).hex()}
        strokeWidth={1.5}
      />
      <Ripples
        {...{ width, height }}
        radius={radiusBase}
      />
      {radii.map((r, i) => (
        <circle
          key={r}
          r={r}
          stroke={oklch(0.95, 0.8, 270).hex()}
          strokeWidth={1}
          fill={`url(#rrg-gradient${i})`}
        />
      ))}
      <g filter='url(#cheap-glow)'>
        {radii.map((r, i) => (
          <circle
            key={r}
            r={r}
            stroke={oklch(0.95, 0.8, 270).hex()}
            strokeWidth={1}
            fill='none'
            filter='url(#cheap-glow)'
          />
        ))}
        <GoldenCircles
          {...{ angles, radii }}
          stroke={oklch(0.75, 0.37, 270).hex()}
          strokeWidth={1}
        />
        <DecagonCrystal
          {...{ angles, radii }}
          stroke={oklch(1, 0.37, 270).hex()}
          strokeWidth={1}
        />
      </g>
    </svg>
  );
}
