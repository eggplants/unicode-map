import type { Font, Glyph } from 'opentype.js';
import { toPathData } from '../svg.ts';

/**
 * A font stack rendered at one size. The first font that actually has the
 * character wins, which is how the `・` bullets and the Cyrillic caption fall
 * back to Noto while the rest of the line stays in Linux Libertine.
 */
export type TextStyle = {
  fonts: Font[];
  size: number;
};

/** A stretch of text sharing one style. A line is a list of these. */
export type TextRun = {
  text: string;
  style: TextStyle;
};

type PositionedGlyph = {
  font: Font;
  glyph: Glyph;
  size: number;
  /** Advance of this glyph, kerning against its successor included. */
  advance: number;
};

/**
 * `Font.stringToGlyphs` runs opentype.js 2.0.0's shaper, which throws on Linux
 * Libertine's `ccmp` lookups (`substitutionType : 62 lookupType: 6`). The
 * legend is plain text in a handful of scripts, so the characters are mapped
 * one at a time and kerned by hand instead.
 */
const glyphFor = (style: TextStyle, character: string): { font: Font; glyph: Glyph } => {
  for (const font of style.fonts) {
    const glyph = font.charToGlyph(character);

    if (glyph.index !== 0) {
      return { font, glyph };
    }
  }

  const font = style.fonts[0]!;

  return { font, glyph: font.charToGlyph(character) };
};

const layOutRuns = (runs: TextRun[]): PositionedGlyph[] => {
  const positioned: PositionedGlyph[] = [];

  for (const run of runs) {
    for (const character of run.text) {
      const { font, glyph } = glyphFor(run.style, character);
      const previous = positioned.at(-1);

      // Kerning pairs only exist within a single font.
      if (previous !== undefined && previous.font === font) {
        previous.advance +=
          (font.getKerningValue(previous.glyph, glyph) / font.unitsPerEm) * run.style.size;
      }

      positioned.push({
        font,
        glyph,
        size: run.style.size,
        advance: (glyph.advanceWidth / font.unitsPerEm) * run.style.size,
      });
    }
  }

  return positioned;
};

/** Advance width of a line, in the layout's points. */
export const measureRuns = (runs: TextRun[]): number =>
  layOutRuns(runs).reduce((total, glyph) => total + glyph.advance, 0);

/**
 * Outlines a line of text into a single `d` attribute. One path per line keeps
 * the poster far smaller than the per-glyph paths Illustrator exports.
 */
export const runsToPathData = (runs: TextRun[], x: number, y: number): string => {
  let pen = x;
  let pathData = '';

  for (const positioned of layOutRuns(runs)) {
    // A space outlines to nothing, so only its advance moves the pen on.
    pathData += toPathData(positioned.glyph.getPath(pen, y, positioned.size));
    pen += positioned.advance;
  }

  return pathData;
};

/**
 * Greedily breaks `runs` so that no line is wider than `width`. Only the space
 * between words is a break opportunity, and the styling of each word is kept,
 * so a bold font name never spills its weight onto the following credit.
 */
export const wrapRuns = (runs: TextRun[], width: number, indent: number): TextRun[][] => {
  const words: TextRun[] = runs.flatMap((run) =>
    run.text
      .split(/(\s+)/)
      .filter((word) => word.length > 0)
      .map((word) => ({ text: word, style: run.style })),
  );

  const lines: TextRun[][] = [];
  let line: TextRun[] = [];

  for (const word of words) {
    const isSpace = word.text.trim().length === 0;

    if (isSpace && line.length === 0) {
      continue;
    }

    const candidate = [...line, word];
    const available = width - (lines.length === 0 ? 0 : indent);

    if (line.length > 0 && !isSpace && measureRuns(candidate) > available) {
      lines.push(line);
      line = [word];
      continue;
    }

    line = candidate;
  }

  if (line.length > 0) {
    lines.push(line);
  }

  return lines;
};
