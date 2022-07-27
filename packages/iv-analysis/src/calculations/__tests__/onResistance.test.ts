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
      const measurement = analysis.getMeasurementXY({
        x: { label: 'Vd', units: 'V' },
        y: { label: 'Id_dens', units: 'A/mm' },
      });
      if (measurement) {
        const res = transistorOnResistance(measurement);
        expect(res?.slope.value).toBeCloseTo(20.49, 2);
        expect(res?.score.r2).toBeCloseTo(0.977, 2);
      } else {
        expect(measurement).not.toBeNull();
      }
    }
  });

  it('Auto save', () => {
    const filename = '../../../testFiles/B1505/Output/output.csv';
    const analyses = fromOutput(
      readFileSync(join(__dirname, filename), 'latin1'),
    );
    for (const analysis of analyses) {
      const measurement = analysis.getMeasurementXY({
        x: { label: 'Vd', units: 'V' },
        y: { label: 'Id_dens', units: 'A/mm' },
      });
      expect(measurement?.meta?.resistanceOn).toBeDefined();
      const res = JSON.parse(measurement?.meta?.resistanceOn ?? '');
      expect(res?.slope.value).toBeCloseTo(20.49, 2);
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
      const measurement = analysis.getMeasurementXY({
        x: { label: 'Vd', units: 'V' },
        y: { label: 'Id_dens', units: 'A/mm' },
      });
      if (measurement) {
        const res = diodeOnResistance(measurement);
        expect(res?.slope.value).toBeCloseTo(20.819, 2);
        expect(res?.score.r2).toBeCloseTo(0.992, 2);
        expect(res?.forwardVoltage).toBeCloseTo(3.05, 2);
        expect(res?.onVoltage).toBeCloseTo(0, 2);
      } else {
        expect(measurement).not.toBeNull();
      }
    }
  });

  it('Auto save', () => {
    const filename = '../../../testFiles/B1505/IV/sweep_diode.csv';
    const analyses = fromIV(readFileSync(join(__dirname, filename), 'latin1'));
    for (const analysis of analyses) {
      const measurement = analysis.getMeasurementXY({
        x: { label: 'Vd', units: 'V' },
        y: { label: 'Id_dens', units: 'A/mm' },
      });
      expect(measurement?.meta?.resistanceOn).toBeDefined();
      const res = JSON.parse(measurement?.meta?.resistanceOn ?? '');
      expect(res?.slope.value).toBeCloseTo(20.819, 2);
      expect(res?.score.r2).toBeCloseTo(0.992, 2);
      expect(res?.forwardVoltage).toBeCloseTo(3.05, 2);
      expect(res?.onVoltage).toBeCloseTo(0, 2);
    }
  });
});
