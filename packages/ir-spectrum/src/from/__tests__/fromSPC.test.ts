import { readFileSync } from 'fs';
import { join } from 'path';

import { toJcamp } from 'base-analysis';
import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { fromSPC } from '../fromSPC';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

test('fromSPC', () => {
  let buffer = readFileSync(join(__dirname, './data/absorbance.spc'));

  let analysis = fromSPC(buffer);

  let jcamp = toJcamp(analysis, {});
  expect(jcamp.split('\n')).toHaveLength(1826);
  expect(analysis.spectra).toHaveLength(1);

  let first = analysis.spectra[0];

  expect(first.variables.x.data).toHaveLength(1776);
  expect(first.variables.y.data).toHaveLength(1776);
  expect(first.variables.a.data).toHaveLength(1776);
  expect(first.variables.t.data).toHaveLength(1776);
  expect(first.variables.x.label).toStrictEqual('Wavenumber');
  expect(first.variables.y.label).toStrictEqual('Transmission');
  expect(first.variables.a.label).toStrictEqual('Absorbance');
  expect(first.variables.t.label).toStrictEqual('Transmittance (%)');
  expect(first.variables.a.min).toBeDeepCloseTo(-2, 5);
  expect(first.variables.a.max).toBeDeepCloseTo(-0.5194697976112366, 5);
  expect(first.variables.t.min).toBeDeepCloseTo(330.72711181640625, 5);
  expect(first.variables.t.max).toBeDeepCloseTo(10000, 5);
});
