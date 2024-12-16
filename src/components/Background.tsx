type BackgroundProps = {
  width: number;
  height: number;
  viewBoxOffset?: { x: number; y: number };
};
type Props = BackgroundProps & React.SVGProps<SVGPathElement>;

export default function Background(props: Props) {
  const { width, height, viewBoxOffset = { x: 0, y: 0 }, ...rest } = props;
  return (
    <path
      d={`M${-width / 2 + viewBoxOffset.x} ${-height / 2 + viewBoxOffset.y}h${width}v${height}h${-width}Z`}
      {...rest}
    />
  );
}
