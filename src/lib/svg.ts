import { JSDOM } from 'jsdom';
import type { Matrix } from './matrix.ts';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

/** Sets several attributes at once, skipping the ones that are not given. */
export const setAttributes = (
  element: Element,
  attributes: Record<string, string | number | undefined>,
): void => {
  for (const [name, value] of Object.entries(attributes)) {
    if (value !== undefined) {
      element.setAttribute(name, String(value));
    }
  }
};

export const setTransform = (element: Element, transform: Matrix | string): void => {
  element.setAttribute('transform', transform.toString());
};

/**
 * A minimal SVG document builder backed by jsdom. Newly created elements are
 * appended to the root `<svg>` element until they are moved elsewhere, which is
 * the behaviour the Snap.svg based implementation relied on.
 */
export class Paper {
  private readonly dom: JSDOM;
  private readonly document: Document;
  readonly node: SVGSVGElement;

  constructor(width: number, height: number) {
    this.dom = new JSDOM();
    this.document = this.dom.window.document;
    this.node = this.document.createElementNS(SVG_NAMESPACE, 'svg') as SVGSVGElement;
    setAttributes(this.node, { width, height });
  }

  private create<T extends Element>(
    tagName: string,
    attributes: Record<string, string | number | undefined> = {},
  ): T {
    const element = this.document.createElementNS(SVG_NAMESPACE, tagName);
    setAttributes(element, attributes);
    this.node.append(element);
    return element as unknown as T;
  }

  group(): SVGGElement {
    return this.create<SVGGElement>('g');
  }

  path(pathData: string): SVGPathElement {
    return this.create<SVGPathElement>('path', { d: pathData });
  }

  line(x1: number, y1: number, x2: number, y2: number): SVGLineElement {
    return this.create<SVGLineElement>('line', { x1, y1, x2, y2 });
  }

  rect(x: number, y: number, width: number, height: number): SVGRectElement {
    return this.create<SVGRectElement>('rect', { x, y, width, height });
  }

  /**
   * Parses a standalone SVG document and returns its top level elements,
   * adopted into this paper's document so that they can be appended directly.
   */
  parse(source: string): Element[] {
    const parsed = new this.dom.window.DOMParser().parseFromString(source, 'image/svg+xml');
    const error = parsed.querySelector('parsererror');

    if (error !== null) {
      throw new Error(`Failed to parse SVG: ${error.textContent ?? ''}`);
    }

    return Array.from(parsed.documentElement.children).map(
      (child) => this.document.importNode(child, true) as Element,
    );
  }

  serialize(): string {
    return new this.dom.window.XMLSerializer().serializeToString(this.node);
  }

  close(): void {
    this.dom.window.close();
  }
}
