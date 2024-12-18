import Background from "$components/Background";

type Props = {
  image: string;
  opacity?: number;
  width?: number;
  height?: number;
  viewBoxOffset?: { x: number; y: number };
};
export default ({
  image,
  opacity = 0.5,
  width = 6000,
  height = 6000,
  viewBoxOffset = { x: 0, y: 0 },
}: Props) => (
  <>
    <pattern
      id='template'
      patternUnits='userSpaceOnUse'
      x={-width / 2 + viewBoxOffset.x}
      y={-width / 2 + viewBoxOffset.y}
      {...{ width, height }}
    >
      <image
        href={`file://${process.cwd()}/images/printful.com.specs/${image}.png`}
        {...{ width, height }}
      />
    </pattern>
    <Background
      {...{ width, height, viewBoxOffset }}
      fill='url(#template)'
      fillOpacity={opacity}
    />
  </>
);
