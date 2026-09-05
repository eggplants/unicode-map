import fs from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { unzipSync } from 'fflate';
import * as tar from 'tar';
import { fromRoot, log } from './util.ts';

const FONTS_DIR = fromRoot('fonts');

const NOTOFONTS = 'https://raw.githubusercontent.com/notofonts/notofonts.github.io/main/fonts';

/** Per-script Noto families, published one static TTF per family. */
const NOTO_FAMILIES = [
  'NotoSansHebrew',
  'NotoNaskhArabic',
  'NotoSansSyriacEastern',
  'NotoSansNKo',
  'NotoSansSamaritan',
  'NotoSansMandaic',
  'NotoSerifBengali',
  'NotoSerifGujarati',
  'NotoSerifTamil',
  'NotoSerifTelugu',
  'NotoSerifKannada',
  'NotoSerifMalayalam',
  'NotoSerifLao',
  'NotoSerifGeorgian',
  'NotoSansCanadianAboriginal',
  'NotoSansOgham',
  'NotoSansRunic',
  'NotoSansTagalog',
  'NotoSansTagbanwa',
  'NotoSerifKhmer',
  'NotoSansTaiTham',
  'NotoSansBalinese',
  'NotoSansSundanese',
  'NotoSansBatak',
  'NotoSansOlChiki',
  'NotoSerifDevanagari',
  'NotoSerif',
  'NotoSansTifinagh',
  'NotoSansYi',
  'NotoSansBamum',
  'NotoSansSylotiNagri',
  'NotoSansKayahLi',
  'NotoSansRejang',
  'NotoSansJavanese',
  'NotoSansCham',
  'NotoSansMeeteiMayek',
  'NotoSerifEthiopic',
  'NotoSansVai',
  'NotoSerifMyanmar',
  'NotoSansMongolian',
  'NotoSansCoptic',
  'NotoSerifThai',
  'NotoSansSaurashtra',
  'NotoSansNewTaiLue',
  'NotoSansLepcha',
  'NotoSansTaiViet',
  'NotoSansLimbu',
  'NotoSansPhagsPa',
  'NotoSansLisu',
];

/**
 * Each entry downloads into `fonts/<key>`. A list of sources is only supported
 * for bare font files, which are stored side by side under that directory.
 */
const fonts: Record<string, string | string[]> = {
  Symbola:
    'https://web.archive.org/web/20180307013123if_/http://users.teilar.gr/~g1951d/Symbola.zip',
  Noto: [
    ...NOTO_FAMILIES.map((family) => `${NOTOFONTS}/${family}/hinted/ttf/${family}-Regular.ttf`),
    // Noto Sans Tibetan was retired upstream; the archive still carries it.
    'https://raw.githubusercontent.com/notofonts/noto-fonts/main/archive/hinted/NotoSansTibetan/NotoSansTibetan-Regular.ttf',
    // Noto Sans CJK JP, as Google Fonts publishes it.
    'https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf',
  ],
  IPAexm: 'https://moji.or.jp/wp-content/ipafont/IPAexfont/ipaexm00401.zip',
  IPAmjm: 'https://dforest.watch.impress.co.jp/library/i/ipamjfont/10750/ipamjm00601.zip',
  hanazono: 'https://ftp.iij.ad.jp/pub/osdn.jp/hanazono-font/68253/hanazono-20170904.zip',
  FreeFont: 'https://ftp.gnu.org/gnu/freefont/freefont-ttf-20120503.zip',
  Hancom: 'http://cdn.hancom.com/pds/docs/HancomFont.zip',
  Scheherazade: 'http://software.sil.org/downloads/r/scheherazade/Scheherazade-2.100.zip',
  Quivira: 'http://www.quivira-font.com/files/Quivira.otf',
  UnFonts:
    'http://ftp.jaist.ac.jp/pub/Linux/Momonga/development/source/SOURCES/2607-un-fonts-core-1.0.2-080608.tar.gz',
  NotoSansCherokee:
    'https://github.com/googlefonts/noto-fonts-alpha/raw/main/from-glyphsapp/unhinted/ttf/sans/NotoSansCherokee-Regular.ttf',
  Nishiki: 'https://umihotaru.work/nishiki-teki.zip',
  ObserverSymbol: 'http://hypertexthero.com/static/img/observer-symbol/observer-symbol-latest.zip',
  BabelStoneHan: 'http://www.babelstone.co.uk/Fonts/Download/BabelStoneHan.zip',
  OpenSans:
    'https://raw.githubusercontent.com/google/fonts/main/ofl/opensans/OpenSans%5Bwdth,wght%5D.ttf',
  DejaVu: 'https://sourceforge.net/projects/dejavu/files/dejavu/2.37/dejavu-fonts-ttf-2.37.zip',
  JGLao: 'https://github.com/hakatashi/font-archive/raw/master/jglao.zip',
  NotoSerifCJKjp:
    'https://github.com/notofonts/noto-cjk/releases/download/Serif2.003/07_NotoSerifCJKjp.zip',
};

