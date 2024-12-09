import { Background } from "$components/all";
import { oklch } from "$lib/color";
import { anglesArray, PHI, radialPoint, radialPointString } from "geometry";

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
      </defs>
      <Background
        {...{ width, height }}
        fill={oklch(0.05, 0.2, 300)}
      />
      <g filter='url(#cheap-glow)'>
        {radii.map(r => (
          <circle
            key={r}
            r={r}
            stroke={oklch(0.95, 0.8, 270)}
            fill='none'
          />
        ))}
        {radii.map(r => (
          <g
            key={r}
            id={r.toString()}
          >
            {angles.slice(0, 9).map((a, outerIdx) => {
              const start = radialPoint(a, r);
              return [...Array(7).keys()].map(innerIdx => {
                const end = radialPoint(
                  angles[(outerIdx + innerIdx + 2) % angles.length],
                  r,
                );
                return (
                  <line
                    x1={start[0]}
                    y1={start[1]}
                    x2={end[0]}
                    y2={end[1]}
                    stroke={oklch(0.95, 0.5, 270)}
                  />
                );
              });
            })}
          </g>
        ))}
      </g>
    </svg>
  );
}
