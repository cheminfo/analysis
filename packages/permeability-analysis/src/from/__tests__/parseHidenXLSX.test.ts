import { readFileSync } from 'fs';
import { join } from 'path';

import { parseHidenXLSX } from '../parseHidenXLSX';

describe('parseHidenXLSX', () => {
  it('should work', () => {
    const binary = readFileSync(join(__dirname, 'data/hiden.export.xlsx'));
    const result = parseHidenXLSX(binary);
    expect(result.scanSetup.Hydrogen).toStrictEqual({
      'Gas Name': 'Hydrogen',
      Detector: 'SEM',
      'Unique Peak Level': 100,
      'Ignore Peak Level': 5,
      'High Range': -7,
      'Start Range': -7,
      'Low Range': -13,
      'Dwell Speeds': 'Normal',
      'Settle Speeds': 'Normal',
      Background: 0,
      Calibration: 2.7051,
      Filament: 'F1',
      'Multiplier Voltage': 1235,
      'Settle Fast': 5,
      'Settle Default': 250,
      'Settle Slow': 400,
      'Dwell Fast': 25,
      'Dwell Default': 150,
      'Dwell Slow': 2750,
      Scan: 'Scan 0',
      'Acquisition Cycles': 0,
      'Autorange High': -7,
      'Autorange Low': -13,
      'Changes to environment parameters': 'electron-energy 70 emission 20',
      'Device to Scan': 'mass',
      Dwell: 150,
      Increment: 1,
      'Input Device': 'SEM',
      'Min Cycle Time': 0,
      Options: 'SaveScanDev:BeamOnBefore:,BeamOffAfter',
      'Relative Gain': 1,
      'Relative Sensitivity': 1,
      'Scan Mode': 1,
      Settle: 250,
      'Start Value': 2,
      'Stop Value': 2,
      'Use Auto Zero': true,
    });
    expect(Object.keys(result.data)).toStrictEqual([
      'Time',
      'Raw Data',
      'Corrected Data',
      '%',
      'ppm',
      'Pressure (torr)',
    ]);
    const time = result.data.Time['Elapsed Time (s)'];
    expect(time.label).toBe('Elapsed Time (s)');
    expect(time.data.slice(0, 20)).toStrictEqual([
      0.471, 9.079, 20.653, 32.228, 43.803, 62.619, 80.934, 99.249, 117.564,
      135.879, 154.194, 172.509, 190.824, 209.139, 227.454, 245.769, 264.084,
      282.399, 300.714, 319.029,
    ]);
  });
});
