# tga-analysis

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Parse TGA files from

- Perkin Elmer `txt` and `csv` files
- TA instruments `txt` and `xls` files
- Perkin Elmer
- Netzsch
- Mettler Toledo

## Installation

`$ npm i tga-analysis`

## Usage

```js
import TGASpectrum from 'tga-analysis';

let analysis = TGASpectrum.fromJcamp(jcamp);
```

## [API Documentation](https://cheminfo.github.io/tga-analysis/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/tga-analysis.svg
[npm-url]: https://www.npmjs.com/package/tga-analysis
[ci-image]: https://github.com/cheminfo/tga-analysis/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/cheminfo/tga-analysis/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/tga-analysis.svg
[codecov-url]: https://codecov.io/gh/cheminfo/tga-analysis
[download-image]: https://img.shields.io/npm/dm/tga-analysis.svg
[download-url]: https://www.npmjs.com/package/tga-analysis
