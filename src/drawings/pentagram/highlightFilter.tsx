type Props = {
  id: string;
  shadowBlur: number;
  shadowOffset: number;
  highlightErode: number;
  highlightBlur: number;
  highlightOffset: number;
};

export default function HighlightFilter(props: Props) {
  const {
    id,
    shadowBlur,
    shadowOffset,
    highlightErode,
    highlightBlur,
    highlightOffset,
  } = props;
  return (
    <filter {...{ id }}>
      <feGaussianBlur
        in='SourceAlpha'
        stdDeviation={shadowBlur}
      />
      <feOffset
        dy={shadowOffset}
        result='shadow'
      />
      <feMorphology
        in='SourceGraphic'
        operator='erode'
        radius={highlightErode}
      />
      <feColorMatrix
        values='
            1 0 0 0 0.5
            0 1 0 0 0.5
            0 0 1 0 0.5
            0 0 0 1 0
          '
      />
      <feGaussianBlur stdDeviation={highlightBlur} />
      <feOffset
        dy={highlightOffset}
        result='highlight'
      />
      <feMerge>
        <feMergeNode in='shadow' />
        <feMergeNode in='SourceGraphic' />
        <feMergeNode in='highlight' />
      </feMerge>
    </filter>
  );
}
