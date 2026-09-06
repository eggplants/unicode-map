import type { MaterialDefinition } from '../material-data.ts';
import { toHex } from '../util.ts';
import type { UnicodeBlock } from './blocks.ts';
import type { LegendFonts } from './fonts.ts';
import { measureRuns, wrapRuns } from './text.ts';
import type { TextRun, TextStyle } from './text.ts';

/** A line of the legend, already broken and sitting on its baseline. */
export type PlacedLine = {
  runs: TextRun[];
  x: number;
  y: number;
};

/** A run of legend text may be set anywhere in this box. */
export type Column = {
  /** Pen position of an unindented line. */
  x: number;
  /** Baseline of the first line. */
  top: number;
  /** Baseline no line may pass. */
  bottom: number;
  width: number;
};

export type Styles = {
  regular: TextStyle;
  italic: TextStyle;
  semibold: TextStyle;
  bullet: TextStyle;
};

export const stylesAt = (fonts: LegendFonts, size: number): Styles => ({
  regular: { fonts: [fonts.regular, fonts.fallback], size },
  italic: { fonts: [fonts.italic, fonts.fallback], size },
  semibold: { fonts: [fonts.semibold, fonts.fallback], size },
  bullet: { fonts: [fonts.fallback], size },
});

/** How many baselines fit in a column at a given leading. */
export const capacityOf = (column: Column, lineHeight: number): number =>
  Math.floor((column.bottom - column.top) / lineHeight) + 1;

/**
 * A credit line: `・Name by Author licensed under License`, with the name set
 * semibold and the author italic, the way the printed layout sets them.
 */
export const creditRuns = (
  styles: Styles,
  name: string,
  author: string,
  license: string,
): TextRun[] => [
  { text: '・', style: styles.bullet },
  { text: name, style: styles.semibold },
  { text: ' by ', style: styles.regular },
  { text: author, style: styles.italic },
  { text: ` licensed under ${license}`, style: styles.regular },
];

/**
 * Sets credit entries down one column, wrapping each onto as many lines as it
 * needs. Continuations hang by `indent`, so the bullets stay a clean edge.
 * Returns `null` when the entries do not fit, which is what drives the fitting
 * loop in `renderLegend`.
 */
export const layOutCredits = (
  entries: TextRun[][],
  column: Column,
  lineHeight: number,
  indent: number,
): PlacedLine[] | null => {
  const placed: PlacedLine[] = [];

  for (const entry of entries) {
    const lines = wrapRuns(entry, column.width, indent);

    for (const [index, runs] of lines.entries()) {
      placed.push({
        runs,
        x: index === 0 ? column.x : column.x + indent,
        y: column.top + placed.length * lineHeight,
      });
    }
  }

  return placed.length > capacityOf(column, lineHeight) ? null : placed;
};

/** Geometry of the multi-column `Code Blocks` table. */
export type CodeBlockLayout = {
  columns: Column[];
  /** Distance from the code range to the block name. */
  nameOffset: number;
  /** Leading of this table, when the layout sets it apart from the credits. */
  lineHeight?: number;
};

/**
 * Flows the block list down the columns. A long name wraps onto a second line
 * aligned with the name column, and a block is never split across two columns.
 */
export const layOutCodeBlocks = (
  blocks: UnicodeBlock[],
  layout: CodeBlockLayout,
  styles: Styles,
  lineHeight: number,
): PlacedLine[] | null => {
  const placed: PlacedLine[] = [];

  let columnIndex = 0;
  let used = 0;

  for (const block of blocks) {
    let column = layout.columns[columnIndex];

    if (column === undefined) {
      return null;
    }

    const nameLines = wrapRuns(
      [{ text: block.name, style: styles.regular }],
      column.width - layout.nameOffset,
      0,
    );

    if (used + nameLines.length > capacityOf(column, lineHeight)) {
      columnIndex++;
      used = 0;
      column = layout.columns[columnIndex];

      if (column === undefined || nameLines.length > capacityOf(column, lineHeight)) {
        return null;
      }
    }

    const range = `${toHex(block.start).toUpperCase()}..${toHex(block.end).toUpperCase()}`;
    const baseline = column.top + used * lineHeight;

    placed.push({ runs: [{ text: range, style: styles.regular }], x: column.x, y: baseline });

    for (const [index, runs] of nameLines.entries()) {
      placed.push({
        runs,
        x: column.x + layout.nameOffset,
        y: baseline + index * lineHeight,
      });
    }

    used += nameLines.length;
  }

  return placed;
};

export type Statistics = {
  codepoints: number;
  defined: number;
  early: number;
  unicodeVersion: string;
};

/**
 * The three centred sentences under `Character Statistics`. They are centred
 * rather than set in a column, so `width` is what they may not exceed.
 */
export const layOutStatistics = (
  statistics: Statistics,
  styles: Styles,
  centreX: number,
  top: number,
  lineHeight: number,
  width: number,
): PlacedLine[] | null => {
  const format = (value: number): string => value.toLocaleString('en-US');
  /** `1` reads as a singular; every other count, `0` included, stays plural. */
  const count = (value: number, noun: string): string =>
    value === 1 ? `There is ${format(value)} ${noun}` : `There are ${format(value)} ${noun}s`;

  const lines = [
    `${count(statistics.codepoints, 'codepoint')} to encode characters on this chart.`,
    `${count(statistics.defined, 'character')} defined in Unicode ${statistics.unicodeVersion} on this chart.`,
    `${count(statistics.early, 'character')} which will be encoded in the future version of Unicode on this chart.`,
  ].map((sentence, index) => {
    const runs = [{ text: sentence, style: styles.regular }];
    const measured = measureRuns(runs);

    return { runs, x: centreX - measured / 2, y: top + index * lineHeight, measured };
  });

  return lines.some((line) => line.measured > width)
    ? null
    : lines.map((line) => ({ runs: line.runs, x: line.x, y: line.y }));
};

/** Geometry of the two credit lines that name the authors and the repository. */
export type CreditLayout = {
  centreX: number;
  /** Width neither line may exceed. */
  width: number;
  /** Baseline and size of each line, which the layout sets apart from the rest. */
  byline: { top: number; size: number };
  source: { top: number; size: number };
};

/**
 * The `by …` and `Source: …` lines under `Credit of This Poster`. The project
 * name above them and the licence note below stay as the layout drew them.
 */
export const layOutCredit = (
  fonts: LegendFonts,
  layout: CreditLayout,
  credit: { byline: string; source: string },
  scale: number,
): PlacedLine[] | null => {
  const lines = [
    { text: credit.byline, ...layout.byline },
    { text: `Source: ${credit.source}`, ...layout.source },
  ].map(({ text, top, size }) => {
    const runs = [{ text, style: stylesAt(fonts, size * scale).regular }];
    const measured = measureRuns(runs);

    return { runs, x: layout.centreX - measured / 2, y: top, measured };
  });

  return lines.some((line) => line.measured > layout.width)
    ? null
    : lines.map((line) => ({ runs: line.runs, x: line.x, y: line.y }));
};

export const materialCredits = (materials: MaterialDefinition[], styles: Styles): TextRun[][] =>
  materials.map((material) => creditRuns(styles, material.name, material.author, material.license));
