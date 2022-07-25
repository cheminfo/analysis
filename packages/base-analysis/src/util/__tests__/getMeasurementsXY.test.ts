import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { MeasurementXYWithId } from '../../types/MeasurementXYWithId';
import { getMeasurementsXY } from '../getMeasurementsXY';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

const measurements: MeasurementXYWithId[] = [
  {
    id: '1',
    variables: {
      x: {
        data: Float64Array.from([1, 2]),
        units: 'mg',
        label: 'Weight [mg]',
      },
      y: {
        data: [3, 4],
        units: 'mL',
        label: 'milliliters',
      },
      z: {
        data: [5, 6],
        units: '°C',
        label: 'Expected temperature [°C]',
      },
      t: {
        data: Float64Array.from([7, 8]),
        units: 's',
        label: 'Time [s]',
      },
    },
  },
  {
    id: '2',
    variables: {
      x: {
        data: [1, 2],
        units: 'mL',
        label: 'Volume [mL]',
      },
      y: {
        data: [3, 4],
        units: '°C',
        label: 'Temperature [°C]',
      },
    },
    title: 'My measurement',
    dataType: 'TGA',
    meta: {
      meta1: 'Meta 1',
      meta2: 'Meta 2',
    },
  },
  {
    id: '3',
    variables: {
      x: {
        data: [10, 20],
        units: 'g',
        label: 'Weight',
      },
      y: {
        data: [30, 40],
        units: '°C',
        label: 'Temperature',
      },
    },
  },
];

describe('getMeasurementsXY', () => {
  it('No filter', () => {
    let xy = getMeasurementsXY(measurements, {});
    expect(xy).toHaveLength(3);
  });

  it('Many spectry with specific units', () => {
    let xy = getMeasurementsXY(measurements, { xUnits: 'ug', yUnits: '°C' });
    expect(xy).toHaveLength(2);
    expect(xy[1].variables).toStrictEqual({
      x: {
        units: 'ug',
        label: 'Weight',
        data: [10000000, 20000000],
        min: 10000000,
        max: 20000000,
        isMonotone: true,
      },
      y: {
        units: '°C',
        label: 'Temperature',
        data: [30, 40],
        min: 30,
        max: 40,
        isMonotone: true,
      },
    });
  });

  it('Measurement by labels', () => {
    let xy = getMeasurementsXY(measurements, {
      xLabel: 'Weight [mg]',
      yLabel: 'Temperature [°C]',
    })[0].variables;

    xy.x.data = Array.from(xy.x.data);
    expect(xy).toStrictEqual({
      x: {
        units: 'mg',
        label: 'Weight [mg]',
        data: [1, 2],
      },
      y: {
        units: '°C',
        label: 'Expected temperature [°C]',
        data: [5, 6],
      },
    });
  });
});