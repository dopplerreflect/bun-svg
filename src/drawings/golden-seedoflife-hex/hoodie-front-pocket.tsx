import Rays from "./rays";
import config from "$config";

import PrintfulTemplate from "@dopplerreflect/printful-templates";

type Props = {
  width?: number;
  height?: number;
};
const size = 6000;
const scale = 0.3;
const strokeWidth = size * scale * 0.000925;
export default function HoodieFrontPocket({
  width = size,
  height = size,
}: Props) {
  const viewBoxOffset = { x: 0, y: size * 0.15 };
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2 + viewBoxOffset.x} ${-height / 2 + viewBoxOffset.y} ${width} ${height}`}
    >
      <Rays {...{ width, height, viewBoxOffset, strokeWidth }} />
      {config.printfulTemplate && (
        <PrintfulTemplate
          image='hoodie_front_template'
          {...{ width, height, viewBoxOffset }}
        />
      )}
    </svg>
  );
}
