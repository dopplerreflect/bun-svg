import Background from "$components/Background";
import { anglesArray, radialPointString } from "@dopplerreflect/geometry";
import { oklch } from "chroma-js";

type Props = {
  width: number;
  height: number;
};
export default (props: Props & React.SVGProps<SVGPathElement>) => {
  const { width, height, ...rest } = props;
  const radius = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2);
  const angles = anglesArray(72, 0);
  const paths = angles.map(
    (a, i) =>
      `M0 0L${radialPointString(a, radius)}A${radius} ${radius} 1 0 0 ${radialPointString(a + angles[1] / 2, radius)}Z`,
  );
  return (
    <>
      <radialGradient
        id='ray-gradient'
        cx={0}
        cy={0}
        gradientUnits='userSpaceOnUse'
        r={radius}
      >
        <stop
          offset={0}
          stopColor={oklch(0, 0.37, 300).hex()}
        />
        <stop
          offset={0.37}
          stopColor={oklch(0.12, 0.37, 300).hex()}
        />
        <stop
          offset={1}
          stopColor={oklch(0.25, 0.37, 300).hex()}
        />
      </radialGradient>
      <Background
        {...{ width, height }}
        fill='url(#ray-gradient)'
      />
      <g
        {...rest}
        transform={`rotate(${angles[1] / 4})`}
      >
        {paths.map((d, i) => (
          <path
            key={i}
            {...{ d }}
            stroke={"black"}
            strokeWidth={3}
            fill={oklch(0.0, 0.37, 0).alpha(0.5).hex()}
          />
        ))}
      </g>
    </>
  );
};
