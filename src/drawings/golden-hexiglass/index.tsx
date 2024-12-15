import Background from "$components/Background";
import { anglesArray, PHI } from "@dopplerreflect/geometry";
import { oklch } from "chroma-js";
import Circles, { circleArray } from "./circles";
import Lines, { lineArray } from "./lines";
import Rays from "./rays";

type Props = {
  width?: number;
  height?: number;
};
export default function BunSVG20241214({ width = 1920, height = 1080 }: Props) {
  const phi = PHI - 1;
  const size = height / 4.5;
  const radii = [...Array(3).keys()].map(i => size * phi ** i);
  const angles = anglesArray(6);
  const circles = circleArray(angles, radii);
  const lines = lineArray(angles, radii);

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    >
      <defs>
        <mask id='circle-mask'>
          <Background
            {...{ width, height }}
            fill='white'
          />
          <Circles
            {...{ circles }}
            id='circle-mask-g'
            style={{ stroke: "black", strokeWidth: 8 }}
          />
        </mask>
        <mask id='line-mask'>
          <Background
            {...{ width, height }}
            fill='white'
          />
          <Lines
            {...{ lines }}
            style={{ stroke: "black", strokeWidth: 8, strokeLinecap: "round" }}
          />
        </mask>
        <filter id='circle-blur'>
          <feGaussianBlur stdDeviation={21} />
        </filter>
        <filter id='glow'>
          <feGaussianBlur stdDeviation={3} />
          <feMerge>
            <feMergeNode />
            <feMergeNode />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>
      <Background
        {...{ width, height }}
        fill={oklch(0.1, 0.1, 270).hex()}
      />
      <Rays {...{ width, height }} />
      <Circles
        {...{ circles }}
        id='circles'
        mask='url(#circle-mask)'
        style={{ stroke: oklch(1, 0, 0).hex(), strokeWidth: 13 }}
        filter='url(#circle-blur)'
      />
      <Circles
        {...{ circles }}
        id='circles'
        mask='url(#circle-mask)'
        style={{ stroke: oklch(0.5, 0.37, 300).hex(), strokeWidth: 13 }}
        filter='url(#glow)'
      />
      <Lines
        {...{ lines }}
        mask='url(#line-mask)'
        style={{
          stroke: oklch(0.95, 0.37, 90).hex(),
          strokeWidth: 13,
          strokeLinecap: "round",
        }}
        filter='url(#glow)'
      />
      <Lines
        {...{ lines }}
        style={{ stroke: oklch(1, 0.2, 90).hex(), strokeWidth: 1 }}
        filter='url(#glow)'
      />
    </svg>
  );
}
