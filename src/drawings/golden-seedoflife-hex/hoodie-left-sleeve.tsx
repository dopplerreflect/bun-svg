import Rays from "./rays";
import config from "$config";

import PrintfulTemplate from "$components/printful-template";

type Props = {
  width?: number;
  height?: number;
};
const size = 6000;
const scale = 0.54;
const strokeWidth = size * scale * 0.000925;
export default function HoodieLeftSleeve({
  width = size,
  height = size,
}: Props) {
  const viewBoxOffset = { x: 0, y: size * -0.33 };
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2 + viewBoxOffset.x} ${-height / 2 + viewBoxOffset.y} ${width} ${height}`}
    >
      <Rays
        width={width * 1.4}
        height={height * 1.4}
        {...{ viewBoxOffset, strokeWidth }}
      />
      {config.printfulTemplate && (
        <PrintfulTemplate
          image='hoodie_left_sleeve_template'
          {...{ width, height, viewBoxOffset }}
        />
      )}
    </svg>
  );
}
