import fs from 'node:fs/promises';
import path from 'node:path';
import { Hilbert2d } from 'hilbert';
import opentype from 'opentype.js';
import type { Font, Glyph } from 'opentype.js';
import Progress from 'progress';
import type { PosterConfig } from '../configs.ts';
import type { CodepointInfo } from './codepoint-builder.ts';
import { fontData } from './font-data.ts';
import type { FontUsage } from './legend/index.ts';
import { Matrix, parseTransform } from './matrix.ts';
import { Paper, setAttributes, setTransform, toPathData } from './svg.ts';
import { camelCase, fromRoot, log, toHex } from './util.ts';

/** Side length of a single glyph cell, in chart units. */
const BLOCK_SIZE = 30;
/** The chart is a 128x128 square of the Hilbert curve. */
const CHART_SIZE = 128;
const HILBERT_ORDER = 256;
/** Glyph outlines in `data/glyphs` are authored on a 2048 unit em square. */
const CUSTOM_GLYPH_EM = 2048;
const CONTROL_TEXT_SIZE = 768;
const ANCHOR_SIZE = 2;

type GlyphInfo = { name: string; font: Font; glyph: Glyph };

/** The chart, plus the tallies the poster's legend is written from. */
export type Chart = {
  svg: string;
  /** Fonts drawn on the chart, most used first. */
  fonts: FontUsage[];
  statistics: {
    codepoints: number;
    /** Code points that carry a glyph, minus the ones Unicode has yet to encode. */
    defined: number;
    early: number;
  };
};

const loadFonts = async (): Promise<Record<string, Font>> => {
  const entries = await Promise.all(
    Object.entries(fontData)
      .filter(([, definition]) => definition.path !== undefined)
      .map(async ([name, definition]) => {
        const file = await fs.readFile(fromRoot('fonts', definition.path!));
        const font = opentype.parse(file);

        if (definition.variation !== undefined) {
          font.variation.set(definition.variation);
        }

        return [name, font] as const;
      }),
  );

  log('All fonts loaded.');

  return Object.fromEntries(entries);
};

const loadGlyphs = async (): Promise<Record<string, string>> => {
  const glyphsDir = fromRoot('data', 'glyphs');
  const files = await fs.readdir(glyphsDir);

  const entries = await Promise.all(
    files
      .filter((file) => path.extname(file) === '.svg')
      .map(async (file) => {
        const glyph = await fs.readFile(path.join(glyphsDir, file), 'utf8');
        return [camelCase(path.basename(file, '.svg')), glyph] as const;
      }),
  );

  log('All glyphs loaded.');

  return Object.fromEntries(entries);
};

/**
 * Composes the cell transform: `translate` to the cell, then optionally apply
 * the glyph's own transform around the centre of the cell.
 *
 * SVG transform operations are applied last-in-first-out.
 * http://stackoverflow.com/q/27635272
 */
const cellTransform = (x: number, y: number, transform: string | undefined): Matrix => {
  const matrix = new Matrix();

  matrix.translate(x * BLOCK_SIZE, y * BLOCK_SIZE);

  if (transform !== undefined) {
    matrix.scale(BLOCK_SIZE);
    matrix.translate(0.5, 0.5);
    matrix.addMatrix(parseTransform(transform));
    matrix.translate(-0.5, -0.5);
    matrix.scale(1 / BLOCK_SIZE);
  }

  return matrix;
};

const selectGlyph = (glyphInfos: GlyphInfo[], fontNames: string[]): GlyphInfo | undefined => {
  if (fontNames.length === 1) {
    const name = camelCase(fontNames[0]!);
    return glyphInfos.find((info) => info.name === name);
  }

  const names = fontNames.map(camelCase);
  const name = names.find((candidate) =>
    glyphInfos.some((info) => info.name === candidate && info.glyph.unicode !== undefined),
  );

  return glyphInfos.find((info) => info.name === name);
};

