import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const VIEW_BOX = '0 0 7016 9933';
const WIDTH = '594mm';
const HEIGHT = '841mm';

const convertToPdf = async (svgPath: string, pdfPath: string): Promise<void> => {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage();

    // Posters are tens of megabytes, so give the renderer as long as it needs.
    page.setDefaultTimeout(0);
    page.setDefaultNavigationTimeout(0);

    await page.goto(pathToFileURL(svgPath).href);

    await page.evaluate(
      ({ viewBox, width, height }) => {
        const svg = document.querySelector('svg');

        if (svg === null) {
          throw new Error('The document contains no <svg> element');
        }

        svg.setAttribute('viewBox', viewBox);
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
      },
      { viewBox: VIEW_BOX, width: WIDTH, height: HEIGHT },
    );

    await page.pdf({
      path: pdfPath,
      width: WIDTH,
      height: HEIGHT,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      printBackground: false,
      landscape: false,
    });
  } finally {
    await browser.close();
  }
};

export default convertToPdf;
