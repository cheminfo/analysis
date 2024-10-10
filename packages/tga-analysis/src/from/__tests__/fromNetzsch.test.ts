import { readFileSync } from 'fs';
import { join } from 'path';

import { toJcamp } from '../..';
import { fromNetzsch } from '../fromNetzsch';

test('fromNetzsch', () => {
  const text = readFileSync(join(__dirname, '../../../testFiles/netzsch.txt'));
  const result = fromNetzsch(text);

  expect(result.measurements).toHaveLength(1);
  const measurement = result.getFirstMeasurement();
  expect(Object.keys(measurement.variables)).toStrictEqual(['x', 'y', 't']);
  expect(measurement.variables.x.data[0]).toBe(27.141);
  expect(measurement.variables.y.data[0]).toBe(890.9062668);
  expect(measurement.variables.x.data).toHaveLength(270);
  expect(measurement.variables.y.data).toHaveLength(270);
  expect(measurement.variables?.t?.data ?? []).toHaveLength(270);
  const jcamp = toJcamp(result);
  expect(jcamp.length).toBeGreaterThan(7500);
  expect(jcamp.length).toBeLessThan(9500);
});