/** Fonts distributed as a bare font file instead of an archive. */
/** Some hosts reject requests that keep Node's default `node` user agent. */
const USER_AGENT = 'unicode-map/1.0 (+https://github.com/eggplants/unicode-map)';

const headersFor = (directory: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'user-agent': USER_AGENT,
    accept: '*/*',
  };

  if (directory === 'Hancom') {
    headers.referer = 'http://www.hancom.com/';
  }

  return headers;
};

type SourceKind = 'zip' | 'tar.gz' | 'font';

/**
 * Font sites redirect and occasionally answer with an error page, so trust the
 * downloaded bytes rather than the URL.
 */
const detectKind = (data: Uint8Array): SourceKind => {
  if (data[0] === 0x50 && data[1] === 0x4b) {
    return 'zip';
  }

  if (data[0] === 0x1f && data[1] === 0x8b) {
    return 'tar.gz';
  }

  const signature = Buffer.from(data.subarray(0, 4)).toString('latin1');

  if (
    signature === 'OTTO' ||
    signature === 'true' ||
    signature === 'ttcf' ||
    (data[0] === 0 && data[1] === 1 && data[2] === 0 && data[3] === 0)
  ) {
    return 'font';
  }

  throw new Error(`Not a font or an archive (starts with ${JSON.stringify(signature)})`);
};

/** The name a bare font file is stored under, taken from its URL. */
const fileNameFor = (url: string): string =>
  path.basename(decodeURIComponent(new URL(url).pathname));

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

const fetchSource = async (directory: string, url: string): Promise<Uint8Array> => {
  const response = await fetch(url, { headers: headersFor(directory) });

  if (!response.ok) {
    throw new Error(
      `Failed to download ${directory} from ${url}: ${response.status} ${response.statusText}`,
    );
  }

  return new Uint8Array(await response.arrayBuffer());
};

const downloadFont = async (directory: string, sources: string | string[]): Promise<void> => {
  const urls = Array.isArray(sources) ? sources : [sources];
  const destination = path.join(FONTS_DIR, directory);

  let existing: string[] = [];

  try {
    existing = await fs.readdir(destination);
  } catch {
    // Not downloaded yet.
  }

  // A single source unpacks as a whole, so any content means it is complete.
  if (urls.length === 1 && existing.length > 0) {
    log(`${directory} is already downloaded.`);
    return;
  }

  const pending = urls.filter((url) => !existing.includes(fileNameFor(url)));

  if (pending.length === 0) {
    log(`${directory} is already downloaded.`);
    return;
  }

  log(`Downloading ${pending.length} file(s) into ${destination}...`);

  await fs.mkdir(destination, { recursive: true });

  for (const url of pending) {
    const data = await fetchSource(directory, url);

    switch (detectKind(data)) {
      case 'font':
        await fs.writeFile(path.join(destination, fileNameFor(url)), data);
        break;
      case 'tar.gz':
        await pipeline(Readable.from([Buffer.from(data)]), tar.x({ cwd: destination }));
        break;
      case 'zip':
        await extractZip(data, destination);
        break;
    }
  }
};

const downloadFonts = async (): Promise<void> => {
  for (const [directory, sources] of Object.entries(fonts)) {
    await downloadFont(directory, sources);
  }
};

export default downloadFonts;
