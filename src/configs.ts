/** A single poster to be rendered out of the code point chart. */
export type PosterConfig = {
  name: string;
  /** Basename of the layout in `data/layouts`. */
  layout: string;
  /** Position of the chart within the poster layout, in points. */
  chart: { x: number; y: number };
  /** First code point of the 128x128 block drawn on the poster. */
  codepoint: number;
};

const configs: PosterConfig[] = [
  {
    name: 'bmp-1',
    layout: 'bmp-1',
    chart: { x: 28.35, y: 728.5 },
    codepoint: 0x0000,
  },
  {
    name: 'bmp-2',
    layout: 'bmp-2',
    chart: { x: 28.35, y: 728.5 },
    codepoint: 0x4000,
  },
  {
    name: 'bmp-3',
    layout: 'bmp-3',
    chart: { x: 28.35, y: 28.35 },
    codepoint: 0x8000,
  },
];

export default configs;
