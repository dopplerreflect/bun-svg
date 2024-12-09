import { oklch } from "$lib/color";
type Props = {
  radii: number[];
};

export default function RepeatingRadialGradient(props: Props) {
  const { radii } = props;
  return (
    <>
      {radii.map((radius, i) => {
        return (
          <radialGradient
            id={`gradient${i}`}
            key={i}
          >
            <stop
              offset='0%'
              stopColor={oklch(1, 0.15, 60, 0.5)}
            />
            <stop
              offset='61.8%'
              stopColor={oklch(0.5, 0.25, 300, 0.25)}
            />
            <stop
              offset='100%'
              stopColor={oklch(0.5, 0.5, 270, 0.5)}
            />
          </radialGradient>
        );
      })}
    </>
  );
}
