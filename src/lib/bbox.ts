/** An axis aligned box in the layout's coordinates. */
export type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Extent = { x0: number; y0: number; x1: number; y1: number };

const EMPTY: Extent = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };

const NUMBER = /[+-]?(?:\d*\.\d+|\d+\.?)(?:e[+-]?\d+)?/gi;
const COMMAND = /[MmLlHhVvCcSsQqTtAaZz]/g;

const add = (extent: Extent, x: number, y: number): Extent => ({
  x0: Math.min(extent.x0, x),
  y0: Math.min(extent.y0, y),
  x1: Math.max(extent.x1, x),
  y1: Math.max(extent.y1, y),
});

/**
 * Walks a path's commands for the points it passes through and the control
 * points that pull it. Bézier hulls contain their curves, so the result is
 * never too small — which is all the layout stripping needs, since it only ever
 * asks whether an element sits wholly inside a section's slot.
 */
const pathExtent = (pathData: string): Extent => {
  const tokens = pathData.matchAll(new RegExp(`${COMMAND.source}|${NUMBER.source}`, 'gi'));

  let extent = EMPTY;
  let command = '';
  let numbers: number[] = [];
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;

  /** Consumes one command's worth of arguments once they have all arrived. */
  const flush = (): void => {
    const relative = command === command.toLowerCase();
    const base = command.toUpperCase();

    switch (base) {
      case 'M':
      case 'L':
      case 'T':
        for (let index = 0; index + 1 < numbers.length; index += 2) {
          x = (relative ? x : 0) + numbers[index]!;
          y = (relative ? y : 0) + numbers[index + 1]!;
          extent = add(extent, x, y);

          if (base === 'M' && index === 0) {
            startX = x;
            startY = y;
          }
        }
        break;
      case 'H':
        for (const value of numbers) {
          x = (relative ? x : 0) + value;
          extent = add(extent, x, y);
        }
        break;
      case 'V':
        for (const value of numbers) {
          y = (relative ? y : 0) + value;
          extent = add(extent, x, y);
        }
        break;
      case 'C':
      case 'S':
      case 'Q':
      case 'A': {
        // Arc parameters are not coordinates, but its end point is the last pair.
        const stride = { C: 6, S: 4, Q: 4, A: 7 }[base]!;

        for (let index = 0; index + stride <= numbers.length; index += stride) {
          const pairs = base === 'A' ? [[numbers[index + 5]!, numbers[index + 6]!]] : [];

          if (base !== 'A') {
            for (let pair = 0; pair < stride; pair += 2) {
              pairs.push([numbers[index + pair]!, numbers[index + pair + 1]!]);
            }
          }

          for (const [pairX, pairY] of pairs) {
            extent = add(extent, (relative ? x : 0) + pairX!, (relative ? y : 0) + pairY!);
          }

          const [endX, endY] = pairs.at(-1)!;
          x = (relative ? x : 0) + endX!;
          y = (relative ? y : 0) + endY!;
        }
        break;
      }
      case 'Z':
        x = startX;
        y = startY;
        break;
      default:
        break;
    }

    numbers = [];
  };

  for (const [token] of tokens) {
    if (/[a-z]/i.test(token)) {
      if (command !== '') {
        flush();
      }

      command = token;
    } else {
      numbers.push(Number(token));
    }
  }

  if (command !== '') {
    flush();
  }

  return extent;
};

const pointsExtent = (points: string): Extent => {
  const numbers = Array.from(points.matchAll(NUMBER), ([token]) => Number(token));

  let extent = EMPTY;

  for (let index = 0; index + 1 < numbers.length; index += 2) {
    extent = add(extent, numbers[index]!, numbers[index + 1]!);
  }

  return extent;
};

const attribute = (element: Element, name: string): number =>
  Number(element.getAttribute(name) ?? '0');

const extentOf = (element: Element): Extent => {
  switch (element.tagName) {
    case 'path':
      return pathExtent(element.getAttribute('d') ?? '');
    case 'polyline':
    case 'polygon':
      return pointsExtent(element.getAttribute('points') ?? '');
    case 'rect': {
      const x = attribute(element, 'x');
      const y = attribute(element, 'y');
      return add(
        add(EMPTY, x, y),
        x + attribute(element, 'width'),
        y + attribute(element, 'height'),
      );
    }
    case 'line':
      return add(
        add(EMPTY, attribute(element, 'x1'), attribute(element, 'y1')),
        attribute(element, 'x2'),
        attribute(element, 'y2'),
      );
    case 'circle':
    case 'ellipse': {
      const x = attribute(element, 'cx');
      const y = attribute(element, 'cy');
      const radiusX = attribute(element, 'r') || attribute(element, 'rx');
      const radiusY = attribute(element, 'r') || attribute(element, 'ry');
      return add(add(EMPTY, x - radiusX, y - radiusY), x + radiusX, y + radiusY);
    }
    default: {
      let extent = EMPTY;

      for (const child of element.children) {
        const childExtent = extentOf(child);

        if (Number.isFinite(childExtent.x0)) {
          extent = add(add(extent, childExtent.x0, childExtent.y0), childExtent.x1, childExtent.y1);
        }
      }

      return extent;
    }
  }
};

/**
 * The box an element covers, or `null` when it draws nothing. Transforms are
 * not applied: the layouts are Illustrator exports with flattened coordinates.
 */
export const boxOf = (element: Element): Box | null => {
  const extent = extentOf(element);

  if (!Number.isFinite(extent.x0)) {
    return null;
  }

  return {
    x: extent.x0,
    y: extent.y0,
    width: extent.x1 - extent.x0,
    height: extent.y1 - extent.y0,
  };
};

export const overlaps = (a: Box, b: Box): boolean =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

export const contains = (outer: Box, inner: Box): boolean =>
  inner.x >= outer.x &&
  inner.y >= outer.y &&
  inner.x + inner.width <= outer.x + outer.width &&
  inner.y + inner.height <= outer.y + outer.height;
