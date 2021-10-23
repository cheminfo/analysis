import { readFileSync } from 'fs';
import { join } from 'path';

import { fromMettlerToledo } from '../fromMettlerToledo';

describe('fromMettlerToledo', () => {
  it('Absolute weight', () => {
    const arrayBuffer = readFileSync(
      join(__dirname, '../../../testFiles/mettlerToledoWeight.txt'),
    );

    const analysis = fromMettlerToledo(arrayBuffer);

    const measurement = analysis.getFirstMeasurement();

    expect(measurement.variables).toMatchObject({
      t: {
        units: 's',
        label: 'time',
        min: 0,
        max: 2250,
        isMonotone: true,
      },
      x: {
        units: '°C',
        label: 'Temperature recorded',
        min: 36.622,
        max: 658.132,
        isMonotone: false,
      },
      r: {
        units: '°C',
        label: 'Temperature programmed',
        min: 35,
        max: 650,
        isMonotone: false,
      },
      y: {
        units: 'mg',
        label: 'Weight',
        min: 2.304,
        max: 12.8038,
        isMonotone: false,
      },
    });

    expect(measurement.meta?.zones).toStrictEqual([
      {
        relativeMassLoss: 0.669395,
        massLoss: { value: 8.5696, units: 'mg' },
        from: { value: 38.13, units: '°C' },
        to: { value: 647.27, units: '°C' },
        kind: 'horizontal',
        inflectionPoint: { value: 397.19, units: '°C' },
        middlePoint: { value: 401.27, units: '°C' },
      },
      {
        relativeMassLoss: 0.15049400000000002,
        massLoss: { value: 1.9266, units: 'mg' },
        from: { value: 647.27, units: '°C' },
        to: { value: 649.22, units: '°C' },
        kind: 'horizontal',
        inflectionPoint: { value: 657.4, units: '°C' },
        middlePoint: { value: 658.13, units: '°C' },
      },
      {
        relativeMassLoss: 0.18011100000000002,
        massLoss: { value: 2.304700000000001, units: 'mg' },
        kind: 'Residual',
      },
    ]);

    expect(measurement.dataType).toBe('TGA');
    expect(measurement).toMatchObject({
      dataType: 'TGA',
      meta: {
        method: '650 TGA/DSC',
        holder: {
          kind: 'Alumina 70ul',
          mass: { units: 'mg', value: 179.215 },
          material: 'Ceramic',
        },
        sampleMass: { value: 12.8009, units: 'mg' },
        cheminfo: {
          method: '650 TGA/DSC',
        },
      },
    });
  });
});
