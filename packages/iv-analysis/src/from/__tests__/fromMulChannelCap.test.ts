import { readFileSync } from 'fs';
import { join } from 'path';

import { fromMulChannelCap } from '../fromMulChannelCap';

test('fromMulChannelCap', () => {
  const csv = readFileSync(
    join(__dirname, '../../../testFiles/capacitanceStudy.csv'),
    'latin1',
  );
  const analysis = fromMulChannelCap(csv);
  const measurement = analysis.getMeasurementXY({
    x: { label: 'Vd' },
    y: { label: 'Id' },
  });

  expect(measurement?.variables.x.data).toHaveLength(6);
  expect(measurement?.variables.x.label).toBe('Vd');

  expect(measurement?.variables.y.data).toHaveLength(6);
  expect(measurement?.variables.y.label).toBe('Id');

  expect(analysis?.label).toBe('Vg = 7V');
});
