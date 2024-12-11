import { renderToStaticMarkup } from "react-dom/server";
import { $ } from "bun";
import { parseArgs } from "util";
import { readdir } from "node:fs/promises";
import { format } from "prettier";

const { values: options, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    "render-to-desktop": {
      short: "r",
      type: "boolean",
      default: false,
    },
    output: {
      short: "o",
      type: "string",
      default: "eDP-1",
    },
  },
  allowPositionals: true,
});

const drawing = positionals[2];

const drawings = await readdir("./src/drawings");

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
    await $`magick -background none ${filePath}.svg ${filePath}.png`;
  if (exitCode) console.log(stderr.toString());
}
async function setDesktopBackground() {
  const { stdout, stderr, exitCode } =
    await $`swww img -o ${options.output} -t top --resize=fit --transition-duration 1 ${filePath}.png`;
  if (exitCode) console.log(stderr.toString());
}

await renderToPNG();
if (options["render-to-desktop"]) {
  try {
    await setDesktopBackground();
  } catch (e) {}
}

console.info(`${new Date()}: Rendered: ${SVG.name}`);
