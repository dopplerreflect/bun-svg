import { renderToStaticMarkup } from "react-dom/server";
import { $ } from "bun";
import { parseArgs } from "util";
import { readdir } from "node:fs/promises";
import { format } from "prettier";
import config from "./config.json";

const { values: options, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    list: {
      type: "boolean",
      default: false,
    },
    "use-latest": {
      short: "l",
      type: "boolean",
      default: config["use-latest"] ?? true,
    },
    output: {
      short: "o",
      type: "string",
      default: config.output ?? "eDP-1",
    },
    "render-to-desktop": {
      short: "r",
      type: "boolean",
      default: config["render-to-desktop"] ?? false,
    },
    "render-to-png": {
      short: "p",
      type: "boolean",
      default: config["render-to-png"] ?? false,
    },
  },
  allowPositionals: true,
});

const drawings = await readdir("./src/drawings");

if (options.list) {
  console.log(drawings.sort());
  process.exit();
}

const mostRecentlyEditedDrawing = async () => {
  const { stdout } =
    await $`find src/drawings -type f -print | xargs stat -c %y=%n | sort -r | head -1 | cut -d= -f 2 | cut -d\/ -f 3`;
  return stdout.toString().trim();
};
let drawing = positionals[2];

if (!drawing && options["use-latest"]) {
  drawing = await mostRecentlyEditedDrawing();
  console.info(
    `Did not specify drawing. Using  most recently edited drawing '${drawing}'.`,
  );
}

if (!drawings.includes(drawing)) {
  console.error(`The drawing "${drawing}" does not exist.`);
  console.info({ drawings });
  process.exit();
}

const modulePath = `./src/drawings/${drawing}`;

console.info(`Loading "${modulePath}"`);

const module = await import(modulePath);
const SVG = module.default;

const svgPath = `./images/svg/${SVG.name}.svg`;
const pngPath = `./images/png/${SVG.name}.png`;

let svg: string = "";

const renderSVG = async () =>
  (svg = await format(renderToStaticMarkup(<SVG />), { parser: "html" }));

const writeSvgPath = async () => await Bun.write(svgPath, svg);

const renderToPNG = async () => {
  const { stdout, stderr, exitCode } =
    await $`rsvg-convert --dpi-x 150 --dpi-y 150 -o ${pngPath} ${svgPath}`;
  if (exitCode) console.log(exitCode, stderr.toString());
};

const setDesktopBackground = async () => {
  const { stdout, stderr, exitCode } =
    await $`swww img -o ${options.output} -t top --resize fit --transition-duration 1 ${pngPath}`;
  if (exitCode) console.log(stderr.toString());
};

(async () => {
  const svg = await timedAsync("renderSVG", renderSVG);
  await timedAsync("write svgPath", writeSvgPath);

  if (options["render-to-png"]) {
    await timedAsync("convert pngPath", renderToPNG);
  }

  if (options["render-to-desktop"]) {
    await timedAsync("setDesktopBackground", setDesktopBackground);
  }

  console.info(`${new Date()}: Rendered: ${SVG.name}`);
})();

console.info(`${new Date()}: Rendered: ${SVG.name}`);

async function timedAsync<T>(
  description: string,
  asyncFunction: () => Promise<T>,
): Promise<T> {
  const startTime = performance.now();

  try {
    const result = await asyncFunction();
    const endTime = performance.now();
    console.log(`${description}: ${endTime - startTime}ms`);
    return result;
  } catch (error) {
    console.error(`Error during ${description}:`, error);
    throw error;
  }
}
