import { renderToStaticMarkup } from "react-dom/server";
import { $ } from "bun";

const Foo = () => {
  const width = 1920;
  const height = 1080;
  const hue = 270;
  const saturation = "50%";
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    >
      <defs>
        <filter id='blur'>
          <feGaussianBlur
            in='SourceAlpha'
            stdDeviation={8}
          />
          <feOffset dy={15} />
        </filter>
        <filter id='highlightBlur'>
          <feGaussianBlur stdDeviation={2} />
          <feOffset dy={-4} />
        </filter>
      </defs>
      <path
        d={`M${-width / 2},${-height / 2}H${width / 2}V${height / 2}H${
          -width / 2
        }Z`}
        fill={`hsla(${hue}, 5%, 5%, 1)`}
      />
      <circle
        r={(height / 2) * 0.618}
        stroke='black'
        strokeWidth={15}
        fill='none'
        filter='url(#blur)'
      />
      <circle
        r={(height / 2) * 0.618}
        stroke={`hsl(${hue}, ${saturation}, 50%)`}
        strokeWidth={15}
        fill='none'
      />
      <circle
        r={(height / 2) * 0.618}
        stroke={`hsl(${hue}, ${saturation}, 85%)`}
        strokeWidth={6}
        fill='none'
        filter='url(#highlightBlur)'
      />
    </svg>
  );
};

const IMAGES_DIR = "./images";

await Bun.write(`${IMAGES_DIR}/current.svg`, renderToStaticMarkup(<Foo />));
const { stdout, stderr, exitCode } =
  await $`magick -verbose -background none ${IMAGES_DIR}/current.svg ${IMAGES_DIR}/current.png`;

[stdout.toString(), stderr.toString(), exitCode].forEach(s => console.log(s));
