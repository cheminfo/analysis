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
      const spectrum = analysis.getMeasurementXY({
        xLabel: 'Vd',
        xUnits: 'V',
        yLabel: 'Id_dens',
        yUnits: 'A/mm',
      });
      if (spectrum) {
        const res = thresholdVoltage(spectrum);
        expect(res?.value).toBeCloseTo(555, 2);
      } else {
        expect(spectrum).not.toBeNull();
      }
    }
  });

  it('Auto save', () => {
    const analyses = fromBreakdown(
      readFileSync(join(__dirname, breakdownFilename), 'latin1'),
    );
    for (const analysis of analyses) {
      const spectrum = analysis.getMeasurementXY({
        xLabel: 'Vd',
        xUnits: 'V',
        yLabel: 'Id_dens',
        yUnits: 'A/mm',
      });
      expect(spectrum?.meta?.thresholdVoltage).not.toBeUndefined();
      const res = JSON.parse(spectrum?.meta?.thresholdVoltage ?? '');
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
      const spectrum = analysis.getMeasurementXY({
        xLabel: 'Vg',
        xUnits: 'V',
        yLabel: 'Id_dens',
        yUnits: 'A/mm',
      });
      if (spectrum) {
        const res = thresholdVoltage(spectrum);
        expect(res?.value).toBeCloseTo(-1.2, 2);
      } else {
        expect(spectrum).not.toBeNull();
      }
    }
  });

  it('Auto save', () => {
    const analyses = fromTransfer(
      readFileSync(join(__dirname, transferFilename), 'latin1'),
    );
    for (const analysis of analyses) {
      const spectrum = analysis.getMeasurementXY({
        xLabel: 'Vg',
        xUnits: 'V',
        yLabel: 'Id_dens',
        yUnits: 'A/mm',
      });
      expect(spectrum?.meta?.thresholdVoltage).not.toBeUndefined();
      const res = JSON.parse(spectrum?.meta?.thresholdVoltage ?? '');
      expect(res?.value).toBeCloseTo(-1.2, 2);
    }
  });
});
