import { readFileSync } from 'fs';
import assert from 'node:assert';
import { join } from 'path';

import { fromJcamp, toJcamp } from '../..';
import { fromPerkinElmerCSV } from '../fromPerkinElmerCSV';

test('fromPerkinElmer', () => {
  const csv = readFileSync(
    join(__dirname, '../../../testFiles/perkinElmer.csv'),
    'latin1',
  );
  const analysis = fromPerkinElmerCSV(csv);

  const measurement1 = analysis.getMeasurementXY({ index: 0 });

  expect(measurement1?.variables.x.data).toHaveLength(8637);
  expect(measurement1?.variables.y.data).toHaveLength(8637);
  expect(measurement1?.variables.x.label).toBe('Sample temperature');
  expect(measurement1?.variables.y.label).toBe('Weight');
  expect(measurement1?.dataType).toBe('TGA');

  const jcamp = toJcamp(analysis);
  const measurementCopy = fromJcamp(jcamp).measurements[0];
  expect(measurementCopy.variables.x.units).toBe('°C');
  expect(measurementCopy.variables.x.label).toBe('Sample temperature');
  expect(measurementCopy.variables.y.units).toBe('mg');
  expect(measurementCopy.variables.y.label).toBe('Weight');

  assert(measurementCopy.variables.t);
  expect(measurementCopy.variables.t.units).toBe('min');
  expect(measurementCopy.variables.t.label).toBe('Time');

  assert(measurementCopy.variables.p);
  expect(measurementCopy.variables.p.units).toBe('°C');
  expect(measurementCopy.variables.p.label).toBe('Program temperature');
});
