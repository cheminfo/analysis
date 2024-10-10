import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '../..';

test('fromJcamp', () => {
  const jcamp = readFileSync(
    join(__dirname, '../../../testFiles/ntuples.jdx'),
    'utf8',
  );
  const analysis = fromJcamp(jcamp);

  const measurement = analysis.getMeasurementXY();
  expect(measurement.variables.x.data).toHaveLength(408);
  expect(measurement.variables.y.data).toHaveLength(408);
  expect(measurement.variables.x.label).toBe('Temperature');
  expect(measurement.variables.y.label).toBe('Weight');
});
