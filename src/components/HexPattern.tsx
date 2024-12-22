import { SQRT3 } from "@dopplerreflect/geometry";
type HexPatternProps = {
  id: string;
  radius: number;
};
type Props = HexPatternProps & React.SVGProps<SVGPathElement>;
export default function HexPattern(props: Props) {
  const { id, radius, patternTransform = "", ...rest } = props;
  const width = radius * 3;

  return (
    <pattern
      id={id}
      patternTransform={patternTransform}
      width={width}
      height={width / SQRT3}
      patternUnits='userSpaceOnUse'
    >
      <path
        d={`M${width / 1.5} 0H${width / 3}L${width / 6} ${width / SQRT3 / 2}l${width / 6} ${
          width / SQRT3 / 2
        }h${width / 3}l${width / 6}-${width / SQRT3 / 2}zM0 ${width / SQRT3 / 2}H${width / 6}M${
          width - width / 6
        } ${width / SQRT3 / 2}h${width / 6}`}
        {...rest}
      />
    </pattern>
  );
}
