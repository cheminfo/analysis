import { readFileSync } from 'fs';
import { join } from 'path';

import { fromText } from '../fromText';

test('fromText', () => {
  const arrayBuffer = readFileSync(join(__dirname, 'data/uv.txt'));

  const result = fromText(arrayBuffer, {
    info: {
      xUnits: 'cm-1',
      yUnits: '',
      xLabel: 'Wavenumber',
      yLabel: 'Intensity',
      dataType: 'UV measurement',
    },
  });

  expect(result.measurements).toHaveLength(1);

  const first = result.measurements[0];

  expect(first.variables.x.data).toHaveLength(551);
  expect(first.variables.y.data).toHaveLength(551);
  expect(first.variables.x.label).toBe('Wavenumber');
  expect(first.variables.x.units).toBe('cm-1');
  expect(first.variables.y.label).toBe('Intensity');
  expect(first.variables.y.units).toBe('');
});
