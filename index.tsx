import { renderToStaticMarkup } from "react-dom/server";
import { $ } from "bun";
import { format } from "prettier";
import SVG from "$drawings/pentagram";

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
    await $`swww img -o eDP-1 -t top --transition-duration 1 ${filePath}.png`;
  if (exitCode) console.log(stderr.toString());
}

await renderToPNG();
await setDesktopBackground();

console.info(`${new Date()}: Rendered: ${SVG.name}`);
