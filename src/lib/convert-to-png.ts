import { Resvg } from '@resvg/resvg-js';

const convertToPng = (svg: string): Buffer => new Resvg(svg).render().asPng();

export default convertToPng;
