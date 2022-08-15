# base-analysis

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

Common package to deal with spectral analysis.

An `Analysis` may be composed of many `Measurements` of different flavors.

By default the flavor is an empty string and if your analysis only generates
one spectrum you may forget this level of complexity.

In the case of Thermogravitational Analysis (TGA) we may have 2 flavor for the data:

- Weight versus Temperature
- Weight versus Time

This package allow to load / save an Analysis as a JCAMP-DX text file.

## Installation

`$ npm i base-analysis`

## Usage

```js
import { Analysis, fromJcamp, toJcamp, getJSGraph } from '..';

let analysis = new Analysis();
expect(analysis.id).toHaveLength(8);

analysis.pushMeasurement(
  { x: [1, 2], y: [3, 4] },
  {
    xUnits: 'xUnits',
    yUnits: 'yUnits',
    xLabel: 'X axis',
    yLabel: 'Y axis',
    title: 'My spectrum',
    dataType: 'TGA',
    meta: {
      meta1: 'Meta 1',
      meta2: 'Meta 2',
    },
  },
);

let firstAnalysis = analysis.getMeasurement();

let normalized = analysis.getNormalizedMeasurement({
  normalization: {
    filters: [{ name: 'normed' }],
  },
});

let jsgraph = getJSGraph([analysis]);

let jcamp = toJcamp(analysis, {
  info: {
    owner: 'cheminfo',
    origin: 'Base analysis',
  },
});

let analysis2 = fromJcamp(jcamp);
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/base-analysis.svg
[npm-url]: https://www.npmjs.com/package/base-analysis
[download-image]: https://img.shields.io/npm/dm/base-analysis.svg
[download-url]: https://www.npmjs.com/package/base-analysis
