type LinearGradientProps = {
  id: string;
  stops: GradientStop[];
};

type Props = LinearGradientProps & React.SVGProps<SVGLinearGradientElement>;
export default function LinearGradient(props: Props) {
  const { stops, ...rest } = props;
  return (
    <linearGradient {...rest}>
      {stops.map(({ offset, stopColor }, i) => (
        <stop
          key={i}
          offset={`${offset}%`}
          stopColor={stopColor}
        />
      ))}
    </linearGradient>
  );
}
