import fs from 'node:fs/promises';
import configs from './configs.ts';
import composePoster from './lib/compose-poster.ts';
import convertToPdf from './lib/convert-to-pdf.ts';
import convertToPng from './lib/convert-to-png.ts';
import downloadFonts from './lib/download-fonts.ts';
import generateSvg from './lib/generate-svg.ts';
import loadCodepoints from './lib/load-codepoints.ts';
import { log } from './lib/util.ts';

const main = async (): Promise<void> => {
  log('Downloading fonts...');
  await downloadFonts();

  log('Loading codepoints...');
  const codepoints = await loadCodepoints();

  for (const config of configs) {
    const chartSvg = `${config.name}-chart.svg`;
    const posterSvg = `${config.name}-poster.svg`;
    const posterPng = `${config.name}-poster.png`;
    const posterPdf = `${config.name}-poster.pdf`;

    log(`Generating ${config.name} SVG...`);
    const svg = await generateSvg(codepoints, config);

    const [, poster] = await Promise.all([
      (async () => {
        log(`Writing ${chartSvg}...`);
        await fs.writeFile(chartSvg, svg);
      })(),
      (async () => {
        log(`Composing ${posterSvg}...`);
        return composePoster(svg, config);
      })(),
    ]);

    await Promise.all([
      (async () => {
        log(`Writing ${posterSvg}...`);
        await fs.writeFile(posterSvg, poster);
      })(),
      (async () => {
        log(`Generating ${posterPng}...`);
        const png = convertToPng(poster);
        log(`Writing ${posterPng}...`);
        await fs.writeFile(posterPng, png);
      })(),
    ]);

    log(`Generating ${posterPdf}...`);
    await convertToPdf(posterSvg, posterPdf);
  }

  log('Done.');
};

try {
  await main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
