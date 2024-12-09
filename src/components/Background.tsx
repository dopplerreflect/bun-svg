type BackgroundProps = {
  width: number;
  height: number;
};
type Props = BackgroundProps & React.SVGProps<SVGPathElement>;

export default function Background(props: Props) {
  const { width, height, ...rest } = props;
  return (
    <path
      d={`M${-width / 2} ${-height / 2}H${width / 2}V${height / 2}H${-width / 2}Z`}
      {...rest}
    />
  );
}
