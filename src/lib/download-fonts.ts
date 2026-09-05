import fs from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { unzipSync } from 'fflate';
import * as tar from 'tar';
import { fromRoot, log } from './util.ts';

const FONTS_DIR = fromRoot('fonts');

const fonts: Record<string, string> = {
  Symbola: 'https://www.wfonts.com/download/data/2016/04/23/symbola/symbola.zip',
  Noto: 'https://noto-website.storage.googleapis.com/pkgs/Noto-unhinted.zip',
  IPAexm: 'https://moji.or.jp/wp-content/ipafont/IPAexfont/ipaexm00401.zip',
  IPAmjm: 'https://dforest.watch.impress.co.jp/library/i/ipamjfont/10750/ipamjm00601.zip',
  hanazono: 'http://jaist.dl.osdn.jp/hanazono-font/64385/hanazono-20160201.zip',
  Doulos: 'https://software.sil.org/downloads/r/doulos/DoulosSIL-5.000.zip',
  FreeFont: 'https://ftp.gnu.org/gnu/freefont/freefont-ttf-20120503.zip',
  Hancom: 'http://cdn.hancom.com/pds/docs/HancomFont.zip',
  Scheherazade: 'http://software.sil.org/downloads/r/scheherazade/Scheherazade-2.100.zip',
  Annapurna: 'http://software.sil.org/downloads/r/annapurna/AnnapurnaSIL-1.202.zip',
  Manjari: 'http://www.malayalamtype.com/fonts/Manjari-Regular.ttf',
  tlwg: 'https://linux.thai.net/pub/thailinux/software/fonts-tlwg/fonts/ttf-tlwg-0.5.0.tar.gz',
  Jomolhari:
    'https://collab.its.virginia.edu/access/content/group/26a34146-33a6-48ce-001e-f16ce7908a6a/Tibetan%20fonts/Tibetan%20Unicode%20Fonts/Jomolhari-alpha003.zip',
  Padauk: 'http://software.sil.org/downloads/r/padauk/padauk-3.002.zip',
  Quivira: 'http://www.quivira-font.com/files/Quivira.otf',
  UnFonts:
    'http://ftp.jaist.ac.jp/pub/Linux/Momonga/development/source/SOURCES/2607-un-fonts-core-1.0.2-080608.tar.gz',
  Abyssinica: 'http://software.sil.org/downloads/r/abyssinica/AbyssinicaSIL-1.500.zip',
  NotoSansCherokee:
    'https://github.com/googlefonts/noto-fonts-alpha/raw/main/from-glyphsapp/unhinted/ttf/sans/NotoSansCherokee-Regular.ttf',
  MongolianScript:
    'https://web.archive.org/web/20160707014328if_/http://font.bolorsoft.com/download/fonts.zip',
  Namdhinggo:
    'http://scripts.sil.org/cms/scripts/render_download.php?format=file&media_id=NamdhinggoSIL1.004&filename=NamdhinggoSIL1.004.zip',
  DaiBanna:
    'http://scripts.sil.org/cms/scripts/render_download.php?format=file&media_id=DaiBanna-2.200.zip&filename=DaiBanna-2.200.zip',
  Nishiki: 'https://umihotaru.work/nishiki-teki.zip',
  Mingzat:
    'http://scripts.sil.org/cms/scripts/render_download.php?format=file&media_id=Mingzat-0.100&filename=Mingzat-0.100.zip',
  PonomarUnicode: 'http://www.ponomar.net/files/PonomarUnicode.zip',
  junicode:
    'https://sourceforge.net/projects/junicode/files/junicode/junicode-0-7-8/junicode-0-7-8.zip',
  BTC: 'https://github.com/RWOverdijk/BitKey/raw/master/client/src/fonts/BTC.ttf',
  ObserverSymbol: 'http://hypertexthero.com/static/img/observer-symbol/observer-symbol-latest.zip',
  Analecta: 'https://www.wfonts.com/download/data/2016/06/09/analecta/analecta.zip',
  BabelStoneHan: 'http://www.babelstone.co.uk/Fonts/Download/BabelStoneHan.zip',
  OpenSans: 'http://www.opensans.com/download/open-sans.zip',
  DejaVu: 'https://sourceforge.net/projects/dejavu/files/dejavu/2.37/dejavu-fonts-ttf-2.37.zip',
  JGLao: 'https://github.com/hakatashi/font-archive/raw/master/jglao.zip',
  NotoSerifCJKjp: 'https://noto-website.storage.googleapis.com/pkgs/NotoSerifCJKjp-hinted.zip',
  LisuUnicode: 'https://github.com/phjamr/LisuUnicode/raw/master/LisuUnicode-Regular.ttf',
  Wakor: 'http://www.evertype.com/fonts/vai/wakorfont.zip',
  Charis: 'https://software.sil.org/downloads/r/charis/CharisSIL-5.000.zip',
  BabelStonePhagsPa: 'http://www.babelstone.co.uk/Fonts/Download/BabelStonePhagspaBook_v2.ttf',
  Pagul: 'https://sourceforge.net/projects/pagul/files/Pagul_v1.0.zip',
  TaiHeritage: 'https://software.sil.org/downloads/r/taiheritage/TaiHeritagePro-2.600.zip',
};

