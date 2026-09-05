const rad = (degree: number): number => (degree * Math.PI) / 180;

/**
 * Affine transformation matrix, mirroring the semantics of `Snap.Matrix` that
 * this project used to build its transforms with.
 */
export class Matrix {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;

  constructor(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
  }

  /** Post-multiplies this matrix by the given one. */
  add(a: number, b: number, c: number, d: number, e: number, f: number): this {
    const { a: sa, b: sb, c: sc, d: sd, e: se, f: sf } = this;

    this.a = sa * a + sc * b;
    this.b = sb * a + sd * b;
    this.c = sa * c + sc * d;
    this.d = sb * c + sd * d;
    this.e = sa * e + sc * f + se;
    this.f = sb * e + sd * f + sf;

    return this;
  }

  addMatrix(matrix: Matrix): this {
    return this.add(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
  }

  translate(x: number, y: number): this {
    return this.add(1, 0, 0, 1, x, y);
  }

  scale(x: number, y: number = x, cx = 0, cy = 0): this {
    if (cx !== 0 || cy !== 0) {
      this.add(1, 0, 0, 1, cx, cy);
    }

    this.add(x, 0, 0, y, 0, 0);

    if (cx !== 0 || cy !== 0) {
      this.add(1, 0, 0, 1, -cx, -cy);
    }

    return this;
  }

  rotate(degree: number, x = 0, y = 0): this {
    const angle = rad(degree);
    const cos = Number(Math.cos(angle).toFixed(9));
    const sin = Number(Math.sin(angle).toFixed(9));

    this.add(cos, sin, -sin, cos, x, y);
    this.add(1, 0, 0, 1, -x, -y);

    return this;
  }

  toString(): string {
    const components = [this.a, this.b, this.c, this.d, this.e, this.f];
    return `matrix(${components.map((value) => Number(value.toFixed(4))).join(',')})`;
  }
}

const TRANSFORM_FUNCTION = /([a-zA-Z]+)\s*\(([^)]*)\)/g;

/** Reduces an SVG `transform` attribute value into a single matrix. */
export const parseTransform = (transform: string): Matrix => {
  const matrix = new Matrix();

  for (const [, name, rawParams] of transform.matchAll(TRANSFORM_FUNCTION)) {
    const params = (rawParams ?? '')
      .trim()
      .split(/\s*,\s*|\s+/)
      .filter((param) => param.length > 0)
      .map(Number);

    switch (name) {
      case 'translate':
        matrix.translate(params[0] ?? 0, params[1] ?? 0);
        break;
      case 'scale':
        matrix.scale(params[0] ?? 1, params[1] ?? params[0] ?? 1);
        break;
      case 'rotate':
        matrix.rotate(params[0] ?? 0, params[1] ?? 0, params[2] ?? 0);
        break;
      case 'skewX':
        matrix.add(1, 0, Math.tan(rad(params[0] ?? 0)), 1, 0, 0);
        break;
      case 'skewY':
        matrix.add(1, Math.tan(rad(params[0] ?? 0)), 0, 1, 0, 0);
        break;
      case 'matrix':
        matrix.add(
          params[0] ?? 1,
          params[1] ?? 0,
          params[2] ?? 0,
          params[3] ?? 1,
          params[4] ?? 0,
          params[5] ?? 0,
        );
        break;
      default:
        throw new Error(`Unsupported transform function: ${name}`);
    }
  }

  return matrix;
};
