import products from "@dopplerreflect/printify-templates/products.json";
import PrintifyTemplate from "@dopplerreflect/printify-templates";
import Background from "$components/Background";
import {
  phylotaxis,
  polygonPointString,
  shrinkPolygon,
} from "@dopplerreflect/geometry";
import { oklch } from "chroma-js";
import config from "$config";
import HexPattern from "$components/HexPattern";
import DrLogoB64 from "./dr-logo-simple.svg.b64.txt";

export default Front;

const originalWidth = products.mensSportsJerseyAOP.templates.front.width;
const originalHeight = products.mensSportsJerseyAOP.templates.front.height;

const phyloPoints = phylotaxis(
  512,
  Math.hypot(originalWidth / 2, originalHeight / 2 + originalHeight * 0.23),
);
const polygons = phyloPoints
  .slice(0, phyloPoints.length - 34)
  .map((p, i) => [
    p,
    phyloPoints[i + 13],
    phyloPoints[i + 34],
    phyloPoints[i + 21],
  ])
  .map(p => shrinkPolygon(p, 25));

const polygons2 = polygons.map(p => shrinkPolygon(p, 61.8));

const Defs = () => (
  <defs>
    <filter id='glow'>
      <feGaussianBlur stdDeviation={3} />
      <feMerge>
        <feMergeNode />
        <feMergeNode in='SourceGraphic' />
      </feMerge>
    </filter>
    <filter id='shadow'>
      <feDropShadow
        dy={15}
        stdDeviation={9}
      />
    </filter>
    <HexPattern
      id='hexpattern'
      radius={24}
      fill='none'
      stroke={oklch(0.75, 0.37, 300).hex()}
      strokeWidth={3}
    />
  </defs>
);

const Logo = ({ size }: { size: number }) => (
  <g id='logo'>
    <pattern
      id='drlogo'
      patternUnits='userSpaceOnUse'
      x={-size / 2}
      y={-size / 2}
      width={size}
      height={size}
    >
      <image
        href={`data:image/svg+xml;base64,${DrLogoB64}`}
        width={size}
        height={size}
      />
    </pattern>
    <path
      d={`M-${size / 2} -${size / 2}h${size}v${size}h-${size}Z`}
      fill='url(#drlogo)'
    />
  </g>
);

const Main = () => (
  <g
    id='main'
    style={{ display: "block" }}
  >
    <g filter='url(#shadow)'>
      {polygons.map((p, i) => (
        <polygon
          key={i}
          points={polygonPointString(p)}
          strokeWidth={9}
          stroke={oklch(0.5, 0.37, 150 - (360 / polygons.length) * i).hex()}
          fill={oklch(1, 0.37, 150 - (360 / polygons.length) * i).hex()}
        />
      ))}
    </g>
    <g filter='url(#shadow)'>
      {polygons2.map((p, i) => (
        <polygon
          key={i}
          points={polygonPointString(p)}
          strokeWidth={9}
          stroke={oklch(
            1 - (1 / 21) * (i % 21),
            0.37,
            (360 / 13) * (i % 13),
          ).hex()}
          fill={oklch((1 / 21) * (i % 21), 0.37, (360 / 13) * (i % 13)).hex()}
        />
      ))}
    </g>
  </g>
);
function Collar() {
  const { width, height, file } = products.mensSportsJerseyAOP.templates.collar;
  const viewBox = {
    x: -width / 2,
    y: -height / 2 + height * 0.1,
    width,
    height,
  };
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
      colorInterpolationFilters='sRGB'
    >
      <Defs />
      <Background
        {...{ width, height }}
        vBox={viewBox}
        fill={oklch(0, 0.37, 300).hex()}
      />
      <Background
        {...{ width, height }}
        vBox={viewBox}
        fill='url(#hexpattern)'
        filter='url(#glow)'
      />
      {config.printfulTemplate && (
        <PrintifyTemplate
          {...{ width, height, viewBox }}
          file={file}
        />
      )}
    </svg>
  );
}

function Front() {
  const { width, height, file } = products.mensSportsJerseyAOP.templates.front;
  const viewBox = {
    x: -width / 2,
    y: -height / 2 + height * 0.18,
    width,
    height,
  };
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
      colorInterpolationFilters='sRGB'
    >
      <Defs />
      <Background
        {...{ width, height }}
        vBox={viewBox}
        fill={oklch(0, 0.37, 300).hex()}
      />
      <Background
        {...{ width, height }}
        vBox={viewBox}
        fill='url(#hexpattern)'
        filter='url(#glow)'
      />
      <Main />
      <Logo size={768} />
      {config.printfulTemplate && (
        <PrintifyTemplate
          {...{ width, height, viewBox }}
          file={file}
        />
      )}
    </svg>
  );
}
function Sleeve() {
  const { width, height, file } =
    products.mensSportsJerseyAOP.templates.leftSleeve;
  const viewBox = {
    x: -width / 2,
    y: -height / 2 + height * 0.0,
    width,
    height,
  };
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
      colorInterpolationFilters='sRGB'
    >
      <Defs />
      <Background
        {...{ width, height }}
        vBox={viewBox}
        fill={oklch(0, 0.37, 300).hex()}
      />
      <Background
        {...{ width, height }}
        vBox={viewBox}
        fill='url(#hexpattern)'
        filter='url(#glow)'
      />
      <Main />
      <Logo size={512} />
      {config.printfulTemplate && (
        <PrintifyTemplate
          {...{ width, height, viewBox }}
          file={file}
        />
      )}
    </svg>
  );
}
