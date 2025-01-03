import Rays from "./rays";
import config from "$config";

import PrintfulTemplate from "@dopplerreflect/printful-templates";

const width = 5550;
const height = 6300;
const scale = 0.54;
const strokeWidth = width * scale * 0.000925;
export default function JerseyLeftSleeve() {
  const viewBoxOffset = { x: 0, y: width * -0.522 };
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2 + viewBoxOffset.x} ${-height / 2 + viewBoxOffset.y} ${width} ${height}`}
    >
      <Rays
        width={width * 1.5}
        height={height * 1.5}
        {...{ viewBoxOffset, strokeWidth }}
      />
      {config.printfulTemplate && (
        <PrintfulTemplate
          image='hockey_fan_jersey/Hockey_jersey_customer_template_left_sleeve'
          {...{ width, height, viewBoxOffset }}
        />
      )}
    </svg>
  );
}
