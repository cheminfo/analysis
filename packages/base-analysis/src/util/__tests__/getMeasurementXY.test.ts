import { MeasurementXYWithId } from '../../types/MeasurementXYWithId';
import { getMeasurementXY } from '../getMeasurementXY';

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
        units: '°C',
        label: 'Temperature [°C]',
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
        units: '',
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

describe('getMeasurementXY', () => {
  it('MeasurementXY by labels', () => {
    let xy = getMeasurementXY(measurements, {
      x: { label: 'Weight [mg]' },
      y: { label: 'Temperature [°C]' },
    })?.variables;

    // @ts-expect-error
    xy.x.data = Array.from(xy.x.data);
    expect(xy).toStrictEqual({
      x: {
        units: 'mg',
        label: 'Weight [mg]',
        data: [1, 2],
      },
      y: {
        units: '°C',
        label: 'Temperature [°C]',
        data: [3, 4],
      },
    });
  });

  it('MeasurementXY by partial labels', () => {
    let xy =
      getMeasurementXY(measurements, {
        x: { label: 'weight' },
        y: { label: 'temp' },
      })?.variables || {};

    // @ts-expect-error
    xy.x.data = Array.from(xy.x.data);
    expect(xy).toStrictEqual({
      x: {
        units: 'mg',
        label: 'Weight [mg]',
        data: [1, 2],
      },
      y: {
        units: '°C',
        label: 'Temperature [°C]',
        data: [3, 4],
      },
    });
  });

  it('MeasurementXY by units s vs g', () => {
    const selector = { x: { units: 's' }, y: { units: 'g' } };
    let xy = getMeasurementXY(measurements, selector)?.variables || {};

    // @ts-expect-error
    xy.x.data = Array.from(xy.x.data);
    expect(xy).toStrictEqual({
      x: {
        units: 's',
        label: 'Time [s]',
        data: [7, 8],
        min: 7,
        max: 8,
        isMonotone: true,
      },
      y: {
        units: 'g',
        label: 'Weight [g]',
        data: [0.001, 0.002],
        min: 0.001,
        max: 0.002,
        isMonotone: true,
      },
    });
  });

  it('MeasurementXY by units °C vs g', () => {
    let xy =
      getMeasurementXY(measurements, { x: { units: '°C' }, y: { units: 'g' } })
        ?.variables || {};

    // @ts-expect-error
    xy.x.data = Array.from(xy.x.data);
    expect(xy).toStrictEqual({
      x: {
        units: '°C',
        label: 'Temperature [°C]',
        data: [3, 4],
        min: 3,
        max: 4,
        isMonotone: true,
      },
      y: {
        units: 'g',
        label: 'Weight [g]',
        data: [0.001, 0.002],
        min: 0.001,
        max: 0.002,
        isMonotone: true,
      },
    });
  });

  it('MeasurementXY by dataType TGA', () => {
    let xy =
      getMeasurementXY(measurements, { dataType: 'TGA' })?.variables || {};

    // @ts-expect-error
    xy.x.data = Array.from(xy.x.data);
    expect(xy).toStrictEqual({
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
    });
  });

  it('MeasurementXY by title My', () => {
    let xy = getMeasurementXY(measurements, { title: 'My' })?.variables || {};

    // @ts-expect-error
    xy.x.data = Array.from(xy.x.data);
    expect(xy).toStrictEqual({
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
    });
  });

  it('MeasurementXY by meta meta2="Meta"', () => {
    let xy =
      getMeasurementXY(measurements, { meta: { meta2: 'meta' } })?.variables ||
      {};

    // @ts-expect-error
    xy.x.data = Array.from(xy.x.data);
    expect(xy).toStrictEqual({
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
    });
  });

  it('MeasurementXY by units L vs °F', () => {
    let xy = getMeasurementXY(measurements, {
      x: { units: 'L' },
      y: { units: '°F' },
    });
    expect(xy).toMatchCloseTo({
      title: 'My measurement',
      dataType: 'TGA',
      meta: { meta1: 'Meta 1', meta2: 'Meta 2' },
      variables: {
        x: {
          units: 'L',
          label: 'Volume [L]',
          data: [0.001, 0.002],
          min: 0.001,
          max: 0.002,
          isMonotone: true,
        },
        y: {
          units: '°F',
          label: 'Temperature [°F]',
          data: [37.4, 39.2],
          min: 37.4,
          max: 39.2,
          isMonotone: true,
        },
      },
    });
  });

  it('xVariable: t, yVariable: Z', () => {
    const selector = {
      x: { variable: 't' },
      y: { variable: 'Z' },
    };
    //@ts-expect-error variable in uppercase for the testcase
    let xy = getMeasurementXY(measurements, selector);
    expect(xy).toMatchObject({
      variables: {
        x: {
          units: 's',
          label: 'Time [s]',
        },
        y: {
          units: '°C',
          label: 'Expected temperature [°C]',
        },
      },
    });
  });
});
