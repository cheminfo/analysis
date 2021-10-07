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
  // @ts-expect-error
  expect(measurement.variables.x.data).toHaveLength(408);
  // @ts-expect-error
  expect(measurement.variables.y.data).toHaveLength(408);
  // @ts-expect-error
  expect(measurement.variables.x.label).toStrictEqual('Temperature');
  // @ts-expect-error
  expect(measurement.variables.y.label).toStrictEqual('Weight');
});
