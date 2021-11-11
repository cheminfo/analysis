import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from 'base-analysis';

test('fromJcamp', () => {
  const jcamp = readFileSync(
    join(__dirname, '../../testFiles/test.jdx'),
    'utf8',
  );
  const analysis = fromJcamp(jcamp);
  const measurement = analysis.measurements[0];
  expect(measurement.variables.x.data).toHaveLength(120);
  expect(measurement.variables.y.data).toHaveLength(120);
  expect(measurement.meta?.workingTemperature).toBe(298);
});
