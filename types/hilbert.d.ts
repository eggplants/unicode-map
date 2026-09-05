declare module 'hilbert' {
  export type Point2d = { x: number; y: number };

  export class Hilbert2d {
    constructor(size?: number | string, axisOrder?: 'xy' | 'yx');
    xy(distance: number): Point2d;
    d(x: number, y: number): number;
  }
}
