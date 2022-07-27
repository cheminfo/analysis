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
  expect(measurement1?.variables.x.label).toBe('Temperature');
  expect(measurement1?.variables.y.label).toBe('Weight');
  expect(measurement1?.variables.x.units).toBe('°C');
  expect(measurement1?.variables.y.units).toBe('mg');
  expect(measurement1?.meta?.methodSteps).toHaveLength(6);

  let measurement2 = analysis.getMeasurementXY({
    x: { units: 's' },
    y: { units: 'mg' },
  });

  expect(measurement2?.variables.x.data).toHaveLength(1155);
  expect(measurement2?.variables.y.data).toHaveLength(1155);
  expect(measurement2?.variables.x.label).toBe('Time');
  expect(measurement2?.variables.y.label).toBe('Weight');
  expect(measurement2?.variables.x.units).toBe('s');
  expect(measurement2?.variables.y.units).toBe('mg');
});
