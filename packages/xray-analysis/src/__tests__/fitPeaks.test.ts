import { readFileSync } from 'fs';
import { join } from 'path';

import { fromText } from 'base-analysis';

import { fitPeaks } from '../calculations/fitPeaks';

describe('Check peaks', () => {
  it('XRD', () => {
    const content = readFileSync(
      join(__dirname, '../../testFiles/XRD.csv'),
      'latin1',
    );
    const analysis = fromText(content);
    let measurement = analysis.measurements[0];
    const peaks = fitPeaks(measurement);
    expect(peaks.peaks).toHaveLength(2);
    expect(peaks.error).toBeCloseTo(3.255, 2);
  });
  it('XRC', () => {
    const content = readFileSync(
      join(__dirname, '../../testFiles/XRC.csv'),
      'latin1',
    );
    const analysis = fromText(content);
    let measurement = analysis.measurements[0];
    const peaks = fitPeaks(measurement);
    expect(peaks.peaks).toHaveLength(1);
    expect(peaks.error).toBeCloseTo(0.001, 2);
  });
});
