import Background from "$components/Background";
import { anglesArray, PHI } from "@dopplerreflect/geometry";
import { oklch } from "chroma-js";
import Circles, { circleArray } from "./circles";
import Lines, { lineArray } from "./lines";
import Rays from "./rays";
import config from "$config";

import PrintfulTemplate from "@dopplerreflect/printful-templates";

type Props = {
  width?: number;
  height?: number;
};
const size = 6000;
const scale = 0.54;
const strokeWidth = size * scale * 0.000925;
const phi = PHI - 1;
export default function HoodieBack({ width = size, height = size }: Props) {
  const figSize = width * 0.25 * scale;
  const radii = [...Array(3).keys()].map(i => figSize * phi ** i);
  const angles = anglesArray(6);
  const circles = circleArray(angles, radii);
  const lines = lineArray(angles, radii);

  const viewBoxOffset = { x: 0, y: size * 0.1 };
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2 + viewBoxOffset.x} ${-height / 2 + viewBoxOffset.y} ${width} ${height}`}
    >
      <defs>
        <mask id='g-mask'>
          <Background
            {...{ width, height, viewBoxOffset }}
            fill='white'
          />
          <circle
            r={circles[0].r}
            fill='black'
          />
        </mask>
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
      <Background
        {...{ width, height }}
        fill={oklch(0, 0, 270).hex()}
      />
      <g mask='url(#g-mask)'>
        <Rays {...{ width, height, viewBoxOffset, strokeWidth }} />
      </g>
      <Circles
        {...{ circles }}
        id='circles-blurred'
        mask='url(#circle-mask)'
        style={{
          stroke: oklch(1, 0, 0).hex(),
          strokeWidth: 13 * strokeWidth,
        }}
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
          image='all-over_print_hoodie/hoodie_back_template'
          {...{ width, height, viewBoxOffset }}
        />
      )}
    </svg>
  );
}
