import { readFileSync } from 'fs';
import { join } from 'path';

import { fromB1505, fromIV, fromOutput } from '../../from/b1505';
import { diodeOnResistance } from '../diodeOnResistance';
import { transistorOnResistance } from '../transistorOnResistance';

describe('Ron transistor', () => {
  it('Response object', () => {
    const filename = '../../../testFiles/B1505/Output/output.csv';
    const analyses = fromB1505(
      readFileSync(join(__dirname, filename), 'latin1'),
    );
    for (const analysis of analyses) {
      const spectrum = analysis.getMeasurementXY({
        xLabel: 'Vd',
        xUnits: 'V',
        yLabel: 'Id_dens',
        yUnits: 'A/mm',
      });
      if (spectrum) {
        const res = transistorOnResistance(spectrum);
        expect(res?.slope).toBeCloseTo(20.49, 2);
        expect(res?.score.r2).toBeCloseTo(0.977, 2);
      } else {
        expect(spectrum).not.toBeNull();
      }
    }
  });

  it('Auto save', () => {
    const filename = '../../../testFiles/B1505/Output/output.csv';
    const analyses = fromOutput(
      readFileSync(join(__dirname, filename), 'latin1'),
    );
    for (const analysis of analyses) {
      const spectrum = analysis.getMeasurementXY({
        xLabel: 'Vd',
        xUnits: 'V',
        yLabel: 'Id_dens',
        yUnits: 'A/mm',
      });
      expect(spectrum?.meta?.resistanceOn).toBeDefined();
      const res = JSON.parse(spectrum?.meta?.resistanceOn ?? '');
      expect(res?.slope).toBeCloseTo(20.49, 2);
      expect(res?.score.r2).toBeCloseTo(0.977, 2);
    }
  });
});

describe('Ron diode', () => {
  it('Response object', () => {
    const filename = '../../../testFiles/B1505/IV/sweep_diode.csv';
    const analyses = fromB1505(
      readFileSync(join(__dirname, filename), 'latin1'),
    );
    for (const analysis of analyses) {
      const spectrum = analysis.getMeasurementXY({
        xLabel: 'Vd',
        xUnits: 'V',
        yLabel: 'Id_dens',
        yUnits: 'A/mm',
      });
      if (spectrum) {
        const res = diodeOnResistance(spectrum);
        expect(res?.slope).toBeCloseTo(20.819, 2);
        expect(res?.score.r2).toBeCloseTo(0.992, 2);
        expect(res?.forwardVoltage).toBeCloseTo(3.05, 2);
        expect(res?.onVoltage).toBeCloseTo(0, 2);
      } else {
        expect(spectrum).not.toBeNull();
      }
    }
  });

  it('Auto save', () => {
    const filename = '../../../testFiles/B1505/IV/sweep_diode.csv';
    const analyses = fromIV(readFileSync(join(__dirname, filename), 'latin1'));
    for (const analysis of analyses) {
      const spectrum = analysis.getMeasurementXY({
        xLabel: 'Vd',
        xUnits: 'V',
        yLabel: 'Id_dens',
        yUnits: 'A/mm',
      });
      expect(spectrum?.meta?.resistanceOn).toBeDefined();
      const res = JSON.parse(spectrum?.meta?.resistanceOn ?? '');
      expect(res?.slope).toBeCloseTo(20.819, 2);
      expect(res?.score.r2).toBeCloseTo(0.992, 2);
      expect(res?.forwardVoltage).toBeCloseTo(3.05, 2);
      expect(res?.onVoltage).toBeCloseTo(0, 2);
    }
  });
});
