export default function Template({ width = 1920, height = 1080 }: Props) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
    ></svg>
  );
}
