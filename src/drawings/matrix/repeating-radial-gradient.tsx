import { oklch } from "$lib/color";
type Props = {
  radii: number[];
};

export default function RepeatingRadialGradient(props: Props) {
  const { radii } = props;
  const factor = 15;
  return (
    <>
      {radii.map((radius, i) => {
        return (
          <radialGradient
            id={`rrg-gradient${i}`}
            key={i}
          >
            <stop
              offset='0%'
              stopColor={oklch(1, 0.15, 60 + factor * i, 0.5)}
            />
            <stop
              offset='61.8%'
              stopColor={oklch(0.5, 0.25, 300 + factor * i, 0.25)}
            />
            <stop
              offset='100%'
              stopColor={oklch(0.5, 0.5, 270 + factor * i, 0.5)}
            />
          </radialGradient>
        );
      })}
    </>
  );
}
