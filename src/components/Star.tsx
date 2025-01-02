import {
  anglesArray,
  phi,
  radialPointString,
  type GeometryOptions,
} from "@dopplerreflect/geometry";

type StarProps = {
  radius: number;
  geometryOptions: GeometryOptions;
};

export function Star(props: StarProps & React.SVGProps<SVGPolygonElement>) {
  const {
    radius,
    geometryOptions = { center: { x: 0, y: 0 }, rotate: -90 },
    ...rest
  } = props;
  const angles = anglesArray(10, geometryOptions.rotate);
  const points = angles
    .map((a, i) =>
      radialPointString(a, i % 2 === 0 ? radius : radius * phi ** 2, {
        center: geometryOptions.center,
      }),
    )
    .join(" ");
  return (
    <polygon
      {...{ points }}
      {...rest}
    />
  );
}