const generateSvg = async (
  codepointInfos: Map<number, CodepointInfo>,
  config: PosterConfig,
): Promise<Chart> => {
  const [fonts, customGlyphs] = await Promise.all([loadFonts(), loadGlyphs()]);

  const hilbert = new Hilbert2d(HILBERT_ORDER);
  const paper = new Paper(CHART_SIZE * BLOCK_SIZE, CHART_SIZE * BLOCK_SIZE);

  let pathString = '';

  const progress = new Progress('Generating... [:bar] :current glyphs :elapseds', {
    incomplete: ' ',
    width: 40,
    total: CHART_SIZE * CHART_SIZE,
  });

  const anchors = paper.group();
  const glyphs = paper.group();

  let definedCharacters = 0;
  let earlyMappedCharacters = 0;

  const fontCounts = new Map<string, number>();
  const startXy = hilbert.xy(config.codepoint);

  for (
    let codePoint = config.codepoint;
    codePoint < config.codepoint + CHART_SIZE * CHART_SIZE;
    codePoint++
  ) {
    const { x: hilbertX, y: hilbertY } = hilbert.xy(codePoint);
    const x = hilbertX - startXy.x;
    const y = hilbertY - startXy.y;

    const codepointInfo = codepointInfos.get(codePoint);

    if (codepointInfo === undefined) {
      continue;
    }

    if (codepointInfo.type !== 'notdef') {
      definedCharacters++;
    }

    if (codepointInfo.early === true) {
      earlyMappedCharacters++;
    }

    /** Draws one of the boxes shipped in `data/glyphs` over the current cell. */
    const drawCustomGlyph = (source: string, em: number): SVGGElement => {
      const group = paper.group();
      group.append(...paper.parse(source));
      setTransform(
        group,
        `translate(${x * BLOCK_SIZE} ${y * BLOCK_SIZE}) scale(${BLOCK_SIZE / em})`,
      );
      return group;
    };

    if (codepointInfo.type === 'notdef') {
      glyphs.append(drawCustomGlyph(customGlyphs.notdef!, CUSTOM_GLYPH_EM));
    } else if (codepointInfo.type === 'tofu') {
      glyphs.append(drawCustomGlyph(customGlyphs.tofu!, CUSTOM_GLYPH_EM));
    } else if (codepointInfo.type === 'control') {
      const controlBoxGroup = paper.group();

      // Draw box
      controlBoxGroup.append(...paper.parse(customGlyphs.controlBox!));

      // Draw text
      const textFont = fonts.openSans!;
      const lines = codepointInfo.shortName.split('\\n');

      for (const [lineIndex, line] of lines.entries()) {
        const textPath = toPathData(textFont.getPath(line, 1024, 1024, CONTROL_TEXT_SIZE));
        const text = paper.path(textPath);
        const textWidth = textFont
          .stringToGlyphs(line)
          .reduce(
            (total, glyph) =>
              total + (glyph.advanceWidth / textFont.unitsPerEm) * CONTROL_TEXT_SIZE,
            0,
          );

        setTransform(
          text,
          `translate(${-textWidth / 2} ${(lineIndex - lines.length / 2 + 0.85) * CONTROL_TEXT_SIZE})`,
        );
        controlBoxGroup.append(text);
      }

      setTransform(
        controlBoxGroup,
        `translate(${x * BLOCK_SIZE} ${y * BLOCK_SIZE}) scale(${BLOCK_SIZE / CUSTOM_GLYPH_EM})`,
      );

      glyphs.append(controlBoxGroup);
    } else if (codepointInfo.type === 'svg') {
      const svgFontGroup = paper.group();
      const svgGroup = paper.group();

      svgGroup.append(...paper.parse(customGlyphs[`u${toHex(codePoint)}`]!));

      const transform = cellTransform(x, y, codepointInfo.transform);
      transform.scale(BLOCK_SIZE / 1024);
      setTransform(svgGroup, transform);

      svgFontGroup.append(svgGroup);

      if (codepointInfo.box) {
        svgFontGroup.append(drawCustomGlyph(customGlyphs.controlBox!, CUSTOM_GLYPH_EM));
      }

      if (codepointInfo.combining) {
        svgFontGroup.append(drawCustomGlyph(customGlyphs.combiningCircle!, 1024));
      }

      glyphs.append(svgFontGroup);
    } else {
      const glyphInfos: GlyphInfo[] = Object.entries(fonts).map(([name, font]) => ({
        name,
        font,
        glyph: font.charToGlyph(String.fromCodePoint(codepointInfo.codepoint || codePoint)),
      }));

      const glyphInfo =
        codepointInfo.type === 'font'
          ? selectGlyph(glyphInfos, codepointInfo.fontName)
          : process.env.DEBUG === 'true'
            ? glyphInfos.find((info) => info.glyph.unicode !== undefined)
            : undefined;

      if (glyphInfo !== undefined) {
        const fontGroup = paper.group();

        const width = (glyphInfo.glyph.advanceWidth / glyphInfo.font.unitsPerEm) * BLOCK_SIZE;
        const glyphPath = toPathData(
          glyphInfo.glyph.getPath((BLOCK_SIZE - width) / 2, 25, BLOCK_SIZE),
        );
        const glyphElement = paper.path(glyphPath);

        const fontCountName = glyphInfo.name.startsWith('noto')
          ? 'noto'
          : glyphInfo.name === 'scheherazadeBold'
            ? 'scheherazade'
            : glyphInfo.name;

        fontCounts.set(fontCountName, (fontCounts.get(fontCountName) ?? 0) + 1);

        setTransform(glyphElement, cellTransform(x, y, codepointInfo.transform));

        fontGroup.append(glyphElement);

        if (codepointInfo.combining) {
          fontGroup.append(drawCustomGlyph(customGlyphs.combiningCircle!, 1024));
        }

        if (codepointInfo.box) {
          fontGroup.append(drawCustomGlyph(customGlyphs.controlBox!, CUSTOM_GLYPH_EM));
        }

        glyphs.append(fontGroup);
      }
    }

    const anchorGroup = paper.group();

    if (x !== 0x7f) {
      anchorGroup.append(paper.line(BLOCK_SIZE, 0, BLOCK_SIZE, ANCHOR_SIZE));
      anchorGroup.append(paper.line(BLOCK_SIZE, BLOCK_SIZE - ANCHOR_SIZE, BLOCK_SIZE, BLOCK_SIZE));
    }

    if (y !== 0x7f) {
      anchorGroup.append(paper.line(0, BLOCK_SIZE, ANCHOR_SIZE, BLOCK_SIZE));
      anchorGroup.append(paper.line(BLOCK_SIZE - ANCHOR_SIZE, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE));
    }

    if (x % 16 === 0 && x !== 0 && y % 16 === 0 && y !== 0) {
      const bigAnchor = paper.rect(-ANCHOR_SIZE, -ANCHOR_SIZE, ANCHOR_SIZE * 2, ANCHOR_SIZE * 2);
      setTransform(bigAnchor, 'rotate(45)');
      anchorGroup.append(bigAnchor);
    }

    setTransform(anchorGroup, `translate(${x * BLOCK_SIZE} ${y * BLOCK_SIZE})`);
    anchors.append(anchorGroup);

    const command = pathString.length === 0 ? 'M' : 'L';
    pathString += `${command} ${(x + 0.5) * BLOCK_SIZE} ${(y + 0.5) * BLOCK_SIZE} `;

    if ((codePoint + 1) % CHART_SIZE === 0) {
      progress.tick(CHART_SIZE);
    }
  }

  setAttributes(anchors, { 'stroke-width': '0.5px', stroke: 'black' });

  const curve = paper.path(pathString);
  setAttributes(curve, {
    fill: 'none',
    stroke: 'black',
    'stroke-opacity': 0.3,
    'stroke-width': 0.5,
  });
  paper.node.prepend(curve);

  setAttributes(paper.node, {
    viewBox: `0 0 ${CHART_SIZE * BLOCK_SIZE} ${CHART_SIZE * BLOCK_SIZE}`,
    width: CHART_SIZE * BLOCK_SIZE * 2,
    height: CHART_SIZE * BLOCK_SIZE * 2,
  });

  const fontCountsList = Array.from(fontCounts).sort((a, b) => b[1] - a[1]);
  /**
   * Separate cuts of one family carry the same credit, so they are one line of
   * the poster's font list: `FreeSerif` and `FreeSerifBold` both credit GNU
   * FreeFont, and only their glyph counts differ.
   */
  const fontUsages: FontUsage[] = Array.from(
    fontCountsList
      .reduce((usages, [fontName, count]) => {
        const definition = {
          name: fontName,
          author: 'unknown',
          license: 'unknown',
          ...fontData[fontName],
        };
        const credit = `${definition.name}\u0000${definition.author}\u0000${definition.license}`;
        const existing = usages.get(credit);

        usages.set(
          credit,
          existing === undefined
            ? { ...definition, count }
            : { ...existing, count: existing.count + count },
        );

        return usages;
      }, new Map<string, FontUsage>())
      .values(),
  ).sort((a, b) => b.count - a.count);
  const fontLicenseText = fontCountsList
    .map(([fontName]) => {
      const font = fontData[fontName];
      return `${font?.name ?? fontName} by ${font?.author ?? 'unknown'} licensed under ${font?.license ?? 'unknown'}`;
    })
    .join('\n');
  const fontCountText = fontCountsList
    .map(([fontName, fontCount]) => {
      const font = fontData[fontName];
      return `${font?.name ?? fontName}: ${fontCount}`;
    })
    .join('\n');

  console.log(`
====== License notation ======

${fontLicenseText}`);

  console.log(`
====== Glyph count ======

${fontCountText}`);

  console.log(`
====== Statistics ======
`);

  console.log(`Defined Characters: ${definedCharacters}`);
  console.log(`Early Mapped Characters: ${earlyMappedCharacters}`);

  log('Rendering SVG...');

  const svg = paper.serialize();
  paper.close();

  return {
    svg,
    fonts: fontUsages,
    statistics: {
      codepoints: CHART_SIZE * CHART_SIZE,
      // The early mapped ones are not in the published standard yet.
      defined: definedCharacters - earlyMappedCharacters,
      early: earlyMappedCharacters,
    },
  };
};

export default generateSvg;
