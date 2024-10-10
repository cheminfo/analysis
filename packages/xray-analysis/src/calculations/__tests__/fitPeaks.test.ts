import { readFileSync } from 'fs';
import { join } from 'path';

import { fromText } from 'base-analysis';

import { fitPeaks } from '../fitPeaks';

test('XRD', () => {
  const content = readFileSync(
    join(__dirname, '../../../testFiles/XRD.csv'),
    'latin1',
  );
  const analysis = fromText(content);
  const measurement = analysis.measurements[0];
  const peaks = fitPeaks(measurement);
  expect(peaks.peaks).toHaveLength(3);
  expect(peaks.error).toBeCloseTo(6.356, 2);
});