/** Fonts distributed as a bare font file instead of an archive. */
const NOT_ARCHIVED = new Set([
  'Quivira',
  'NotoSansCherokee',
  'BTC',
  'Manjari',
  'LisuUnicode',
  'BabelStonePhagsPa',
]);

const headersFor = (directory: string): Record<string, string> => {
  if (directory === 'Hancom') {
    return { referer: 'http://www.hancom.com/' };
  }

  if (['Namdhinggo', 'DaiBanna', 'Mingzat'].includes(directory)) {
    return { accept: '*/*' };
  }

  return {};
};

const isGzip = (data: Uint8Array): boolean => data[0] === 0x1f && data[1] === 0x8b;

/** Rejects archive entries that would escape the destination directory. */
const resolveEntry = (destination: string, entry: string): string | null => {
  const resolved = path.resolve(destination, entry);
  return resolved.startsWith(`${destination}${path.sep}`) ? resolved : null;
};

const extractZip = async (data: Uint8Array, destination: string): Promise<void> => {
  const entries = unzipSync(data);

  for (const [name, content] of Object.entries(entries)) {
    if (name.endsWith('/')) {
      continue;
    }

    const target = resolveEntry(destination, name);

    if (target === null) {
      log(`Skipping suspicious archive entry ${name}`);
      continue;
    }

    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, content);
  }
};

const downloadFont = async (directory: string, url: string): Promise<void> => {
  const destination = path.join(FONTS_DIR, directory);

  try {
    const files = await fs.readdir(destination);

    if (files.length > 0) {
      log(`${directory} is already downloaded.`);
      return;
    }
  } catch {
    // Not downloaded yet.
  }

  log(`${destination} not exists. Downloading...`);

  await fs.mkdir(destination, { recursive: true });

  const response = await fetch(url, { headers: headersFor(directory) });

  if (!response.ok) {
    throw new Error(
      `Failed to download ${directory} from ${url}: ${response.status} ${response.statusText}`,
    );
  }

  const data = new Uint8Array(await response.arrayBuffer());

  if (NOT_ARCHIVED.has(directory)) {
    const fileName = path.basename(new URL(url).pathname);
    await fs.writeFile(path.join(destination, fileName), data);
  } else if (isGzip(data)) {
    await pipeline(Readable.from([Buffer.from(data)]), tar.x({ cwd: destination }));
  } else {
    await extractZip(data, destination);
  }
};

const downloadFonts = async (): Promise<void> => {
  for (const [directory, url] of Object.entries(fonts)) {
    await downloadFont(directory, url);
  }
};

export default downloadFonts;
