import { readFileSync } from 'fs';
import { join } from 'path';

import { fromXRD, fromXRC } from '../fromXRay';

test('fromXRD', () => {
  const csv = readFileSync(
    join(__dirname, '../../../testFiles/XRD.csv'),
    'utf8',
  );
  const analysis = fromXRD(csv);
  let measurement = analysis.getMeasurementXY();

  expect(measurement?.variables.x.data).toHaveLength(2201);
  expect(measurement?.variables.x.label).toBe('x');

  expect(measurement?.variables.y.data).toHaveLength(2201);
  expect(measurement?.variables.y.label).toBe('y');
});

test('fromXRC', () => {
  const csv = readFileSync(
    join(__dirname, '../../../testFiles/XRC.csv'),
    'utf8',
  );
  const analysis = fromXRC(csv);
  let measurement = analysis.getMeasurementXY();

  expect(measurement?.variables.x.data).toHaveLength(641);
  expect(measurement?.variables.x.label).toBe('x');

  expect(measurement?.variables.y.data).toHaveLength(641);
  expect(measurement?.variables.y.label).toBe('y');
});
