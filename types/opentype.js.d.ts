declare module 'opentype.js' {
  export type PathDataOptions = {
    decimalPlaces?: number;
    optimize?: boolean;
    /** Defaults to `true`, which mirrors the outline about its bounding box. */
    flipY?: boolean;
    flipYBase?: number;
  };

  export class Path {
    toPathData(options?: PathDataOptions | number): string;
  }

  export class Glyph {
    unicode?: number;
    advanceWidth: number;
    getPath(x?: number, y?: number, fontSize?: number): Path;
  }

  export type VariationManager = {
    set(instance: number | Record<string, number>): void;
  };

  export class Font {
    unitsPerEm: number;
    variation: VariationManager;
    charToGlyph(character: string): Glyph;
    stringToGlyphs(text: string): Glyph[];
    getPath(text: string, x?: number, y?: number, fontSize?: number): Path;
  }

  export function parse(buffer: ArrayBuffer | Uint8Array, options?: Record<string, unknown>): Font;

  /** The package ships only a CommonJS build, so it is imported by default. */
  const opentype: {
    parse: typeof parse;
    Font: typeof Font;
    Glyph: typeof Glyph;
    Path: typeof Path;
  };

  export default opentype;
}
