import { readFileSync } from 'fs';
import { join } from 'path';

import { fromB1505, fromTransfer } from '../../from/b1505';
import { subthresholdSlope } from '../subthresholdSlope';

const filename = '../../../testFiles/B1505/Transfer/noff_trigate.csv';
describe('ss transfer', () => {
  it('Response object', () => {
    const analyses = fromB1505(
      readFileSync(join(__dirname, filename), 'latin1'),
    );
    for (const analysis of analyses) {
      const measurement = analysis.getMeasurementXY({
        xLabel: 'Vg',
        xUnits: 'V',
        yLabel: 'Id_dens',
        yUnits: 'A/mm',
      });
      if (measurement) {
        const res = subthresholdSlope(measurement);
        expect(res?.medianSlope.value).toBeCloseTo(0.476, 2);
      } else {
        expect(measurement).not.toBeNull();
      }
    }
  });

  it('Auto save', () => {
    const analyses = fromTransfer(
      readFileSync(join(__dirname, filename), 'latin1'),
    );
    for (const analysis of analyses) {
      const measurement = analysis.getMeasurementXY({
        xLabel: 'Vg',
        xUnits: 'V',
        yLabel: 'Id_dens',
        yUnits: 'A/mm',
      });
      expect(measurement?.meta?.subthresholdSlope).toBeDefined();
      const res = JSON.parse(measurement?.meta?.subthresholdSlope ?? '');
      expect(res?.medianSlope.value).toBeCloseTo(0.476, 2);
    }
  });
});
