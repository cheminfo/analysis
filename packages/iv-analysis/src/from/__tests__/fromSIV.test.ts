import { readFileSync } from 'fs';
import { join } from 'path';

import { fromSIV } from '../fromSIV';

test('fromSIV', () => {
  let siv = readFileSync(
    join(__dirname, '../../../testFiles/test.sIv'),
    'utf8',
  );
  let analysis = fromSIV(siv);

  const experiments: string[] = analysis.spectra.map(
    ({ meta }) => meta?.experiment || '',
  );
  expect(experiments).toStrictEqual([
    'DarkCurrent',
    'PhotoCurrent0',
    'PhotoCurrent2',
    'PhotoCurrent4',
    'transient0',
  ]);
  const spectrum = analysis.spectra[0];
  expect(spectrum.variables.x.data).toHaveLength(120);
  expect(spectrum.variables.y.data).toHaveLength(120);
  expect(Object.keys(spectrum.meta || {})).toHaveLength(18);

  expect(Object.keys(analysis.spectra[4].variables.x.data)).toHaveLength(1536);
  expect(Object.keys(analysis.spectra[4].variables.y.data)).toHaveLength(1536);
});
