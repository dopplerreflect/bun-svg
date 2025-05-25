type BackgroundProps = {
  width: number;
  height: number;
  viewBoxOffset?: { x: number; y: number };
  vBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};
type Props = BackgroundProps & React.SVGProps<SVGPathElement>;

export default function Background({
  width,
  height,
  vBox,
  viewBoxOffset = { x: 0, y: 0 },
  ...rest
}: Props) {
  if (!vBox) {
    vBox = {
      x: -width / 2,
      y: -height / 2,
      width,
      height,
    };
  }
  return (
    <path
      d={`M${vBox.x + viewBoxOffset.x} ${vBox.y + viewBoxOffset.y}h${width}v${height}h${-width}Z`}
      {...rest}
    />
  );
}
