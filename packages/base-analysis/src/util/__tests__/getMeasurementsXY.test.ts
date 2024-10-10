import { MeasurementXYWithId } from '../../types/MeasurementXYWithId';
import { getMeasurementsXY } from '../getMeasurementsXY';

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
  it('No filter, we take variable x and y', () => {
    const xy = getMeasurementsXY(measurements, {});
    expect(xy).toHaveLength(3);
  });

  it('Empty x and y filter', () => {
    const xy = getMeasurementsXY(measurements, { x: {}, y: {} });
    expect(xy).toHaveLength(8);
  });

  it('Many spectry with specific units', () => {
    const xy = getMeasurementsXY(measurements, {
      x: { units: 'ug' },
      y: { units: '°C' },
    });
    expect(xy).toHaveLength(2);
    expect(xy[1].variables).toStrictEqual({
      x: {
        units: 'ug',
        label: 'Weight',
        data: [10000000, 20000000],
        min: 10000000,
        max: 20000000,
        isMonotonic: 1,
      },
      y: {
        units: '°C',
        label: 'Temperature',
        data: [30, 40],
        min: 30,
        max: 40,
        isMonotonic: 1,
      },
    });
  });

  it('Measurement by labels', () => {
    const xy = getMeasurementsXY(measurements, {
      x: { label: 'Weight [mg]' },
      y: { label: 'Temperature [°C]' },
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

  it('Measurement by y label regexp', () => {
    const xy = getMeasurementsXY(measurements, {
      y: { label: /temperature|milli/i },
    });

    expect(xy).toHaveLength(4);
    const xLabels = xy.map((xy) => xy.variables.x.label);
    const yLabels = xy.map((xy) => xy.variables.y.label);
    expect(xLabels).toStrictEqual([
      'Weight [mg]',
      'Weight [mg]',
      'Volume [mL]',
      'Weight',
    ]);
    expect(yLabels).toStrictEqual([
      'milliliters',
      'Expected temperature [°C]',
      'Temperature [°C]',
      'Temperature',
    ]);
  });

  it('mg versus °C', () => {
    const xy = getMeasurementsXY(measurements, {
      x: { units: 'mg' },
      y: { units: '°C' },
    });
    expect(xy).toHaveLength(2);
    expect(xy.map((xy) => xy.id)).toStrictEqual(['1', '3']);
  });
});
