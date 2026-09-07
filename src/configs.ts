import type { Box } from './lib/bbox.ts';
import type { CodeBlockLayout, Column, CreditLayout } from './lib/legend/sections.ts';

/** The Unicode version the code point data in `data/` is written against. */
export const UNICODE_VERSION = '17.0.0';

/** Every chart draws the same 128x128 square of the Hilbert curve. */
export const CODEPOINTS_PER_CHART = 128 * 128;

/** The credit printed under `Credit of This Poster`, below the project name. */
export const POSTER_CREDIT = {
  byline: 'By hakatashi (~ v3) and eggplants (v4 ~)',
  source: 'https://github.com/hakatashi/unicode-map',
};

/**
 * Where the sections generated from the project's own data are set, in the
 * layout's points. The numbers are read off the Illustrator artwork so that the
 * generated text lands on the same baselines as the headings above it.
 */
export type LegendLayout = {
  /** Type size and leading the layout was set in. */
  size: number;
  lineHeight: number;
  /** Hanging indent of a wrapped credit line. */
  indent: number;
  codeBlocks: CodeBlockLayout;
  fonts: Column;
  materials: Column;
  statistics: { centreX: number; top: number; width: number };
  credit: CreditLayout;
  /**
   * Regions of the layout these sections own.
   */
  slots: Box[];
};

/** A single poster to be rendered out of the code point chart. */
export type PosterConfig = {
  name: string;
  /** Basename of the layout in `data/layouts`. */
  layout: string;
  /** Position of the chart within the poster layout, in points. */
  chart: { x: number; y: number };
  /** First code point of the 128x128 block drawn on the poster. */
  codepoint: number;
  /** Absent while a layout's legend is still the one baked into the artwork. */
  legend?: LegendLayout;
};

const configs: PosterConfig[] = [
  {
    name: 'bmp-1',
    layout: 'bmp-1',
    chart: { x: 28.35, y: 728.5 },
    codepoint: 0x0000,
    legend: {
      size: 10,
      lineHeight: 12,
      indent: 8.4,
      codeBlocks: {
        nameOffset: 54,
        columns: [
          // The first column starts lower, under the `Code Blocks` heading.
          { x: 32.57, top: 303.21, bottom: 715, width: 190 },
          { x: 228.5, top: 281.08, bottom: 715, width: 198 },
          { x: 432.99, top: 281.08, bottom: 715, width: 195 },
          // The minimap sits under the fourth column, which stops short of it.
          { x: 634.28, top: 281.03, bottom: 487, width: 214 },
        ],
      },
      fonts: { x: 855.14, top: 301.75, bottom: 713, width: 392 },
      materials: { x: 1258.03, top: 302.75, bottom: 535, width: 398 },
      statistics: { centreX: 1465.03, top: 576.31, width: 390 },
      credit: {
        centreX: 1465.08,
        width: 300,
        byline: { top: 678.95, size: 12 },
        source: { top: 695.88, size: 10 },
      },
      slots: [
        { x: 28, y: 288, width: 190, height: 434 },
        { x: 220, y: 268, width: 200, height: 454 },
        { x: 424, y: 268, width: 200, height: 454 },
        { x: 628, y: 268, width: 218, height: 224 },
        { x: 850, y: 288, width: 400, height: 434 },
        { x: 1254, y: 288, width: 406, height: 254 },
        { x: 1258, y: 560, width: 402, height: 50 },
        // Only the byline of the credit block; the project name above it and
        // the licence note below stay as the layout drew them.
        { x: 1300, y: 668, width: 362, height: 16 },
        { x: 1300, y: 686, width: 362, height: 14 },
      ],
    },
  },
  {
    name: 'bmp-2',
    layout: 'bmp-2',
    chart: { x: 28.35, y: 728.5 },
    codepoint: 0x4000,
    legend: {
      size: 10,
      lineHeight: 12,
      indent: 8.4,
      codeBlocks: {
        nameOffset: 54,
        // Three blocks cover the whole chart, so one short column holds them.
        columns: [{ x: 1071.85, top: 304.12, bottom: 340, width: 210 }],
      },
      fonts: { x: 1300.1, top: 304.57, bottom: 336, width: 358 },
      materials: { x: 1299.55, top: 373.54, bottom: 470, width: 358 },
      statistics: { centreX: 1483.06, top: 510.28, width: 354 },
      credit: {
        centreX: 1483.08,
        width: 300,
        byline: { top: 614.95, size: 12 },
        source: { top: 631.88, size: 10 },
      },
      slots: [
        { x: 1065, y: 292, width: 230, height: 60 },
        { x: 1296, y: 292, width: 364, height: 44 },
        { x: 1296, y: 360, width: 364, height: 112 },
        { x: 1296, y: 496, width: 364, height: 49 },
        { x: 1300, y: 604, width: 362, height: 16 },
        { x: 1300, y: 622, width: 362, height: 14 },
      ],
    },
  },
  {
    name: 'bmp-3',
    layout: 'bmp-3',
    chart: { x: 28.35, y: 28.35 },
    codepoint: 0x8000,
    legend: {
      size: 10,
      lineHeight: 12,
      indent: 8.4,
      codeBlocks: {
        nameOffset: 59,
        // This layout sets its code block table on a looser grid than the
        // credits beside it.
        lineHeight: 14.5,
        columns: [{ x: 32.22, top: 1696.61, bottom: 2112, width: 200 }],
      },
      fonts: { x: 869.14, top: 1951.32, bottom: 2110, width: 381 },
      materials: { x: 1258.03, top: 1694.18, bottom: 1932, width: 398 },
      statistics: { centreX: 1465.02, top: 1967.72, width: 390 },
      credit: {
        centreX: 1465.12,
        width: 300,
        byline: { top: 2070.32, size: 12 },
        source: { top: 2087.31, size: 10 },
      },
      slots: [
        { x: 28, y: 1686, width: 202, height: 426 },
        { x: 862, y: 1940, width: 388, height: 175 },
        { x: 1252, y: 1686, width: 413, height: 246 },
        { x: 1252, y: 1955, width: 413, height: 45 },
        { x: 1300, y: 2059, width: 362, height: 16 },
        { x: 1300, y: 2078, width: 362, height: 13 },
      ],
    },
  },
];

export default configs;
