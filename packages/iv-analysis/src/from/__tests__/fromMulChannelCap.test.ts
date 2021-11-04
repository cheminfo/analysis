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
  expect(spectrum?.variables.x.label).toStrictEqual('Vd [V]');

  expect(spectrum?.variables.y.data).toHaveLength(6);
  expect(spectrum?.variables.y.label).toStrictEqual('Id [A]');

  expect(spectrum?.title).toBe('Vg = 7V');
});
