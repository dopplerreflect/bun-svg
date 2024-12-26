type RadialGradientStop = {
  offset: number;
  stopColor: string;
};
type RadialGradientProps = {
  id: string;
  stops: RadialGradientStop[];
};

type Props = RadialGradientProps & React.SVGProps<SVGRadialGradientElement>;
export default function RadialGradient(props: Props) {
  const { stops, ...rest } = props;
  return (
    <radialGradient {...rest}>
      {stops.map(({ offset, stopColor }, i) => (
        <stop
          key={i}
          offset={`${offset}%`}
          stopColor={stopColor}
        />
      ))}
    </radialGradient>
  );
}
