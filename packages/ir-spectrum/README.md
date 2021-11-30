# ir-spectrum

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

TODO: Description of the package.

## Installation

`$ npm i ir-spectrum`

## Usage

```js
import IRSpectrum from 'ir-spectrum';

let analysis = IRSpectrum.fromJcamp(jcamp);
```

When loading an IRSpectrum from Jcamp we will systematically add 2 new variables:

- a: containing the absorbance
- t: containing the percent transmittance

In order to calculate those 2 variables we will check the Y label. If it contains
transmittance we calculate absorbance, if it contains absorbance we calculate transmittance.
For transmittance we also check for the presence of a '%' sign.:w

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/ir-spectrum.svg
[npm-url]: https://www.npmjs.com/package/ir-spectrum
[download-image]: https://img.shields.io/npm/dm/ir-spectrum.svg
[download-url]: https://www.npmjs.com/package/ir-spectrum
