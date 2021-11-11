import { readFileSync } from 'fs';
import { join } from 'path';

import { fromSIV } from '../fromSIV';

test('fromSIV', () => {
  let siv = readFileSync(
    join(__dirname, '../../../testFiles/test.sIv'),
    'utf8',
  );
  let analysis = fromSIV(siv);

  const experiments: string[] = analysis.measurements.map(
    ({ meta }) => meta?.experiment || '',
  );
  expect(experiments).toStrictEqual([
    'DarkCurrent',
    'PhotoCurrent0',
    'PhotoCurrent2',
    'PhotoCurrent4',
    'transient0',
  ]);
  const measurement = analysis.measurements[0];
  expect(measurement.variables.x.data).toHaveLength(120);
  expect(measurement.variables.y.data).toHaveLength(120);
  expect(Object.keys(measurement.meta || {})).toHaveLength(18);

  expect(Object.keys(analysis.measurements[4].variables.x.data)).toHaveLength(
    1536,
  );
  expect(Object.keys(analysis.measurements[4].variables.y.data)).toHaveLength(
    1536,
  );
});
