import { readFileSync } from 'fs';
import { join } from 'path';

import { fromPerkinElmer } from '../fromPerkinElmer';

test('fromPerkinElmer', () => {
  let jcamp = readFileSync(
    join(__dirname, '../../../testFiles/perkinElmer_tga4000.txt'),
    'latin1',
  );
  let analysis = fromPerkinElmer(jcamp);

  let measurement1 = analysis.getMeasurementXY();
  expect(measurement1).toBeDefined();
  expect(measurement1?.variables.x.data).toHaveLength(1155);
  expect(measurement1?.variables.y.data).toHaveLength(1155);
  expect(measurement1?.variables.x.label).toStrictEqual('Temperature');
  expect(measurement1?.variables.y.label).toStrictEqual('Weight');
  expect(measurement1?.variables.x.units).toStrictEqual('°C');
  expect(measurement1?.variables.y.units).toStrictEqual('mg');
  expect(measurement1?.meta?.methodSteps).toHaveLength(6);

  let measurement2 = analysis.getMeasurementXY({ units: 'mg vs s' });

  expect(measurement2?.variables.x.data).toHaveLength(1155);
  expect(measurement2?.variables.y.data).toHaveLength(1155);
  expect(measurement2?.variables.x.label).toStrictEqual('Time');
  expect(measurement2?.variables.y.label).toStrictEqual('Weight');
  expect(measurement2?.variables.x.units).toStrictEqual('s');
  expect(measurement2?.variables.y.units).toStrictEqual('mg');
});
