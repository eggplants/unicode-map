import { describe, expect, it } from 'vite-plus/test';
import codepointBuilder from '../src/lib/codepoint-builder.ts';
import type { CodepointInfo, CodepointSource } from '../src/lib/codepoint-builder.ts';

type Assertion = [
  title: string,
  source: Record<string, CodepointSource>,
  expected: Record<number, CodepointInfo>,
];

const assertions: Assertion[] = [
  [
    'extracts hex key and convert it to number',
    { F1B1: { font: 'testfont' } },
    { 0xf1b1: { type: 'font', fontName: ['testfont'] } },
  ],
  [
    'recognizes codepoints over U+FFFF',
    { D109A: { font: 'testfont' } },
    { 0xd109a: { type: 'font', fontName: ['testfont'] } },
  ],
  [
    'extracts code point range to the series of keys',
    { '0150..0153': { font: 'testfont' } },
    {
      0x0150: { type: 'font', fontName: ['testfont'] },
      0x0151: { type: 'font', fontName: ['testfont'] },
      0x0152: { type: 'font', fontName: ['testfont'] },
      0x0153: { type: 'font', fontName: ['testfont'] },
    },
  ],
  [
    'accepts additional parameters',
    { '535A': { font: 'testfont', codepoint: undefined, scale: 0.5 } },
    { 0x535a: { type: 'font', fontName: ['testfont'], scale: 0.5 } },
  ],
  [
    'supports nested notation',
    {
      '535A..535F': {
        font: 'font1',
        '535B': { font: 'font2' },
        '535D..535E': { font: 'font3' },
      },
    },
    {
      0x535a: { type: 'font', fontName: ['font1'] },
      0x535b: { type: 'font', fontName: ['font2'] },
      0x535c: { type: 'font', fontName: ['font1'] },
      0x535d: { type: 'font', fontName: ['font3'] },
      0x535e: { type: 'font', fontName: ['font3'] },
      0x535f: { type: 'font', fontName: ['font1'] },
    },
  ],
  [
    'recognizes glyphs of type control',
    { '0102': { control: 'NUL' } },
    { 0x0102: { type: 'control', shortName: 'NUL' } },
  ],
  [
    'splats array of short-names into each characters',
    { '535A..535C': { control: ['NUL', 'SP', 'CR'] } },
    {
      0x535a: { type: 'control', shortName: 'NUL' },
      0x535b: { type: 'control', shortName: 'SP' },
      0x535c: { type: 'control', shortName: 'CR' },
    },
  ],
  [
    'splats lines of short-names into each characters',
    { '535A..535C': { control: 'NUL\nSP\n\nCR\n' } },
    {
      0x535a: { type: 'control', shortName: 'NUL' },
      0x535b: { type: 'control', shortName: 'SP' },
      0x535c: { type: 'control', shortName: 'CR' },
    },
  ],
  ['recognizes glyphs of type svg', { '0102': { svg: true } }, { 0x0102: { type: 'svg' } }],
  ['recognizes glyphs of type notdef', { '0102': 'notdef' }, { 0x0102: { type: 'notdef' } }],
];

describe('Code Point Builder', () => {
  for (const [title, source, expected] of assertions) {
    it(title, () => {
      expect(Object.fromEntries(codepointBuilder(source))).toEqual(expected);
    });
  }
});
