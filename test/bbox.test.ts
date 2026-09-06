import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vite-plus/test';
import { boxOf, contains, overlaps } from '../src/lib/bbox.ts';

const element = (markup: string): Element => {
  const dom = new JSDOM(`<svg xmlns="http://www.w3.org/2000/svg">${markup}</svg>`, {
    contentType: 'image/svg+xml',
  });

  return dom.window.document.documentElement.firstElementChild!;
};

type Assertion = [title: string, markup: string, expected: [number, number, number, number]];

const assertions: Assertion[] = [
  ['reads absolute line commands', '<path d="M10 20L30 60Z"/>', [10, 20, 20, 40]],
  ['follows relative line commands', '<path d="m10 20l20 40"/>', [10, 20, 20, 40]],
  ['takes horizontal and vertical commands along', '<path d="M10 20H50V80"/>', [10, 20, 40, 60]],
  [
    // The hull of a Bezier contains it, so control points may widen the box.
    'covers a curve with its control points',
    '<path d="M0 0C10 -10 20 30 30 0"/>',
    [0, -10, 30, 40],
  ],
  // Without the reset the trailing `h10` would run from x=30 and widen the box.
  ['returns to the subpath start on close', '<path d="M10 10H30Zh10"/>', [10, 10, 20, 0]],
  ['reads a polyline', '<polyline points="5 5 15 25 10 0"/>', [5, 0, 10, 25]],
  ['reads a rect', '<rect x="4" y="6" width="10" height="20"/>', [4, 6, 10, 20]],
  ['reads a circle', '<circle cx="10" cy="10" r="4"/>', [6, 6, 8, 8]],
  ['reads a line', '<line x1="1" y1="2" x2="9" y2="4"/>', [1, 2, 8, 2]],
  [
    'unions the children of a group',
    '<g><rect x="0" y="0" width="5" height="5"/><rect x="20" y="10" width="5" height="5"/></g>',
    [0, 0, 25, 15],
  ],
];

describe('boxOf', () => {
  for (const [title, markup, [x, y, width, height]] of assertions) {
    it(title, () => {
      expect(boxOf(element(markup))).toEqual({ x, y, width, height });
    });
  }

  it('returns null for an element that draws nothing', () => {
    expect(boxOf(element('<g/>'))).toBeNull();
  });
});

describe('contains', () => {
  const outer = { x: 0, y: 0, width: 100, height: 100 };

  it('accepts a box inside', () => {
    expect(contains(outer, { x: 10, y: 10, width: 10, height: 10 })).toBe(true);
  });

  it('accepts a box flush with the edges', () => {
    expect(contains(outer, outer)).toBe(true);
  });

  it('rejects a box that pokes out', () => {
    expect(contains(outer, { x: 95, y: 10, width: 10, height: 10 })).toBe(false);
  });
});

describe('overlaps', () => {
  const box = { x: 0, y: 0, width: 10, height: 10 };

  it('sees a partial overlap', () => {
    expect(overlaps(box, { x: 5, y: 5, width: 10, height: 10 })).toBe(true);
  });

  it('does not count touching edges', () => {
    expect(overlaps(box, { x: 10, y: 0, width: 10, height: 10 })).toBe(false);
  });
});
