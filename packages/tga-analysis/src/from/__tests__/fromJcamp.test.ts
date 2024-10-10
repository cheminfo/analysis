import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '../..';

test('fromJcamp', () => {
  const jcamp = readFileSync(
    join(__dirname, '../../../testFiles/jcamp.jdx'),
    'utf8',
  );
  const analysis = fromJcamp(jcamp);

  const measurement1 = analysis.getMeasurementXY();

  if (!measurement1) throw new Error('Could not getMeasurementXY');
  expect(measurement1.variables.x.data).toHaveLength(2251);
  expect(measurement1.variables.y.data).toHaveLength(2251);
  expect(measurement1.variables.x.label).toBe('Ts');
  expect(measurement1.variables.x.units).toBe('°C');
  expect(measurement1.variables.y.label).toBe('Value');
  expect(measurement1.variables.y.units).toBe('mg');

  const measurement2 = analysis.getMeasurementXY({
    x: { units: 's' },
    y: { units: 'mg' },
  });

  expect(measurement2.variables.x.data).toHaveLength(2251);
  expect(measurement2.variables.y.data).toHaveLength(2251);
  expect(measurement2.variables.x.label).toBe('t');
  expect(measurement2.variables.y.label).toBe('Value');
});
