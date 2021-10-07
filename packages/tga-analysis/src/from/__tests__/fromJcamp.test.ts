import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '../..';

test('fromJcamp', () => {
  let jcamp = readFileSync(
    join(__dirname, '../../../testFiles/jcamp.jdx'),
    'utf8',
  );
  let analysis = fromJcamp(jcamp);

  let measurement1 = analysis.getMeasurementXY();

  if (!measurement1) throw new Error('Could not getMeasurementXY');
  expect(measurement1.variables.x.data).toHaveLength(2251);
  expect(measurement1.variables.y.data).toHaveLength(2251);
  expect(measurement1.variables.x.label).toStrictEqual('Ts');
  expect(measurement1.variables.x.units).toStrictEqual('°C');
  expect(measurement1.variables.y.label).toStrictEqual('Value');
  expect(measurement1.variables.y.units).toStrictEqual('mg');

  let measurement2 = analysis.getMeasurementXY({ units: 'mg vs s' });

  // @ts-expect-error
  expect(measurement2.variables.x.data).toHaveLength(2251);
  // @ts-expect-error
  expect(measurement2.variables.y.data).toHaveLength(2251);
  // @ts-expect-error
  expect(measurement2.variables.x.label).toStrictEqual('t');
  // @ts-expect-error
  expect(measurement2.variables.y.label).toStrictEqual('Value');
});
