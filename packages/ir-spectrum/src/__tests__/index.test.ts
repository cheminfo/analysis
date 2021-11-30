import { readFileSync } from 'fs';
import { join } from 'path';

import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { fromJcamp, autoPeakPicking } from '..';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

test('autoPeakPicking', () => {
  const jcamp = readFileSync(join(__dirname, './data/absorbance.jdx'));

  const result = fromJcamp(jcamp);
  const peaks = autoPeakPicking(result.getSpectrum());

  expect(peaks).toHaveLength(109);
});
