type Props = {
  width: number;
  height: number;
  stroke?: string;
  strokeWidth?: number;
  scaleFactor: number;
  filter?: string;
};

export default function Grid(props: Props) {
  const { width, height, stroke, strokeWidth = 1, scaleFactor, filter } = props;
  const lines: JSX.Element[] = [];

  // TODO lerp
  for (let x = 0; x < width / 2; x += scaleFactor / 10) {
    [x, -x].forEach((x, i) => {
      lines.push(
        <line
          key={x}
          x1={x}
          y1={-height / 2}
          x2={x}
          y2={height / 2}
          stroke={stroke}
          strokeWidth={
            Math.round(x) % Math.round(scaleFactor) === 0
              ? strokeWidth * 2
              : strokeWidth
          }
        />,
      );
    });
  }
  for (let y = 0; y < height / 2; y += scaleFactor / 10) {
    [y, -y].forEach((y, i) => {
      lines.push(
        <line
          key={y}
          x1={-width / 2}
          y1={y}
          x2={width / 2}
          y2={y}
          stroke={stroke}
          strokeWidth={
            Math.round(y) % Math.round(scaleFactor) === 0
              ? strokeWidth * 2
              : strokeWidth
          }
        />,
      );
    });
  }
  return <g {...{ filter }}>{lines}</g>;
}
