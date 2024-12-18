import Rays from "./rays";
import config from "$config";

import PrintfulTemplate from "$components/printful-template";

type Props = {
  width?: number;
  height?: number;
};
const size = 6000;
const scale = 0.3;
const strokeWidth = size * scale * 0.000925;
export default function HoodieHood({ width = size, height = size }: Props) {
  const viewBoxOffset = { x: 0, y: 0 };
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2 + viewBoxOffset.x} ${-height / 2 + viewBoxOffset.y} ${width} ${height}`}
    >
      <Rays {...{ width, height, viewBoxOffset, strokeWidth }} />
      {config.printfulTemplate && (
        <PrintfulTemplate
          image='hoodie_hood_template'
          {...{ width, height, viewBoxOffset }}
        />
      )}
    </svg>
  );
}
