import Background from "$components/Background";
import { anglesArray, PHI } from "@dopplerreflect/geometry";
import { oklch } from "chroma-js";
import Circles, { circleArray } from "./circles";
import Lines, { lineArray } from "./lines";
import Rays from "./rays";
import config from "$config";

import PrintfulTemplate from "$components/printful-template";

type Props = {
  width?: number;
  height?: number;
};
const size = 1000;
const scale = 0.3;
const strokeWidth = size * scale * 0.000925;
export default function HoodieFront({ width = size, height = size }: Props) {
  const phi = PHI - 1;
  const figSize = width * 0.25 * scale;
  const radii = [...Array(3).keys()].map(i => figSize * phi ** i);
  const angles = anglesArray(6);
  const circles = circleArray(angles, radii);
  const lines = lineArray(angles, radii);

  const viewBoxOffset = { x: 0, y: size * 0.15 };
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2 + viewBoxOffset.x} ${-height / 2 + viewBoxOffset.y} ${width} ${height}`}
    >
      <defs>
        <mask id='circle-mask'>
          <Background
            {...{ width, height, viewBoxOffset }}
            fill='white'
          />
          <Circles
            {...{ circles }}
            id='circle-mask-g'
            style={{ stroke: "black", strokeWidth: 8 * strokeWidth }}
          />
        </mask>
        <mask id='line-mask'>
          <Background
            {...{ width, height, viewBoxOffset }}
            fill='white'
          />
          <Lines
            {...{ lines }}
            style={{
              stroke: "black",
              strokeWidth: 8 * strokeWidth,
              strokeLinecap: "round",
            }}
          />
        </mask>
        <filter id='circle-blur'>
          <feGaussianBlur stdDeviation={21 * strokeWidth} />
        </filter>
        <filter id='glow'>
          <feGaussianBlur stdDeviation={3 * strokeWidth} />
          <feMerge>
            <feMergeNode />
            <feMergeNode />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>
      <Rays {...{ width, height, viewBoxOffset, strokeWidth }} />
      <Circles
        {...{ circles }}
        id='circles-blurred'
        mask='url(#circle-mask)'
        style={{ stroke: oklch(1, 0, 0).hex(), strokeWidth: 13 * strokeWidth }}
        filter='url(#circle-blur)'
      />
      <Circles
        {...{ circles }}
        id='circles'
        mask='url(#circle-mask)'
        style={{
          stroke: oklch(0.5, 0.37, 300).hex(),
          strokeWidth: 13 * strokeWidth,
        }}
        filter='url(#glow)'
      />
      <Lines
        {...{ lines }}
        mask='url(#line-mask)'
        style={{
          stroke: oklch(0.95, 0.37, 90).hex(),
          strokeWidth: 13 * strokeWidth,
          strokeLinecap: "round",
        }}
        filter='url(#glow)'
      />
      {config.printfulTemplate && (
        <PrintfulTemplate
          image='hoodie_front_template'
          {...{ width, height, viewBoxOffset }}
        />
      )}
    </svg>
  );
}
