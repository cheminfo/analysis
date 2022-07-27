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
        x: { label: 'Vg', units: 'V' },
        y: { label: 'Id_dens', units: 'A/mm' },
      });
      if (measurement) {
        const res = subthresholdSlope(measurement);
        expect(res?.slope.value).toBeCloseTo(0.181, 2);
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
        x: { label: 'Vg', units: 'V' },
        y: { label: 'Id_dens', units: 'A/mm' },
      });
      expect(measurement?.meta?.subthresholdSlope).toBeDefined();
      const res = JSON.parse(measurement?.meta?.subthresholdSlope ?? '');
      expect(res?.slope.value).toBeCloseTo(0.181, 2);
    }
  });
});
