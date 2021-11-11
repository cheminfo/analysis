import { readFileSync } from 'fs';
import { join } from 'path';

import {
  fromB1505,
  fromCapacitance,
  fromMOSCapacitance,
} from '../../from/b1505';
import { capacitanceIntegral } from '../capacitanceIntegral';

const basicFilename = '../../../testFiles/B1505/Capacitance/high_voltage.csv';
describe('Capacitance integral on high voltage', () => {
  it('Response object', () => {
    const analyses = fromB1505(
      readFileSync(join(__dirname, basicFilename), 'latin1'),
    );
    for (const analysis of analyses) {
      const measurement = analysis.getMeasurementXY({
        xLabel: 'Vd',
        xUnits: 'V',
        yLabel: 'C_dens',
        yUnits: 'F/mm',
      });
      if (measurement) {
        const res = capacitanceIntegral(measurement);
        expect(res?.integral.value).toBeCloseTo(2.1483e-11, 10);
      } else {
        expect(measurement).not.toBeNull();
      }
    }
  });

  it('Auto save', () => {
    const analyses = fromCapacitance(
      readFileSync(join(__dirname, basicFilename), 'latin1'),
    );
    for (const analysis of analyses) {
      const measurement = analysis.getMeasurementXY({
        xLabel: 'Vd',
        xUnits: 'V',
        yLabel: 'C_dens',
        yUnits: 'F/mm',
      });
      expect(measurement?.meta?.capacitanceIntegral).toBeDefined();
      const res = JSON.parse(measurement?.meta?.capacitanceIntegral ?? '');
      expect(res?.integral.value).toBeCloseTo(2.1483e-11, 10);
    }
  });
});

const mosFilename = '../../../testFiles/B1505/Capacitance/mos_cap.csv';
describe('Capacitance integral on MOSFET', () => {
  it('Response object', () => {
    const analyses = fromB1505(
      readFileSync(join(__dirname, mosFilename), 'latin1'),
    );
    for (const analysis of analyses) {
      const measurement = analysis.getMeasurementXY({
        xLabel: 'VBias',
        xUnits: 'V',
        yLabel: 'C_dens',
        yUnits: 'F/mm',
      });
      if (measurement) {
        const res = capacitanceIntegral(measurement);
        expect(res?.integral.value).toBeCloseTo(1.3615e-8, 8);
      } else {
        expect(measurement).not.toBeNull();
      }
    }
  });

  it('Auto save', () => {
    const analyses = fromMOSCapacitance(
      readFileSync(join(__dirname, mosFilename), 'latin1'),
    );
    for (const analysis of analyses) {
      const measurement = analysis.getMeasurementXY({
        xLabel: 'VBias',
        xUnits: 'V',
        yLabel: 'C_dens',
        yUnits: 'F/mm',
      });
      expect(measurement?.meta?.capacitanceIntegral).toBeDefined();
      const res = JSON.parse(measurement?.meta?.capacitanceIntegral ?? '');
      expect(res?.integral.value).toBeCloseTo(1.3615e-8, 8);
    }
  });
});
