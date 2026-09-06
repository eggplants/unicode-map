import fs from 'node:fs/promises';
import opentype from 'opentype.js';
import type { Font } from 'opentype.js';
import { fromRoot } from '../util.ts';

/**
 * The typography of the printed layout, so that the generated sections set
 * flush with the headings that stay baked into `data/layouts`. Illustrator used
 * the Graphite build (`Linux Libertine G`); the OpenType build downloaded here
 * shares its outlines and metrics.
 */
const LEGEND_FONT_FILES = {
  regular: 'LinuxLibertine/LinLibertine_Rah.ttf',
  italic: 'LinuxLibertine/LinLibertine_RIah.ttf',
  semibold: 'LinuxLibertine/LinLibertine_RZah.ttf',
} as const;

/** Noto Sans JP covers the `・` bullets and the Cyrillic credit; the layout set those bold. */
const FALLBACK_FONT_FILE = 'Noto/NotoSansJP[wght].ttf';
const FALLBACK_WEIGHT = 700;

export type LegendFonts = {
  regular: Font;
  italic: Font;
  semibold: Font;
  fallback: Font;
};

const loadFont = async (file: string): Promise<Font> =>
  opentype.parse(await fs.readFile(fromRoot('fonts', file)));

const loadLegendFonts = async (): Promise<LegendFonts> => {
  const [regular, italic, semibold, fallback] = await Promise.all([
    loadFont(LEGEND_FONT_FILES.regular),
    loadFont(LEGEND_FONT_FILES.italic),
    loadFont(LEGEND_FONT_FILES.semibold),
    loadFont(FALLBACK_FONT_FILE),
  ]);

  fallback.variation.set({ wght: FALLBACK_WEIGHT });

  return { regular, italic, semibold, fallback };
};

export default loadLegendFonts;
