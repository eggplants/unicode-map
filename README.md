# The Unicode Map Project [![CI][ci-image]][ci-url]

A bunch of Unicode characters in a poster, on a [Hilbert curve](https://en.wikipedia.org/wiki/Hilbert_curve).


[ci-image]: https://github.com/hakatashi/unicode-map/actions/workflows/ci.yml/badge.svg
[ci-url]: https://github.com/hakatashi/unicode-map/actions/workflows/ci.yml

![](https://i.imgur.com/cEVN9VR.jpg)

## 🆕 New in Ver3.0.0

* Full [Unicode 10.0.0](http://unicode.org/versions/Unicode10.0.0/) support
* Pipeline table characters as of [UTC #152](http://www.unicode.org/L2/L2017/17222.htm) full support
* 66 new glyphs added
* Fonts were updated. Especially in Kanji, we now uses [Noto Serif CJK](https://www.google.com/get/noto/help/cjk/).

## ❓ About

**The Unicode Map Project** (Japanese: Unicode巨大地図) is an experimental project to illustrate [Unicode](http://unicode.org/standard/WhatIsUnicode.html) characters (and non-characters) in a large poster, and sell them at some [dōjinshi](https://en.wikipedia.org/wiki/D%C5%8Djinshi) fair event such as [Comiket](https://en.wikipedia.org/wiki/Comiket) in Japan. The version 1.0.0 was [sold at Comiket 91](https://webcatalog-free.circle.ms/Circle/13007447), held on Dec 29, 2016. Its composition of Unicode characters is very featured by its arrangement, which introduces a [Hilbert curve](https://en.wikipedia.org/wiki/Hilbert_curve) to visually span [the blocks of Unicode](https://en.wikipedia.org/wiki/Unicode_block).

The poster is developed with open source and the poster data [can be downloaded](#download) for free. And also any contribution is welcomed!

## ⏬ Download

### BMP-1 (U+0000 - U+3FFF) ver3.0.0

* [SVG (35.4 MB)](https://github.com/hakatashi/unicode-map/releases/download/201710261128/bmp-1-poster.svg)
* [PNG (16.6 MB)](https://github.com/hakatashi/unicode-map/releases/download/201710261128/bmp-1-poster.png)
* [PDF (13.4 MB)](https://github.com/hakatashi/unicode-map/releases/download/201710261128/bmp-1-poster.pdf)

### BMP-2 (U+4000 - U+7FFF) ver3.0.0

* [SVG (35.1 MB)](https://github.com/hakatashi/unicode-map/releases/download/201710261128/bmp-2-poster.svg)
* [PNG (23.1 MB)](https://github.com/hakatashi/unicode-map/releases/download/201710261128/bmp-2-poster.png)
* [PDF (14.9 MB)](https://github.com/hakatashi/unicode-map/releases/download/201710261128/bmp-2-poster.pdf)

### Development version

Development version of the builds are available in the [Release page](https://github.com/hakatashi/unicode-map/releases).

## 💪 Build

This project is built with [Vite+](https://viteplus.dev/) on pnpm. Install the `vp` CLI, then run:

    vp install
    vp exec playwright install chromium
    vp run build

**WARN: This command will download around 550MB of the font data from the internet, and cache them into `fonts` subdirectory.**

`vp check` formats, lints and type checks the sources, and `vp test` runs the unit tests.

`vp run watch` rebuilds whenever a file under `src` or `data` changes, and
`vp dev` additionally serves a preview of the generated charts at `/dev/` that
reloads itself after every successful rebuild.

PNG rasterisation is done by [resvg](https://github.com/yisibl/resvg-js) and PDF
export by headless Chromium through [Playwright](https://playwright.dev/), so
`playwright install chromium` is required before building.

## 🔰 License

The overall repository is licensed under [GPLv3](https://www.gnu.org/licenses/gpl-3.0.txt) by hakatashi.

The files not in the `data/glyphs` subdirectory are also licensed under [MIT License](https://opensource.org/licenses/MIT) by hakatashi.

## 🛣️ Roadmap

* Full support of BMP
* More permissive license

## 🙏 Materials

* ArmenianEternity.svg
	* link: https://commons.wikimedia.org/wiki/File:ArmenianEternity.svg
	* author: AnonMoos
	* license: Public Domain
	* for: u058d.svg
* SYRIAC-LETTER-MALAYALAM-NGA.png
	* link: https://en.wikipedia.org/wiki/File:SYRIAC-LETTER-MALAYALAM-NGA.png
	* author: Raamesh
	* license: CC BY-SA 4.0
	* for: u0860.svg
* SYRIAC-LETTER-MALAYALAM-JA.png
	* link: https://en.wikipedia.org/wiki/File:SYRIAC-LETTER-MALAYALAM-JA.png
	* author: Raamesh
	* license: CC BY-SA 4.0
	* for: u0861.svg
* SYRIAC-LETTER-MALAYALAM-NYA.png
	* link: https://en.wikipedia.org/wiki/File:SYRIAC-LETTER-MALAYALAM-NYA.png
	* author: Raamesh
	* license: CC BY-SA 4.0
	* for: u0862.svg
* SYRIAC-LETTER-MALAYALAM-TTA.png
	* link: https://en.wikipedia.org/wiki/File:SYRIAC-LETTER-MALAYALAM-TTA.png
	* author: Raamesh
	* license: CC BY-SA 4.0
	* for: u0863.svg
* SYRIAC-LETTER-MALAYALAM-NNA.png
	* link: https://en.wikipedia.org/wiki/File:SYRIAC-LETTER-MALAYALAM-NNA.png
	* author: Raamesh
	* license: CC BY-SA 4.0
	* for: u0864.svg
* SYRIAC-LETTER-MALAYALAM-NNNA.png
	* link: https://en.wikipedia.org/wiki/File:SYRIAC-LETTER-MALAYALAM-NNNA.png
	* author: Raamesh
	* license: CC BY-SA 4.0
	* for: u0865.svg
* SYRIAC-LETTER-MALAYALAM-BHA.png
	* link: https://en.wikipedia.org/wiki/File:SYRIAC-LETTER-MALAYALAM-BHA.png
	* author: Raamesh
	* license: CC BY-SA 4.0
	* for: u0866.svg
* SYRIAC-LETTER-MALAYALAM-RA.png
	* link: https://en.wikipedia.org/wiki/File:SYRIAC-LETTER-MALAYALAM-RA.png
	* author: Raamesh
	* license: CC BY-SA 4.0
	* for: u0867.svg
* SYRIAC-LETTER-MALAYALAM-LLA.png
	* link: https://en.wikipedia.org/wiki/File:SYRIAC-LETTER-MALAYALAM-LLA.png
	* author: Raamesh
	* license: CC BY-SA 4.0
	* for: u0868.svg
* SYRIAC-LETTER-MALAYALAM-LLLA.png
	* link: https://en.wikipedia.org/wiki/File:SYRIAC-LETTER-MALAYALAM-LLLA.png
	* author: Raamesh
	* license: CC BY-SA 4.0
	* for: u0869.svg
* SYRIAC-LETTER-MALAYALAM-SSA.png
	* link: https://en.wikipedia.org/wiki/File:SYRIAC-LETTER-MALAYALAM-SSA.png
	* author: Raamesh
	* license: CC BY-SA 4.0
	* for: u086A.svg
* Астрологічні цифри сингальського письма. Sinhalese astrological numerals (Sinhala Lith Illakkam).png
	* link: https://commons.wikimedia.org/wiki/File:%D0%90%D1%81%D1%82%D1%80%D0%BE%D0%BB%D0%BE%D0%B3%D1%96%D1%87%D0%BD%D1%96_%D1%86%D0%B8%D1%84%D1%80%D0%B8_%D1%81%D0%B8%D0%BD%D0%B3%D0%B0%D0%BB%D1%8C%D1%81%D1%8C%D0%BA%D0%BE%D0%B3%D0%BE_%D0%BF%D0%B8%D1%81%D1%8C%D0%BC%D0%B0._Sinhalese_astrological_numerals_(Sinhala_Lith_Illakkam).png
	* author: 00 وديع
	* license: CC0 1.0
	* for: u0de6.svg .. u0def.svg
* Open Sans
	* link: https://fonts.google.com/specimen/Open+Sans
	* author: Steve Matteson and Google Corporation
	* license: SIL OFL 1.1
	* for: Control characters
* Linux Libertine
	* link: http://www.linuxlibertine.org/
	* author: Libertine Open Fonts Project and Philipp H. Poll
	* license: SIL OFL 1.1
	* for: Poster Design
* Cinzel
	* link: http://ndiscovered.com/cinzel/
	* author: Natanael Gama
	* license: SIL OFL 1.1
	* for: Poster Design
