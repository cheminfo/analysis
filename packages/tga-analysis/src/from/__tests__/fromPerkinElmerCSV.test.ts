import { readFileSync } from 'fs';
import { join } from 'path';

import { toJcamp, fromJcamp } from '../..';
import { fromPerkinElmerCSV } from '../fromPerkinElmerCSV';

test('fromPerkinElmer', () => {
  let csv = readFileSync(
    join(__dirname, '../../../testFiles/perkinElmer.csv'),
    'latin1',
  );
  let analysis = fromPerkinElmerCSV(csv);

  let measurement1 = analysis.getMeasurementXY({ index: 0 });

  expect(measurement1?.variables.x.data).toHaveLength(8637);
  expect(measurement1?.variables.y.data).toHaveLength(8637);
  expect(measurement1?.variables.x.label).toStrictEqual('Sample temperature');
  expect(measurement1?.variables.y.label).toStrictEqual('Weight');
  expect(measurement1?.dataType).toBe('TGA');

  const jcamp = toJcamp(analysis);
  const measurementCopy = fromJcamp(jcamp).measurements[0];
  expect(measurementCopy.variables.x.units).toStrictEqual('°C');
  expect(measurementCopy.variables.x.label).toStrictEqual('Sample temperature');
  expect(measurementCopy.variables.y.units).toStrictEqual('mg');
  expect(measurementCopy.variables.y.label).toStrictEqual('Weight');

  // @ts-expect-error
  expect(measurementCopy.variables.t.units).toStrictEqual('min');
  // @ts-expect-error
  expect(measurementCopy.variables.t.label).toStrictEqual('Time');

  // @ts-expect-error
  expect(measurementCopy.variables.p.units).toStrictEqual('°C');
  // @ts-expect-error
  expect(measurementCopy.variables.p.label).toStrictEqual(
    'Program temperature',
  );
});
