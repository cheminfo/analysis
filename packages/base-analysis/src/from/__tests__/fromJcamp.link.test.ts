import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '../fromJcamp';

test('fromJcamp linked file', () => {
  let jcamp = readFileSync(join(__dirname, './data/uv-link.jdx'), 'utf8');

  let result = fromJcamp(jcamp);

  expect(result.measurements).toHaveLength(2);

  let first = result.measurements[0];

  expect(first.variables.x.data).toHaveLength(911);
  expect(first.variables.y.data).toHaveLength(911);
  expect(first.variables.x.label).toBe('NANOMETERS');
  expect(first.variables.y.label).toBe('ABSORBANCE');

  let second = result.measurements[1];

  expect(second.variables.x.data).toHaveLength(911);
  expect(second.variables.y.data).toHaveLength(911);
  expect(second.variables.x.label).toBe('NANOMETERS');
  expect(second.variables.y.label).toBe('VARIANCE');
});
