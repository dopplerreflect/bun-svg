import { Background } from "$components/all";
import { oklch } from "$lib/color";
import { anglesArray, PHI, radialPoint } from "geometry";
import DecagonCrystal from "./decagon-crystal";

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
        {radii.map((radius, i) => {
          return (
            <radialGradient
              id={`gradient${i}`}
              key={i}
            >
              <stop
                offset='0%'
                stopColor={oklch(1, 0.15, 90)}
              />
              <stop
                offset='61.8%'
                stopColor={oklch(0, 0.15, 270)}
              />
              <stop
                offset='100%'
                stopColor={oklch(0.0, 0.5, 270)}
              />
            </radialGradient>
          );
        })}
      </defs>
      <Background
        {...{ width, height }}
        fill={oklch(0.0, 0.15, 300)}
      />
      <g filter='url(#cheap-glow)'>
        {radii.map((r, i) => (
          <circle
            key={r}
            r={r}
            stroke={oklch(0.95, 0.8, 270)}
            fill={`url(#gradient${i})`}
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
        <g filter='url(#cheap-glow)'>
          <DecagonCrystal {...{ angles, radii }} />
        </g>
      </g>
    </svg>
  );
}
