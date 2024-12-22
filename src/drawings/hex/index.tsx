import Background from "$components/Background";
import HexPattern from "$components/HexPattern";

type Props = {
  width?: number;
  height?: number;
};
export default function Hex({ width = 1920, height = 1080 }: Props) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    >
      <defs>
        <HexPattern
          id={"hexpattern"}
          radius={16}
          stroke='white'
          strokeWidth={1}
          fill='none'
        />
      </defs>
      <Background
        {...{ width, height }}
        fill='url(#hexpattern)'
      />
    </svg>
  );
}
