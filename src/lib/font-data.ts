/** Metadata of a single font used to render glyphs and to credit its license. */
export type FontDefinition = {
  name?: string;
  URL?: string;
  author?: string;
  license?: string;
  licenseURL?: string;
  /** Path of the font file, relative to the `fonts` directory. Absent for license-only entries. */
  path?: string;
};

export const fontData: Record<string, FontDefinition> = {
  doulos: {
    name: 'Doulos SIL 5.000',
    URL: 'http://software.sil.org/doulos/',
    author: 'SIL International',
    license: 'SIL OFL 1.1',
    licenseURL: 'http://scripts.sil.org/ofl',
    path: 'Doulos/DoulosSIL-5.000/DoulosSIL-R.ttf',
  },
  symbola: {
    name: 'Symbola',
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
    path: 'Noto/NotoSansCJKjp-Light.otf',
  },
  notoSerifJp: {
    path: 'NotoSerifCJKjp/NotoSerifCJKjp-Regular.otf',
  },
  scheherazade: {
    name: 'Scheherazade 2.100',
    URL: 'http://software.sil.org/scheherazade/',
    author: 'SIL International',
    license: 'SIL OFL 1.1',
    licenseURL: 'http://scripts.sil.org/ofl',
    path: 'Scheherazade/Scheherazade-2.100/Scheherazade-Regular.ttf',
  },
  scheherazadeBold: {
    path: 'Scheherazade/Scheherazade-2.100/Scheherazade-Bold.ttf',
  },
  annapurna: {
    name: 'Annapurna SIL 1.202',
    URL: 'http://software.sil.org/annapurna/',
    author: 'SIL International',
    license: 'SIL OFL 1.1',
    licenseURL: 'http://scripts.sil.org/ofl',
    path: 'Annapurna/AnnapurnaSIL-1.202/AnnapurnaSIL-Regular.ttf',
  },
  manjari: {
    name: 'Manjari',
    URL: 'https://github.com/santhoshtr/Manjari',
    author: 'Santhosh Thottingal, Kavya Manohar',
    license: 'SIL OFL 1.1',
    licenseURL: 'http://scripts.sil.org/ofl',
    path: 'Manjari/Manjari-Regular.ttf',
  },
  norasi: {
    name: 'Norasi',
    URL: 'https://linux.thai.net/projects/fonts-tlwg',
    author:
      'The National Font Project (v.beta), Yannis Haralambous, Virach Sornlertlamvanich, and Anutara Tantraporn, with modification by Thai Linux Working Group (TLWG)',
    license: 'GPLv2+FE',
    licenseURL: 'https://github.com/tlwg/fonts-tlwg/blob/master/COPYING',
    path: 'tlwg/ttf-tlwg-0.5.0/Norasi.ttf',
  },
  jomolhari: {
    name: 'Jomolhari 000.003c',
    URL: 'https://collab.itc.virginia.edu/wiki/tibetan-script/Jomolhari.html',
    author: 'THL Staff',
    license: 'SIL OFL 1.1',
    licenseURL: 'http://scripts.sil.org/ofl',
    path: 'Jomolhari/Jomolhari-alpha3c-0605331.ttf',
  },
  padauk: {
    name: 'Padauk 3.002',
    URL: 'http://software.sil.org/padauk/',
    author: 'SIL International',
    license: 'SIL OFL 1.1',
    licenseURL: 'http://scripts.sil.org/ofl',
    path: 'Padauk/padauk-3.002/PadaukBook-Regular.ttf',
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
  abyssinica: {
    name: 'Abyssinica SIL 1.500',
    URL: 'http://software.sil.org/abyssinica/',
    author: 'SIL International',
    license: 'SIL OFL 1.1',
    licenseURL: 'http://scripts.sil.org/ofl',
    path: 'Abyssinica/AbyssinicaSIL-1.500/AbyssinicaSIL-R.ttf',
  },
  hancom: {
    name: 'HCRBatang',
    URL: 'http://www.hancom.com/cs_center/csDownload.do',
    author: 'Hancom INC(HNC)',
    license: 'Permissive License',
    licenseURL: 'http://www.hancom.com/cs_center/csDownload.do',
    path: 'Hancom/HANBatang.ttf',
  },
  mongolianScript: {
    name: 'MongolianScript',
    URL: 'http://mongol.openmn.org/',
    author: 'Myataviin Erdenechimeg and Bolorsoft LLC',
    license: 'SIL OFL 1.1',
    licenseURL: 'http://scripts.sil.org/ofl',
    path: 'MongolianScript/fonts/MongolianScript.ttf',
  },
  namdhinggo: {
    name: 'Namdhinggo SIL 1.004',
    URL: 'http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=NamdhinggoSIL',
    author: 'SIL International',
    license: 'SIL OFL 1.1',
    licenseURL: 'http://scripts.sil.org/ofl',
    path: 'Namdhinggo/NamdhinggoSIL/NamdhinggoSIL-R.ttf',
  },
  daiBanna: {
    name: 'Dai Banna SIL 2.200',
    URL: 'http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=daibannasil',
    author: 'SIL International',
    license: 'SIL OFL 1.1',
    licenseURL: 'http://scripts.sil.org/ofl',
    path: 'DaiBanna/dai-banna-2.200/DBSILBR.ttf',
  },
  nishiki: {
    name: 'Nishiki-teki Font',
    URL: 'https://umihotaru.work/',
    author: 'Umihotaru',
    license: 'Permissive License',
    licenseURL: 'https://umihotaru.work/faq.txt',
    path: 'Nishiki/nishiki-teki.ttf',
  },
  mingzat: {
    name: 'Mingzat 0.100',
    URL: 'http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=Mingzat',
    author: 'SIL International',
    license: 'SIL OFL 1.1',
    licenseURL: 'http://scripts.sil.org/ofl',
    path: 'Mingzat/Mingzat/Mingzat-R.ttf',
  },
  ponomar: {
    name: 'Ponomar Unicode',
    URL: 'http://www.ponomar.net/cu_support/fonts.html',
    author: 'Vlad Dorosh, Aleksandr Andreev, Yuri Shardt, and Nikita Simmons',
    license: 'SIL OFL 1.1',
    licenseURL: 'http://scripts.sil.org/ofl',
    path: 'PonomarUnicode/PonomarUnicode.otf',
  },
  junicode: {
    name: 'Junicode',
    URL: 'http://junicode.sourceforge.net/',
    author: 'Peter S. Baker',
    license: 'SIL OFL 1.1',
    licenseURL: 'http://scripts.sil.org/ofl',
    path: 'junicode/junicode/fonts/Junicode.ttf',
  },
  btc: {
    name: 'BTC.ttf',
    URL: 'https://en.bitcoin.it/wiki/Template:BTC',
    author: 'theymos',
    license: 'Public domain',
    licenseURL: '',
    path: 'BTC/BTC.ttf',
  },
  observerSymbol: {
    name: 'ObserverSymbol',
    URL: 'https://www.simongriffee.com/notebook/international-symbol-observer/',
    author: 'Simon Griffee',
    license: 'CC0 1.0 Universal',
    licenseURL: 'https://creativecommons.org/publicdomain/zero/1.0/',
    path: 'ObserverSymbol/ObserverSymbol.ttf',
  },
  analecta: {
    name: 'Analecta',
    URL: 'http://users.teilar.gr/~g1951d/',
    author: 'George Douros',
    license: 'Permissive License',
    licenseURL: 'http://users.teilar.gr/~g1951d/',
    path: 'Analecta/Analecta.otf',
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
    name: 'Open Sans',
    URL: 'http://www.opensans.com/',
    author: 'Steve Matteson and Google Corporation',
    license: 'Apache License v2',
    licenseURL: 'http://www.apache.org/licenses/LICENSE-2.0',
    path: 'OpenSans/OpenSans-Bold.ttf',
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
  lisu: {
    name: 'LisuUnicode',
    URL: 'http://phjamr.github.io/lisu.html',
    author: 'phjamr',
    license: 'SIL OFL 1.1',
    licenseURL: 'https://github.com/phjamr/LisuUnicode/blob/master/LICENSE.md',
    path: 'LisuUnicode/LisuUnicode-Regular.ttf',
  },
  wakor: {
    name: 'Wakor',
    URL: 'http://www.evertype.com/fonts/vai/',
    author: 'Jason Glavy',
    license: 'SIL OFL 1.1',
    licenseURL: 'http://www.evertype.com/fonts/vai/wakor-licence.html',
    path: 'Wakor/Wakor-4.0.7/Wakor.ttf',
  },
  charis: {
    name: 'Charis',
    URL: 'https://software.sil.org/charis/',
    author: 'SIL',
    license: 'SIL OFL 1.1',
    licenseURL: 'http://scripts.sil.org/ofl',
    path: 'Charis/CharisSIL-5.000/CharisSIL-R.ttf',
  },
  babelPhagsPa: {
    name: 'BabelStone Phags-pa Book',
    URL: 'http://www.babelstone.co.uk/Fonts/Phags-pa.html',
    author: 'Arphic Technology Co., Ltd.',
    license: 'SIL OFL 1.1',
    licenseURL: 'http://scripts.sil.org/ofl',
    path: 'BabelStonePhagsPa/BabelStonePhagspaBook_v2.ttf',
  },
  pagul: {
    name: 'PagulFont',
    URL: 'https://sourceforge.net/projects/pagul/',
    author: 'mooreprabu',
    license: 'GPLv3+FE',
    licenseURL: 'https://www.gnu.org/software/freefont/license.html',
    path: 'Pagul/Pagul.ttf',
  },
  taiHeritage: {
    name: 'Tai Heritage Pro',
    URL: 'https://software.sil.org/taiheritage/',
    author: 'SIL',
    license: 'SIL OFL 1.1',
    licenseURL: 'http://scripts.sil.org/ofl',
    path: 'TaiHeritage/TaiHeritagePro-2.600/TaiHeritagePro-Regular.ttf',
  },
};
