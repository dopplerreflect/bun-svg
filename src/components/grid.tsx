type Props = {
  width: number;
  height: number;
  stroke?: string;
  scaleFactor: number;
  filter?: string;
};

export default function Grid(props: Props) {
  const { width, height, stroke, scaleFactor, filter } = props;
  const lines: JSX.Element[] = [];

  // TODO lerp
  for (let x = 0; x < width / 2; x += scaleFactor / 10) {
    [x, -x].forEach((x, i) => {
      lines.push(
        <line
          key={x}
          x1={x}
          y1={-width / 2}
          x2={x}
          y2={width / 2}
          stroke={stroke}
          strokeWidth={x % scaleFactor === 0 ? 2 : 1}
        />,
      );
    });
  }
  for (let y = 0; y < height / 2; y += scaleFactor / 10) {
    [y, -y].forEach(y => {
      lines.push(
        <line
          key={y}
          x1={-width / 2}
          y1={y}
          x2={width / 2}
          y2={y}
          stroke={stroke}
          strokeWidth={y % scaleFactor === 0 ? 2 : 1}
        />,
      );
    });
  }
  return <g {...{ filter }}>{lines}</g>;
}
