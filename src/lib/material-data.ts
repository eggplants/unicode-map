import { fontData } from './font-data.ts';

/**
 * Everything on the poster that is neither a chart font nor the author's own
 * work: the images the custom glyphs were traced from, and the typography of
 * the layout itself. It mirrors the Materials list in the README, and its shape
 * follows `fontData`, because both end up in the same kind of credit line.
 */
export type MaterialDefinition = {
  name: string;
  author: string;
  license: string;
  URL?: string;
  /**
   * Code points the material was traced for. An entry without them is part of
   * the poster's own furniture and is credited on every chart.
   */
  codepoints?: number[];
};

/** `SYRIAC LETTER MALAYALAM …`, in code point order from U+0860. */
const SYRIAC_MALAYALAM = [
  'NGA',
  'JA',
  'NYA',
  'TTA',
  'NNA',
  'NNNA',
  'BHA',
  'RA',
  'LLA',
  'LLLA',
  'SSA',
];

/**
 * A font that is credited here rather than in the chart's font list, because it
 * sets the poster instead of drawing code points. The credit itself still comes
 * from `fontData`, so the version number stays in one place.
 */
const asMaterial = (key: string): MaterialDefinition => {
  const definition = fontData[key];

  if (definition?.name === undefined) {
    throw new Error(`No credit for the font ${key}`);
  }

  return {
    name: definition.name,
    author: definition.author ?? 'unknown',
    license: definition.license ?? 'unknown',
    URL: definition.URL,
  };
};

export const materialData: MaterialDefinition[] = [
  {
    name: 'ArmenianEternity.svg',
    author: 'AnonMoos',
    license: 'Public Domain',
    URL: 'https://commons.wikimedia.org/wiki/File:ArmenianEternity.svg',
    codepoints: [0x0588],
  },
  ...SYRIAC_MALAYALAM.map((letter, index) => ({
    name: `SYRIAC-LETTER-MALAYALAM-${letter}.png`,
    author: 'Raamesh',
    license: 'CC BY-SA 4.0',
    URL: `https://en.wikipedia.org/wiki/File:SYRIAC-LETTER-MALAYALAM-${letter}.png`,
    codepoints: [0x0860 + index],
  })),
  {
    name: 'Астрологiчнi цифри сингальського письма. Sinhalese astrological numerals (Sinhala Lith Illakkam).png',
    author: '00',
    license: 'CC0 1.0',
  },
  // Sets the short names inside the control character boxes.
  asMaterial('openSans'),
  {
    name: 'Linux Libertine',
    author: 'Libertine Open Fonts Project and Philipp H. Poll',
    license: 'SIL OFL 1.1',
    URL: 'http://www.linuxlibertine.org/',
  },
  {
    name: 'Cinzel',
    author: 'Natanael Gama',
    license: 'SIL OFL 1.1',
    URL: 'http://ndiscovered.com/cinzel/',
  },
  {
    name: 'Inconsolata',
    author: 'Raph Levien',
    license: 'SIL OFL 1.1',
    URL: 'https://fonts.google.com/specimen/Inconsolata',
  },
  {
    name: 'Swirl Floral Decorative Elements Vector Graphic Set',
    author: 'webdesignhot.com',
    license: 'CC BY 3.0',
  },
];

/** The materials credited on a chart covering `[start, end]`. */
export const materialsFor = (start: number, end: number): MaterialDefinition[] =>
  materialData.filter(
    (material) =>
      material.codepoints === undefined ||
      material.codepoints.some((codepoint) => codepoint >= start && codepoint <= end),
  );
