import { readFileSync } from 'fs';
import { join } from 'path';

import { fromB1505, fromBreakdown, fromTransfer } from '../../from/b1505';
import { thresholdVoltage } from '../thresholdVoltage';

const breakdownFilename = '../../../testFiles/B1505/Breakdown/breakdown.csv';
describe('Vth breakdown', () => {
  it('Response object', () => {
    const analyses = fromB1505(
      readFileSync(join(__dirname, breakdownFilename), 'latin1'),
    );
    for (const analysis of analyses) {
      const measurement = analysis.getMeasurementXY({
        x: { label: 'Vd', units: 'V' },
        y: { label: 'Id_dens', units: 'A/mm' },
      });
      if (measurement) {
        const res = thresholdVoltage(measurement);
        expect(res?.value).toBeCloseTo(555, 2);
      } else {
        expect(measurement).not.toBeNull();
      }
    }
  });

  it('Auto save', () => {
    const analyses = fromBreakdown(
      readFileSync(join(__dirname, breakdownFilename), 'latin1'),
    );
    for (const analysis of analyses) {
      const measurement = analysis.getMeasurementXY({
        x: { label: 'Vd', units: 'V' },
        y: { label: 'Id_dens', units: 'A/mm' },
      });
      expect(measurement?.meta?.thresholdVoltage).toBeDefined();
      const res = JSON.parse(measurement?.meta?.thresholdVoltage ?? '');
      expect(res?.value).toBeCloseTo(555, 2);
    }
  });
});

const transferFilename = '../../../testFiles/B1505/Transfer/hemt_transfer.csv';
describe('Vth transfer', () => {
  it('Response object', () => {
    const analyses = fromB1505(
      readFileSync(join(__dirname, transferFilename), 'latin1'),
    );
    for (const analysis of analyses) {
      const measurement = analysis.getMeasurementXY({
        x: { label: 'Vg', units: 'V' },
        y: { label: 'Id_dens', units: 'A/mm' },
      });
      if (measurement) {
        const res = thresholdVoltage(measurement);
        expect(res?.value).toBeCloseTo(-1.2, 2);
      } else {
        expect(measurement).not.toBeNull();
      }
    }
  });

  it('Auto save', () => {
    const analyses = fromTransfer(
      readFileSync(join(__dirname, transferFilename), 'latin1'),
    );
    for (const analysis of analyses) {
      const measurement = analysis.getMeasurementXY({
        x: { label: 'Vg', units: 'V' },
        y: { label: 'Id_dens', units: 'A/mm' },
      });
      expect(measurement?.meta?.thresholdVoltage).toBeDefined();
      const res = JSON.parse(measurement?.meta?.thresholdVoltage ?? '');
      expect(res?.value).toBeCloseTo(-1.2, 2);
    }
  });
});
