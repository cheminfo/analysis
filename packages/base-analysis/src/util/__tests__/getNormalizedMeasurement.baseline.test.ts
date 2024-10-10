import { getNormalizedMeasurement } from '../getNormalizedMeasurement';

describe('getNormalizedMeasurement baseline', () => {
  const measurement = {
    variables: {
      x: {
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        units: 's',
        label: 'X axis [s]',
      },
      y: {
        data: [2, 3, 4, 5, 30, 7, 8, 9, 10, 11],
        units: '°C',
        label: 'Y axis [°C]',
      },
    },
  };

  it('airPLSBaseline', () => {
    const normalized = getNormalizedMeasurement(measurement, {
      filters: [{ name: 'airPLSBaseline' }],
    });
    expect(normalized.variables.y.data).toMatchCloseTo([
      -3.134444079621124, -2.4478884875832367, -1.768911122709742,
      -1.1043811169738778, 23.5369487654199, 0.17827864781367708,
      0.8334394603035724, 1.5141848751660767, 2.2126020080923636,
      2.9205472800839676,
    ]);
  });

  it('rollingaveragebaseline', () => {
    const normalized = getNormalizedMeasurement(measurement, {
      filters: [{ name: 'rollingAverageBaseline' }],
    });
    expect(Array.from(normalized.variables.y.data)).toMatchCloseTo([
      0, 0.5, 0.5, 0.5, 12.5, -11.5, 0.5, 0.5, 0.5, 0.5,
    ]);
  });

  it('iterativepolynomialbaseline', () => {
    const normalized = getNormalizedMeasurement(measurement, {
      filters: [{ name: 'iterativePolynomialBaseline' }],
    });
    expect(normalized.variables.y.data).toMatchCloseTo([
      2.8027267837051744, 1.391581607428921, 0.49299960881358595,
      0.01931655737200977, 23.883170619799778, 0, 0.2740427530456975,
      0.6263371572550227, 0.9667213421160419, 1.208391608391885,
    ]);
  });

  it('rollingballbaseline', () => {
    const normalized = getNormalizedMeasurement(measurement, {
      filters: [{ name: 'rollingBallBaseline' }],
    });
    expect(Array.from(normalized.variables.y.data)).toMatchCloseTo([
      -1.5, -1, -1.333, -1.333, 22.666, -1, -1, -1, -0.666, 0,
    ]);
  });

  it('rollingmedianbaseline', () => {
    const normalized = getNormalizedMeasurement(measurement, {
      filters: [{ name: 'rollingMedianBaseline' }],
    });
    expect(Array.from(normalized.variables.y.data)).toMatchCloseTo([
      0, 1, 1, 1, 25, 0, 1, 1, 1, 1,
    ]);
  });
});
