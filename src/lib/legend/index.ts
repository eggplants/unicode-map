import type { LegendLayout } from '../../configs.ts';
import { materialsFor } from '../material-data.ts';
import type { FontDefinition } from '../font-data.ts';
import { setAttributes } from '../svg.ts';
import type { Paper } from '../svg.ts';
import { log } from '../util.ts';
import loadBlocks, { blocksIn } from './blocks.ts';
import type { UnicodeBlock } from './blocks.ts';
import loadLegendFonts from './fonts.ts';
import type { LegendFonts } from './fonts.ts';
import {
  creditRuns,
  layOutCodeBlocks,
  layOutCredit,
  layOutCredits,
  layOutStatistics,
  materialCredits,
  stylesAt,
} from './sections.ts';
import type { PlacedLine, Statistics } from './sections.ts';
import { runsToPathData } from './text.ts';

/** Ink colour of the printed layout's text. */
const LEGEND_FILL = '#231815';

/**
 * How far the fitting loop may shrink a section that has outgrown the room the
 * layout gives it. Unicode keeps adding blocks, so `Code Blocks` in particular
 * no longer fits the columns at the size it was drawn at.
 */
const MIN_SCALE = 0.8;
const SCALE_STEPS = 20;

export type LegendResources = {
  fonts: LegendFonts;
  blocks: UnicodeBlock[];
};

export const loadLegendResources = async (): Promise<LegendResources> => {
  const [fonts, blocks] = await Promise.all([loadLegendFonts(), loadBlocks()]);
  return { fonts, blocks };
};

/** A font that was actually drawn on the chart, with the credit it carries. */
export type FontUsage = FontDefinition & { count: number };

export type LegendData = {
  /** Byline and repository printed under `Credit of This Poster`. */
  credit: { byline: string; source: string };
  /** First code point of the chart, as `PosterConfig.codepoint`. */
  codepoint: number;
  codepointCount: number;
  fonts: FontUsage[];
  statistics: Statistics;
};

/**
 * Retries `attempt` at ever smaller type sizes until it fits. Sections keep the
 * layout's own size whenever the content still allows it.
 */
const fit = <T>(name: string, attempt: (scale: number) => T | null): T => {
  for (let step = 0; step <= SCALE_STEPS; step++) {
    const scale = 1 - (step * (1 - MIN_SCALE)) / SCALE_STEPS;
    const result = attempt(scale);

    if (result !== null) {
      if (step > 0) {
        log(`Legend: ${name} set at ${(scale * 100).toFixed(0)}% to fit its column.`);
      }

      return result;
    }
  }

  throw new Error(`Legend: ${name} does not fit even at ${MIN_SCALE * 100}% of its size.`);
};

const draw = (paper: Paper, lines: PlacedLine[]): SVGPathElement => {
  const pathData = lines.map((line) => runsToPathData(line.runs, line.x, line.y)).join('');
  const path = paper.path(pathData);

  setAttributes(path, { fill: LEGEND_FILL });

  return path;
};

/**
 * Draws the sections that are generated from the project's own data, so they
 * stay in step with the chart instead of with the Illustrator file they were
 * once typeset in.
 */
const renderLegend = (
  paper: Paper,
  layout: LegendLayout,
  data: LegendData,
  resources: LegendResources,
): SVGGElement => {
  const group = paper.group();
  const { size, lineHeight, indent } = layout;
  const end = data.codepoint + data.codepointCount - 1;

  const codeBlocks = fit('Code Blocks', (scale) =>
    layOutCodeBlocks(
      blocksIn(resources.blocks, data.codepoint, end),
      layout.codeBlocks,
      stylesAt(resources.fonts, size * scale),
      (layout.codeBlocks.lineHeight ?? lineHeight) * scale,
    ));

  const fontEntries = (scale: number): PlacedLine[] | null => {
    const styles = stylesAt(resources.fonts, size * scale);

    return layOutCredits(
      data.fonts.map((font) =>
        creditRuns(styles, font.name ?? '', font.author ?? 'unknown', font.license ?? 'unknown'),
      ),
      layout.fonts,
      lineHeight * scale,
      indent,
    );
  };

  const materials = (scale: number): PlacedLine[] | null => {
    const styles = stylesAt(resources.fonts, size * scale);

    return layOutCredits(
      materialCredits(materialsFor(data.codepoint, end), styles),
      layout.materials,
      lineHeight * scale,
      indent,
    );
  };

  const statistics = fit('Character Statistics', (scale) =>
    layOutStatistics(
      data.statistics,
      stylesAt(resources.fonts, size * scale),
      layout.statistics.centreX,
      layout.statistics.top,
      lineHeight,
      layout.statistics.width,
    ));

  for (const lines of [
    codeBlocks,
    fit('Fonts in the chart', fontEntries),
    fit('Other Materials', materials),
    statistics,
    fit('Credit of This Poster', (scale) =>
      layOutCredit(resources.fonts, layout.credit, data.credit, scale)),
  ]) {
    group.append(draw(paper, lines));
  }

  return group;
};

export default renderLegend;
