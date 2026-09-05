declare module 'opentype.js' {
  export class Path {
    toPathData(decimalPlaces?: number): string;
  }

  export class Glyph {
    unicode?: number;
    advanceWidth: number;
    getPath(x?: number, y?: number, fontSize?: number): Path;
  }

  export class Font {
    unitsPerEm: number;
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
