import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '../..';

test('fromJcamp', () => {
  let jcamp = readFileSync(
    join(__dirname, '../../../testFiles/ntuples.jdx'),
    'utf8',
  );
  let analysis = fromJcamp(jcamp);

  let measurement = analysis.getMeasurementXY();
  expect(measurement.variables.x.data).toHaveLength(408);
  expect(measurement.variables.y.data).toHaveLength(408);
  expect(measurement.variables.x.label).toBe('Temperature');
  expect(measurement.variables.y.label).toBe('Weight');
});
