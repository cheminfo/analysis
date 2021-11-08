import { readFileSync } from 'fs';
import { join } from 'path';

import { fromMulChannelCap } from '../fromMulChannelCap';

test('fromMulChannelCap', () => {
  let csv = readFileSync(
    join(__dirname, '../../../testFiles/capacitanceStudy.csv'),
    'latin1',
  );
  let analysis = fromMulChannelCap(csv);
  let spectrum = analysis.getMeasurementXY({ xLabel: 'Vd', yLabel: 'Id' });

  expect(spectrum?.variables.x.data).toHaveLength(6);
  expect(spectrum?.variables.x.label).toBe('Vd');

  expect(spectrum?.variables.y.data).toHaveLength(6);
  expect(spectrum?.variables.y.label).toBe('Id');

  expect(analysis?.label).toBe('Vg = 7V');
});
