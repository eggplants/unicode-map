/** Metadata of a single font used to render glyphs and to credit its license. */
export type FontDefinition = {
  name?: string;
  URL?: string;
  author?: string;
  license?: string;
  licenseURL?: string;
  /** Path of the font file, relative to the `fonts` directory. Absent for license-only entries. */
  path?: string;
  /** Axis values to pin, for families that are only published as variable fonts. */
  variation?: Record<string, number>;
};

export const fontData: Record<string, FontDefinition> = {
  symbola: {
    name: 'Symbola 10.24',
    URL: 'http://users.teilar.gr/~g1951d/',
    author: 'George Douros',
    license: 'Permissive License',
    licenseURL: 'http://users.teilar.gr/~g1951d/',
    path: 'Symbola/Symbola.ttf',
  },
  ipamjm: {
    name: 'IPA mj Mincho',
    URL: 'https://moji.or.jp/mojikiban/font/',
    author: 'Information-technology Promotion Agency, Japan (IPA)',
    license: 'IPA Font License v1.0',
    licenseURL: 'https://moji.or.jp/ipafont/license/',
    path: 'IPAmjm/ipamjm.ttf',
  },
  ipaexm: {
    name: 'IPA ex Mincho',
    URL: 'https://moji.or.jp/ipafont/ipaex00401/',
    author: 'Information-technology Promotion Agency, Japan (IPA)',
    license: 'IPA Font License v1.0',
    licenseURL: 'https://moji.or.jp/ipafont/ipaex00401',
    path: 'IPAexm/ipaexm00401/ipaexm.ttf',
  },
  hanaminA: {
    name: 'Hanazono Mincho',
    URL: 'http://fonts.jp/hanazono/',
    author: 'GlyphWiki Project',
    license: 'SIL OFL 1.1',
    licenseURL: 'http://scripts.sil.org/ofl',
    path: 'hanazono/HanaMinA.ttf',
  },
  freeSerif: {
    name: 'GNU FreeFont',
    URL: 'https://www.gnu.org/software/freefont/',
    author: 'GNU FreeFont Contributors',
    license: 'GPLv3+FE',
    licenseURL: 'https://www.gnu.org/software/freefont/license.html',
    path: 'FreeFont/freefont-20120503/FreeSerif.ttf',
  },
  freeSerifBold: {
    name: 'GNU FreeFont',
    URL: 'https://www.gnu.org/software/freefont/',
    author: 'GNU FreeFont Contributors',
    license: 'GPLv3+FE',
    licenseURL: 'https://www.gnu.org/software/freefont/license.html',
    path: 'FreeFont/freefont-20120503/FreeSerifBold.ttf',
  },
  noto: {
    name: 'Noto Fonts',
    URL: 'https://www.google.com/get/noto/',
    author: 'Google Inc.',
    license: 'SIL OFL 1.1',
    licenseURL: 'http://scripts.sil.org/ofl',
  },
  notoHebrew: {
    path: 'Noto/NotoSansHebrew-Regular.ttf',
  },
  notoArabic: {
    path: 'Noto/NotoNaskhArabic-Regular.ttf',
  },
  notoSyriac: {
    path: 'Noto/NotoSansSyriacEastern-Regular.ttf',
  },
  notoNko: {
    path: 'Noto/NotoSansNKo-Regular.ttf',
  },
  notoSamaritan: {
    path: 'Noto/NotoSansSamaritan-Regular.ttf',
  },
  notoMandaic: {
    path: 'Noto/NotoSansMandaic-Regular.ttf',
  },
  notoBengali: {
    path: 'Noto/NotoSerifBengali-Regular.ttf',
  },
  notoGujarati: {
    path: 'Noto/NotoSerifGujarati-Regular.ttf',
  },
  notoTamil: {
    path: 'Noto/NotoSerifTamil-Regular.ttf',
  },
  notoTelugu: {
    path: 'Noto/NotoSerifTelugu-Regular.ttf',
  },
  notoKannada: {
    path: 'Noto/NotoSerifKannada-Regular.ttf',
  },
  notoMalayalam: {
    path: 'Noto/NotoSerifMalayalam-Regular.ttf',
  },
  notoLao: {
    path: 'Noto/NotoSerifLao-Regular.ttf',
  },
  notoTibetan: {
    path: 'Noto/NotoSansTibetan-Regular.ttf',
  },
  notoGeorgian: {
    path: 'Noto/NotoSerifGeorgian-Regular.ttf',
  },
  notoCherokee: {
    path: 'NotoSansCherokee/NotoSansCherokee-Regular.ttf',
  },
  notoCanadianAboriginal: {
    path: 'Noto/NotoSansCanadianAboriginal-Regular.ttf',
  },
  notoOgham: {
    path: 'Noto/NotoSansOgham-Regular.ttf',
  },
  notoRunic: {
    path: 'Noto/NotoSansRunic-Regular.ttf',
  },
  notoTagalog: {
    path: 'Noto/NotoSansTagalog-Regular.ttf',
  },
  notoTagbanwa: {
    path: 'Noto/NotoSansTagbanwa-Regular.ttf',
  },
  notoKhmer: {
    path: 'Noto/NotoSerifKhmer-Regular.ttf',
  },
  notoTaiTham: {
    path: 'Noto/NotoSansTaiTham-Regular.ttf',
  },
  notoBalinese: {
    path: 'Noto/NotoSansBalinese-Regular.ttf',
  },
  notoSundanese: {
    path: 'Noto/NotoSansSundanese-Regular.ttf',
  },
  notoBatak: {
    path: 'Noto/NotoSansBatak-Regular.ttf',
  },
  notoOlChiki: {
    path: 'Noto/NotoSansOlChiki-Regular.ttf',
  },
  notoDevanagari: {
    path: 'Noto/NotoSerifDevanagari-Regular.ttf',
  },
  notoSerif: {
    path: 'Noto/NotoSerif-Regular.ttf',
  },
  notoTifinagh: {
    path: 'Noto/NotoSansTifinagh-Regular.ttf',
  },
  notoYi: {
    path: 'Noto/NotoSansYi-Regular.ttf',
  },
  notoBamum: {
    path: 'Noto/NotoSansBamum-Regular.ttf',
  },
  notoSylotiNagri: {
    path: 'Noto/NotoSansSylotiNagri-Regular.ttf',
  },
  notoKayahLi: {
    path: 'Noto/NotoSansKayahLi-Regular.ttf',
  },
  notoRejang: {
    path: 'Noto/NotoSansRejang-Regular.ttf',
  },
  notoJavanese: {
    path: 'Noto/NotoSansJavanese-Regular.ttf',
  },
  notoCham: {
    path: 'Noto/NotoSansCham-Regular.ttf',
  },
  notoMeeteiMayek: {
    path: 'Noto/NotoSansMeeteiMayek-Regular.ttf',
  },
  notoCjkJp: {
    path: 'Noto/NotoSansJP[wght].ttf',
  },
  notoEthiopic: {
    path: 'Noto/NotoSerifEthiopic-Regular.ttf',
  },
  notoVai: {
    path: 'Noto/NotoSansVai-Regular.ttf',
  },
  notoMyanmar: {
    path: 'Noto/NotoSerifMyanmar-Regular.ttf',
  },
  notoMongolian: {
    path: 'Noto/NotoSansMongolian-Regular.ttf',
  },
  notoCoptic: {
    path: 'Noto/NotoSansCoptic-Regular.ttf',
  },
  notoThai: {
    path: 'Noto/NotoSerifThai-Regular.ttf',
  },
  notoSaurashtra: {
    path: 'Noto/NotoSansSaurashtra-Regular.ttf',
  },
  notoNewTaiLue: {
    path: 'Noto/NotoSansNewTaiLue-Regular.ttf',
  },
  notoLepcha: {
    path: 'Noto/NotoSansLepcha-Regular.ttf',
  },
  notoTaiViet: {
    path: 'Noto/NotoSansTaiViet-Regular.ttf',
  },
  notoLimbu: {
    path: 'Noto/NotoSansLimbu-Regular.ttf',
  },
  notoPhagsPa: {
    path: 'Noto/NotoSansPhagsPa-Regular.ttf',
  },
  notoLisu: {
    path: 'Noto/NotoSansLisu-Regular.ttf',
  },
  notoSerifJp: {
    path: 'NotoSerifCJKjp/OTF/Japanese/NotoSerifCJKjp-Regular.otf',
  },
  // Only the bold cut is still used, so this entry just carries its credit.
  scheherazade: {
    name: 'Scheherazade 2.100',
    URL: 'http://software.sil.org/scheherazade/',
    author: 'SIL International',
    license: 'SIL OFL 1.1',
    licenseURL: 'http://scripts.sil.org/ofl',
  },
  scheherazadeBold: {
    path: 'Scheherazade/Scheherazade-2.100/Scheherazade-Bold.ttf',
  },
  quivira: {
    name: 'Quivira 4.1',
    URL: 'http://www.quivira-font.com/',
    author: 'Alexander Lange',
    license: 'Permissive License',
    licenseURL: 'http://www.quivira-font.com/notes.php',
    path: 'Quivira/Quivira.otf',
  },
  unbatang: {
    name: 'UnBatang',
    URL: 'https://kldp.net/unfonts/',
    author: 'Koanughi Un, Won-kyu Park, and Jungshik Shin',
    license: 'GPLv2',
    licenseURL: 'http://www.gnu.org/licenses/gpl.txt',
    path: 'UnFonts/un-fonts/UnBatang.ttf',
  },
  hancom: {
    name: 'HCRBatang',
    URL: 'http://www.hancom.com/cs_center/csDownload.do',
    author: 'Hancom INC(HNC)',
    license: 'Permissive License',
    licenseURL: 'http://www.hancom.com/cs_center/csDownload.do',
    path: 'Hancom/HCRBatang.ttf',
  },
  nishiki: {
    name: 'Nishiki-teki Font',
    URL: 'https://umihotaru.work/',
    author: 'Umihotaru',
    license: 'Permissive License',
    licenseURL: 'https://umihotaru.work/faq.txt',
    path: 'Nishiki/nishiki-teki.ttf',
  },
  observerSymbol: {
    name: 'ObserverSymbol',
    URL: 'https://www.simongriffee.com/notebook/international-symbol-observer/',
    author: 'Simon Griffee',
    license: 'CC0 1.0 Universal',
    licenseURL: 'https://creativecommons.org/publicdomain/zero/1.0/',
    path: 'ObserverSymbol/ObserverSymbol.ttf',
  },
  babelStone: {
    name: 'BabelStone Han',
    URL: 'http://www.babelstone.co.uk/Fonts/Han.html',
    author: 'Arphic Technology Co., Ltd.',
    license: 'Arphic Public License',
    licenseURL: 'http://ftp.gnu.org/non-gnu/chinese-fonts-truetype/LICENSE',
    path: 'BabelStoneHan/BabelStoneHan.ttf',
  },
  openSans: {
    name: 'Open Sans 3.003',
    URL: 'https://fonts.google.com/specimen/Open+Sans',
    author: 'Steve Matteson and Google Corporation',
    license: 'SIL OFL 1.1',
    licenseURL: 'http://scripts.sil.org/OFL',
    path: 'OpenSans/OpenSans[wdth,wght].ttf',
    variation: { wght: 700 },
  },
  dejavu: {
    name: 'DejaVu Serif',
    URL: 'https://dejavu-fonts.github.io/',
    author: 'Bitstream',
    license: 'Free License',
    licenseURL: 'https://dejavu-fonts.github.io/License.html',
    path: 'DejaVu/dejavu-fonts-ttf-2.37/ttf/DejaVuSerif.ttf',
  },
  jglao: {
    name: 'JG Lao Times',
    URL: 'https://web.archive.org/web/20090729181203/http://geocities.com/jglavy/asian.html',
    author: 'GlavyFonts',
    license: 'Permissive License',
    licenseURL: 'https://web.archive.org/web/20090729181203/http://geocities.com/jglavy/asian.html',
    path: 'JGLao/JG LaoTimesOT.ttf',
  },
};
