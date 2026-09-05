import fs from 'node:fs/promises';
import type { PosterConfig } from '../configs.ts';
import { Paper, setTransform } from './svg.ts';
import { fromRoot } from './util.ts';

/** 594x841mm (A1) at 300dpi. */
const POSTER_WIDTH = 7016;
const POSTER_HEIGHT = 9933;

/** The chart is authored at 3840 units wide and placed at 1627.09pt on the layout. */
const CHART_SCALE = 1627.09 / 3840;

/** The layouts are stored with Git LFS, so a fresh clone may only hold pointers. */
const LFS_POINTER = 'version https://git-lfs.github.com/spec/v1';

const readLayout = async (layout: string): Promise<string> => {
  const file = fromRoot('data', 'layouts', `${layout}.svg`);
  const source = await fs.readFile(file, 'utf8');

  if (source.startsWith(LFS_POINTER)) {
    throw new Error(
      `${file} is a Git LFS pointer rather than the artwork. Run \`git lfs install\` and \`git lfs pull\` to fetch it.`,
    );
  }

  return source;
};

const composePoster = async (chartSvg: string, config: PosterConfig): Promise<string> => {
  const posterSvg = await readLayout(config.layout);

  const paper = new Paper(POSTER_WIDTH, POSTER_HEIGHT);

  const rootGroup = paper.group();
  setTransform(rootGroup, `scale(${300 / 72})`);

  const chart = paper.group();
  rootGroup.append(chart);

  const poster = paper.group();
  rootGroup.append(poster);

  chart.append(...paper.parse(chartSvg));
  poster.append(...paper.parse(posterSvg));

  setTransform(chart, `translate(${config.chart.x}, ${config.chart.y}) scale(${CHART_SCALE})`);

  const svg = paper.serialize();
  paper.close();

  return svg;
};

export default composePoster;
