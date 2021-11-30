import { readFileSync } from 'fs';
import { join } from 'path';

import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { fromJcamp } from '../fromJcamp';
import { fromSPC } from '../fromSPC';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

test('from', () => {
  let jcamp = readFileSync(join(__dirname, './data/NDR0002.JDX'), 'utf8');
  let variablesJcamp = fromJcamp(jcamp).spectra[0].variables;
  let spc = readFileSync(join(__dirname, './data/NDR0002.SPC'));
  let variablesSPC = fromSPC(spc).spectra[0].variables;
  expect(variablesJcamp.x.min).toBeCloseTo(variablesSPC.x.min, 5);
  expect(variablesJcamp.x.max).toBeCloseTo(variablesSPC.x.max, 5);
  expect(variablesJcamp.y.min).toBeCloseTo(variablesSPC.y.min, 5);
  expect(variablesJcamp.y.max).toBeCloseTo(variablesSPC.y.max, 5);
});
