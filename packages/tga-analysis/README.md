# tga-analysis

[![NPM version][npm-image]][npm-url]
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

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/tga-analysis.svg
[npm-url]: https://www.npmjs.com/package/tga-analysis
[download-image]: https://img.shields.io/npm/dm/tga-analysis.svg
[download-url]: https://www.npmjs.com/package/tga-analysis
