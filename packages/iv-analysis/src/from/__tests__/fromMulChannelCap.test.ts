import { readFileSync } from 'fs';
import { join } from 'path';

import { fromMulChannelCap } from '../fromMulChannelCap';

test('fromMulChannelCap', () => {
  let csv = readFileSync(
    join(__dirname, '../../../testFiles/capacitanceStudy.csv'),
    'latin1',
  );
  let analysis = fromMulChannelCap(csv);
  let measurement = analysis.getMeasurementXY({ xLabel: 'Vd', yLabel: 'Id' });

  expect(measurement?.variables.x.data).toHaveLength(6);
  expect(measurement?.variables.x.label).toBe('Vd');

  expect(measurement?.variables.y.data).toHaveLength(6);
  expect(measurement?.variables.y.label).toBe('Id');

  expect(analysis?.label).toBe('Vg = 7V');
});
