import { renderToStaticMarkup } from "react-dom/server";
import { $ } from "bun";
import { parseArgs } from "util";
import { readdir } from "node:fs/promises";
import { format } from "prettier";
import config from "./config.json";

const { values: options, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    "use-latest": {
      short: "l",
      type: "boolean",
      default: config["use-latest"] ?? false,
    },
    "render-to-desktop": {
      short: "r",
      type: "boolean",
      default: config["render-to-desktop"] ?? false,
    },
    output: {
      short: "o",
      type: "string",
      default: config.output ?? "eDP-1",
    },
    inkscape: {
      short: "i",
      type: "boolean",
      default: config.inkscape ?? false,
    },
  },
  allowPositionals: true,
});

console.log({ config, options });

// /usr/bin/env find src/drawings -type f -print | xargs stat -c %y=%n | sort -r
// 2024-12-11 09:06:00.025476122 -0600=src/drawings/matrix/index.tsx
const mostRecentlyEditedDrawing =
  await $`find src/drawings -type f -print | xargs stat -c %y=%n | sort -r | head -1 | cut -d= -f 2 | cut -d\/ -f 3`;

let drawing = positionals[2];

if (!drawing && options["use-latest"]) {
  drawing = mostRecentlyEditedDrawing.text().trim();
  console.info(
    `Did not specify drawing. Using  most recently edited drawing '${drawing}'.`,
  );
}

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
  const { stdout, stderr, exitCode } = config.inkscape
    ? await $`inkscape ${filePath}.svg --export-type=png -o ${filePath}.png`
    : await $`magick -background none ${filePath}.svg ${filePath}.png`;
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
