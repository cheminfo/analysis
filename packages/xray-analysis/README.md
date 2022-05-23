# xray-analysis

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

X-ray analysis package for treatment of an x-ray rocking curve (XRC) and an x-ray diffraction (XRD) measurement

## Installation

`$ npm i xray-analysis`

## Usage

```ts
export { fromXRay } from 'xray-analysis';

const content = readFileSync(join(__dirname, 'XRD.csv'), 'latin1');
const analysis = fromXRay(content);
const measurement = analysis.measurements[0];
const peaks = measurement.meta?.peaks.map(({ x, y, shape }) => ({
  x, // x-position
  y, // intensity
  width: shape.fwhm, // Full width at half maximum
}));
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/xray-analysis.svg
[npm-url]: https://www.npmjs.com/package/xray-analysis
[download-image]: https://img.shields.io/npm/dm/xray-analysis.svg
[download-url]: https://www.npmjs.com/package/xray-analysis
