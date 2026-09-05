import { mergeMaps } from './util.ts';

/** Rendering hints that may be attached to any glyph definition. */
export type GlyphOptions = {
  transform?: string;
  scale?: number | string;
  skew?: number | string;
  translate?: number | string;
  rotate?: number | string;
  combining?: boolean;
  box?: boolean;
  early?: boolean;
};

export type CodepointInfo = GlyphOptions &
  (
    | { type: 'notdef' }
    | { type: 'tofu' }
    | { type: 'svg' }
    | { type: 'font'; fontName: string[]; codepoint?: number }
    | { type: 'control'; shortName: string }
  );

/** A code point definition as it is written in `data/codepoints/*.yml`. */
export type CodepointSource = string | Record<string, unknown>;

const GLYPH_OPTIONS = [
  'transform',
  'scale',
  'skew',
  'translate',
  'rotate',
  'combining',
  'box',
  'early',
] as const satisfies readonly (keyof GlyphOptions)[];

const CODEPOINT_KEY = /^[\da-f]{4,5}$/i;

/**
 * The per-code-point model before the range is expanded. `codepoint` and
 * `shortName` may still hold the whole array that gets splatted over the range.
 */
type CodepointModel = GlyphOptions &
  (
    | { type: 'notdef' }
    | { type: 'tofu' }
    | { type: 'svg' }
    | { type: 'font'; fontName: string[]; codepoint?: number | number[] }
    | { type: 'control'; shortName: string | string[] }
  );

const buildModel = (source: CodepointSource): CodepointModel => {
  if (source === 'notdef') {
    return { type: 'notdef' };
  }

  if (source === 'tofu') {
    return { type: 'tofu' };
  }

  if (typeof source !== 'object' || source === null) {
    throw new Error('Type not specified');
  }

  let model: CodepointModel;

  if (Object.hasOwn(source, 'font')) {
    const font = source.font;
    model = {
      type: 'font',
      fontName: Array.isArray(font) ? (font as string[]) : [font as string],
      codepoint: source.codepoint as number | number[] | undefined,
    };
  } else if (Object.hasOwn(source, 'control')) {
    const control = source.control as string | string[];
    model = {
      type: 'control',
      shortName:
        typeof control === 'string'
          ? control.split('\n').filter((line) => line.length > 0)
          : control,
    };
  } else if (Object.hasOwn(source, 'svg')) {
    model = { type: 'svg' };
  } else {
    throw new Error('Type not specified');
  }

  if (model.type === 'font' || model.type === 'svg') {
    for (const option of GLYPH_OPTIONS) {
      const value = source[option];
      if (value !== undefined && value !== null) {
        (model as GlyphOptions)[option] = value as never;
      }
    }
  }

  return model;
};

const parseRange = (key: string): [number, number] => {
  const codepoints = key.split('..').map((codepoint) => Number.parseInt(codepoint, 16));
  return codepoints.length === 1
    ? [codepoints[0]!, codepoints[0]!]
    : [codepoints[0]!, codepoints[1]!];
};

const flatten = (
  source: CodepointSource,
  start: number,
  end: number,
): Map<number, CodepointInfo> => {
  const model = buildModel(source);
  const map = new Map<number, CodepointInfo>();

  // Calculate overrides first
  if (typeof source === 'object') {
    for (const [key, value] of Object.entries(source)) {
      if (!key.split('..').every((codepoint) => CODEPOINT_KEY.test(codepoint))) {
        continue;
      }

      const [submapStart, submapEnd] = parseRange(key);
      const submap = flatten(value as CodepointSource, submapStart, submapEnd);

      for (let codepoint = submapStart; codepoint <= submapEnd; codepoint++) {
        map.set(codepoint, submap.get(codepoint)!);
      }
    }
  }

  // Interpolate by models
  for (let codepoint = start; codepoint <= end; codepoint++) {
    if (map.has(codepoint)) {
      continue;
    }

    const clone = { ...model };

    if (clone.type === 'font' && Array.isArray(clone.codepoint)) {
      clone.codepoint = clone.codepoint[codepoint - start];
    }

    if (clone.type === 'control' && Array.isArray(clone.shortName)) {
      clone.shortName = clone.shortName[codepoint - start]!;
    }

    map.set(codepoint, clone as CodepointInfo);
  }

  return map;
};

const codepointBuilder = (source: Record<string, CodepointSource>): Map<number, CodepointInfo> =>
  mergeMaps(
    Object.entries(source).map(([key, value]) => {
      const [start, end] = parseRange(key);
      return flatten(value, start, end);
    }),
  );

export default codepointBuilder;
