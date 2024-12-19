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
  },
  allowPositionals: true,
});

// console.log(JSON.stringify(options));

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

const filePath = `./images/${SVG.name}`;

const svg = await format(renderToStaticMarkup(<SVG />), { parser: "html" });

await Bun.write(`${filePath}.svg`, svg);

async function renderToPNG() {
  const { stdout, stderr, exitCode } =
    await $`rsvg-convert --dpi-x 150 --dpi-y 150 -o ${filePath}.png ${filePath}.svg`;
  console.log(stdout.toString());
  if (exitCode) console.log(exitCode, stderr.toString());
}
async function setDesktopBackground() {
  const { stdout, stderr, exitCode } =
    // await $`swww img -o ${options.output} -t top --resize=fit --transition-duration 1 ${filePath}.png`;
    await $`swww img -o ${options.output} -t top --resize fit --transition-duration 1 ${filePath}.png`;
  if (exitCode) console.log(stderr.toString());
}

await renderToPNG();
if (options["render-to-desktop"]) {
  try {
    await setDesktopBackground();
  } catch (e) {}
}

console.info(`${new Date()}: Rendered: ${SVG.name}`);
